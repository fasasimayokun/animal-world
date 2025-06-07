'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Pencil, Trash2 } from 'lucide-react';
import { useAuthUser } from '../../hooks/useAuthUser';

const CommentPage = ({ animal }) => {
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState({});
  const [activeReply, setActiveReply] = useState(null);
  const [openReplies, setOpenReplies] = useState({}); // dropdown toggle state
  const [editingComment, setEditingComment] = useState(null);
  const [editingReply, setEditingReply] = useState(null);
  const [editText, setEditText] = useState('');

  const { data: currentUser } = useAuthUser();
  

   // Add comment
  const { mutate: addComment } = useMutation({
    mutationFn: async (text) => {
      const res = await fetch(`/api/comments/${animal._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not add comment');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', animal._id]);
      setCommentText('');
    },
  });

  // EDIT COMMENT
  const { mutate: editComment } = useMutation({
    mutationFn: async ({ commentId, text }) => {
      const res = await fetch(`/api/comments/update/${animal._id}/${commentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Edit failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', animal._id]);
      setEditingComment(null);
    },
  });

  // delete comments
  const { mutate: deleteComment } = useMutation({
    mutationFn: async (commentId) => {
      const res = await fetch(`/api/comments/${animal._id}/${commentId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
    },
    onSuccess: () => queryClient.invalidateQueries(['comments', animal._id]),
  });

  const { mutate: addReply } = useMutation({
    mutationFn: async ({ commentId, reply }) => {
      const res = await fetch(`/api/comments/reply/${animal._id}/${commentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: reply }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not add reply');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', animal._id]);
      setReplyText((prev) => ({ ...prev, [activeReply]: '' }));
      setActiveReply(null);
    },
  });

  const { mutate: editReply } = useMutation({
    mutationFn: async ({ commentId, replyId, text }) => {
      const res = await fetch(`/api/comments/reply/${animal._id}/${commentId}/${replyId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Edit reply failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', animal._id]);
      setEditingReply(null);
    },
  });

  const { mutate: deleteReply } = useMutation({
    mutationFn: async ({ commentId, replyId }) => {
      const res = await fetch(`/api/comments/${animal._id}/${commentId}/${replyId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete reply failed');
    },
    onSuccess: () => queryClient.invalidateQueries(['comments', animal._id]),
  });

  const { mutate: thumbs } = useMutation({
  mutationFn: async ({ type, commentId, replyId }) => {
    const url = replyId
      ? `/api/comments/vote/${animal._id}/comment/${commentId}/reply/${replyId}/${type}`
      : `/api/comments/vote/${animal._id}/comment/${commentId}/${type}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Vote failed');
    return { type, commentId, replyId };
  },

  // Optimistic update
  onMutate: async ({ type, commentId, replyId }) => {
    await queryClient.cancelQueries(['comments', animal._id]);

    const previousData = queryClient.getQueryData(['comments', animal._id]);

    queryClient.setQueryData(['comments', animal._id], (old) => {
      if (!old) return old;

      return {
        ...old,
        comments: old.comments.map((comment) => {
          // Handle reply thumbs
          if (replyId && comment._id === commentId) {
            return {
              ...comment,
              replies: comment.replies.map((reply) => {
                if (reply._id === replyId) {
                  const list = type === 'up' ? 'thumbsUp' : 'thumbsDown';
                  return {
                    ...reply,
                    [list]: [...(reply[list] || []), 'optimistic-temp-user'],
                  };
                }
                return reply;
              }),
            };
          }

          // Handle comment thumbs
          if (!replyId && comment._id === commentId) {
            const list = type === 'up' ? 'thumbsUp' : 'thumbsDown';
            return {
              ...comment,
              [list]: [...(comment[list] || []), 'optimistic-temp-user'],
            };
          }

          return comment;
        }),
      };
    });

    return { previousData };
  },

  onError: (err, variables, context) => {
    if (context?.previousData) {
      queryClient.setQueryData(['comments', animal._id], context.previousData);
    }
  },

  onSettled: () => {
    queryClient.invalidateQueries(['comments', animal._id]);
  },
});

  const handleVote = (type, commentId, replyId = null) => {
    thumbs({ type, commentId, replyId });
  };

  const toggleReplies = (commentId) => {
    setOpenReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  return (
    <div>
      <dialog id={`comments_modal${animal._id}`} className='modal border-none outline-none'>
        <div className='modal-box rounded border border-gray-600'>
          <h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
          <div className='flex flex-col gap-3 max-h-60 overflow-auto'>
            {animal.comments.length === 0 && (
              <p className='text-sm text-slate-500'>
                No comments yet 🤔 Be the first one 😉
              </p>
            )}
            {animal.comments.map((comment) => (
              <div key={comment._id} className='flex gap-2 items-start'>
                <div className='avatar'>
                  <div className='w-8 rounded-full'>
                    <img
                      src={comment.author?.profileImg || "/avatar-placeholder.png"}
                    />
                  </div>
                </div>
                <div className='flex flex-col w-full'>
                  <div className='flex items-center gap-1'>
                    <span className='font-bold'>{comment.author.fullname}</span>
                    <span className='text-gray-700 text-sm'>
                      @{comment.author.username}
                    </span>
                  </div>
                  {editingComment === comment._id ? (
                    <form onSubmit={(e) => { e.preventDefault(); editComment({ commentId: comment._id, text: editText }); }}>
                      <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full border p-2 rounded" />
                        <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded mt-1">Update</button>
                    </form>
                    ) : (
                    <p className="text-sm">{comment.text}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <button onClick={() => handleVote('up', comment._id)}>
                      <div className="flex items-center gap-1">
                        <ThumbsUp size={16} />
                        <span>{comment.thumbsUp?.length || 0}</span>
                      </div>
                    </button>
                    <button onClick={() => handleVote('down', comment._id)}>
                      <div className="flex items-center gap-1">
                        <ThumbsDown size={16} />
                        <span>{comment.thumbsDown?.length || 0}</span>
                      </div>
                    </button>
                    {currentUser?._id === comment.author?._id && (
                      <>
                        <button onClick={() => { setEditingComment(comment._id); setEditText(comment.text); }}>
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => deleteComment(comment._id)}>
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() =>
                        setActiveReply(activeReply === comment._id ? null : comment._id)
                      }
                      className="text-blue-600"
                    >
                      {activeReply === comment._id ? 'Cancel' : 'Reply'}
                    </button>

                    {/* Toggle for showing replies */}
                    {comment.replies.length > 0 && (
                      <button
                        onClick={() => toggleReplies(comment._id)}
                        className="text-gray-600 text-sm"
                      >
                        {openReplies[comment._id] ? 'Hide Replies' : `View Replies (${comment.replies.length})`}
                      </button>
                    )}
                  </div>

                  {/* Reply form */}
                  {activeReply === comment._id && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (replyText[comment._id]?.trim()) {
                          addReply({ commentId: comment._id, reply: replyText[comment._id] });
                        }
                      }}
                      className="mt-2"
                    >
                      <textarea
                        className="w-full border rounded-md px-2 py-1 text-sm"
                        placeholder="Write a reply..."
                        value={replyText[comment._id] || ''}
                        onChange={(e) =>
                          setReplyText((prev) => ({
                            ...prev,
                            [comment._id]: e.target.value,
                          }))
                        }
                      />
                      <button
                        type="submit"
                        className="text-white bg-blue-500 px-3 py-1 mt-1 rounded-md text-sm"
                      >
                        Reply
                      </button>
                    </form>
                  )}

                  {/* Replies shown only if toggled */}
                  {openReplies[comment._id] && comment.replies.length > 0 && (
                    <div className="ml-4 mt-2 space-y-2">
                      {comment.replies.map((reply) => (
                        <div
                          key={reply._id}
                          className="border-l-2 border-gray-300 pl-3 text-sm"
                        >
                          <p className="font-medium text-xs">@{reply.author?.username || 'User'}</p>
                          {editingReply === reply._id ? (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                editReply({
                                  commentId: comment._id,
                                  replyId: reply._id,
                                  text: editText,
                                });
                              }}
                            >
                              <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="w-full border p-1 rounded text-sm"
                              />
                              <button
                                type="submit"
                                className="bg-blue-500 text-white px-2 py-1 mt-1 rounded text-xs"
                              >
                                Update
                              </button>
                            </form>
                          ) : (
                            <p className="text-xs">{reply.text}</p>
                          )}
                          <div className="flex items-center gap-2 text-xs mt-1">
                            <button onClick={() => handleVote('up', comment._id, reply._id)}>
                              <div className="flex items-center gap-1">
                                <ThumbsUp size={14} />
                                <span>{reply.thumbsUp?.length || 0}</span>
                              </div>
                            </button>
                            <button onClick={() => handleVote('down', comment._id, reply._id)}>
                              <div className="flex items-center gap-1">
                                <ThumbsDown size={14} />
                                <span>{reply.thumbsDown?.length || 0}</span>
                              </div>
                            </button>
                            {currentUser?._id === reply.author?._id && (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingReply(reply._id);
                                    setEditText(reply.text);
                                  }}
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  onClick={() =>
                                    deleteReply({ commentId: comment._id, replyId: reply._id })
                                  }
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Comment Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (commentText.trim()) {
                addComment(commentText);
              }
            }}
            className="flex gap-2 mt-3"
          >
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              type="submit"
              className="text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Post
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="outline-none">close</button>
        </form>
      </dialog>
    </div>
  );
};

export default CommentPage;
