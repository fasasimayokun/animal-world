import { MdHomeFilled } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { SiAnimalplanet } from "react-icons/si";
import { Link } from "react-router-dom";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Settings } from "lucide-react";
import { FilePlus } from "lucide-react";


const Sidebar = () => {
  const { data: authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  return (
    <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-base-300 w-20 md:w-full bg-base-100 text-base-content">

      <ul className="flex flex-col gap-3 mt-4">
        <li className="flex justify-center md:justify-start">
          <Link
            to="/"
            className="flex gap-3 items-center hover:bg-base-300 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
          >
            <MdHomeFilled className="w-6 h-6" />
            <span className="text-lg hidden md:block">Home</span>
          </Link>
        </li>
        <li className="flex justify-center md:justify-start">
          <Link
            to="/animals"
            className="flex gap-3 items-center hover:bg-base-300 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
          >
            <SiAnimalplanet className="w-6 h-6" />
            <span className="text-lg hidden md:block">Animals</span>
          </Link>
        </li>
        { authUser?.isadmin && (
        <li className="flex justify-center md:justify-start">
          <Link
            to="/animal/post"
            className="flex gap-3 items-center hover:bg-base-300 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
          >
            <FilePlus className="w-6 h-6" />
            <span className="text-lg hidden md:block">Create Post</span>
          </Link>
        </li>)
        }

        <li className="flex justify-center md:justify-start">
          <Link
            to={`/profile/${authUser?.username}`}
            className="flex gap-3 items-center hover:bg-base-300 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
          >
            <FaUser className="w-6 h-6" />
            <span className="text-lg hidden md:block">Profile</span>
          </Link>
        </li>

        <li className="flex justify-center md:justify-start">
          <Link
            to="/settings"
            className="flex gap-3 items-center hover:bg-base-300 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
          >
            <Settings className="size-4" />
            <span className="text-lg hidden md:block">Settings</span>
          </Link>
        </li>
      </ul>

      {authUser && (
        <Link
          to={`/profile/${authUser.username}`}
          className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-base-300 py-2 px-4 rounded-full"
        >
          <div className="avatar hidden md:inline-flex">
            <div className="w-8 rounded-full">
              <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
            </div>
          </div>

          <div className="flex justify-between flex-1">
            <div className="hidden md:block">
              <p className="font-bold text-sm text-base-content w-20 truncate">
                {authUser?.fullname}
              </p>
              <p className="text-sm text-secondary">@{authUser?.username}</p>
            </div>

            <BiLogOut
              className="w-5 h-5 cursor-pointer hover:text-error"
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
            />
          </div>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
