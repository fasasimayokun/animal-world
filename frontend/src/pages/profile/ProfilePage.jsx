import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { formatMemberSinceDate } from "../../utils/date";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";
import { useAuthUser } from "../../hooks/useAuthUser";

const ProfilePage = () => {
	const [profileImg, setProfileImg] = useState(null);
	const profileImgRef = useRef(null);

	const { username } = useParams();
	const { data: authUser } = useAuthUser();

	const {
		data: user,
		isLoading,
		refetch,
		isRefetching
	} = useQuery({
		queryKey: ["userProfile", username],
		queryFn: async () => {
			const res = await fetch(`/api/auth/profile/${username}`);
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error || "Something went wrong");
			}
			return data;
		}
	});

	const { isUpdatingProfile, updateProfile } = useUpdateUserProfile();
	const isMyProfile = authUser?._id === user?._id;
	const memberSinceDate = formatMemberSinceDate(user?.createdAt);

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => setProfileImg(reader.result);
			reader.readAsDataURL(file);
		}
	};

	useEffect(() => {
		refetch();
	}, [username, refetch]);

	if (isLoading || isRefetching) return <ProfileHeaderSkeleton />;
	if (!user) return <p className='text-center text-lg mt-4'>User not found</p>;

	return (
		<div className='flex-[4_4_0] min-h-screen bg-base-100 mx-auto max-w-3xl ml-0'>

			{/* Top Bar */}
			<div className='flex items-center gap-4 px-4 py-3 border-b border-gray-700'>
				<Link to='/'>
					<FaArrowLeft className='w-5 h-5 text-primary' />
				</Link>
				<div>
					<p className='font-bold text-lg'>{user?.fullname}</p>
					<p className='text-sm text-gray-500'>@{user?.username}</p>
				</div>
			</div>

			{/* Cover */}
			<div className="relative h-48 w-full bg-cover bg-center bg-gray-300" style={{ backgroundImage: `url(${user?.coverImg || "/cover-placeholder.jpg"})` }}>
				{/* Avatar */}
				<div className='absolute -bottom-16 left-4'>
					<div className='w-32 h-32 rounded-full overflow-hidden relative border-4 border-base-100 shadow-lg group'>
						<img
							src={profileImg || user?.profileImg || "/avatar-placeholder.png"}
							alt='profile'
							className='object-cover w-full h-full'
						/>
						{isMyProfile && (
							<div
								className='absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center opacity-0 group-hover:opacity-100 transition cursor-pointer'
								onClick={() => profileImgRef.current?.click()}
							>
								<MdEdit className='text-white w-6 h-6' />
							</div>
						)}
						<input
							type='file'
							accept='image/*'
							hidden
							ref={profileImgRef}
							onChange={handleImgChange}
						/>
					</div>
				</div>
			</div>

			{/* Profile Details */}
			<div className='mt-20 px-4 space-y-3'>
				{/* Edit Buttons */}
				{isMyProfile && (
					<div className='flex justify-end gap-2'>
						<EditProfileModal authUser={authUser} />
						{profileImg && (
							<button
								className='btn btn-sm btn-primary rounded-full px-4 text-white'
								onClick={async () => {
									await updateProfile({ profileImg });
									setProfileImg(null);
								}}
							>
								{isUpdatingProfile ? "Updating..." : "Update"}
							</button>
						)}
					</div>
				)}

				<div>
					<h1 className='text-xl font-bold text-white'>{user?.fullname}</h1>
					<p className='text-gray-400'>@{user?.username}</p>
				</div>

				{/* Bio */}
				{user?.bio ? (
					<p className='text-sm'>{user.bio}</p>
				) : (
					<p className='text-sm italic text-slate-400'>
						{isMyProfile
							? "You haven't added a bio yet. Let people know more about you!"
							: "This user hasn't added a bio yet."}
					</p>
				)}

				{isMyProfile && (
					<Link
						to={`/profile/saved`}
						className='text-sm text-blue-500 hover:underline'
					>
						View saved posts
					</Link>
				)}


				<div className='flex items-center gap-2 text-gray-400 text-sm'>
					<IoCalendarOutline className='w-4 h-4' />
					<span>Joined {memberSinceDate}</span>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
