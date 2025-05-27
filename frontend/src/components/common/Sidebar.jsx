import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full bg-white'>
      <Link to='/' className='flex justify-center md:justify-start text-xl font-bold p-4'>
        Dashboard
      </Link>
      <ul className='flex flex-col gap-3 mt-4'>
        <li className='flex justify-center md:justify-start'>
          <Link
            to='/'
            className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
          >
            <MdHomeFilled className='w-6 h-6' />
            <span className='text-lg hidden md:block'>Home</span>
          </Link>
        </li>
        <li className='flex justify-center md:justify-start'>
          <Link
            to='/animal/post'
            className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
          >
            <IoNotifications className='w-6 h-6' />
            <span className='text-lg hidden md:block'>Create Post</span>
          </Link>
        </li>
        <li className='flex justify-center md:justify-start'>
          <Link
            to='/profile'
            className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
          >
            <FaUser className='w-6 h-6' />
            <span className='text-lg hidden md:block'>Profile</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
