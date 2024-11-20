import { FootprintsIcon, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../../public/logo.svg.png';

const Sidebar = () => {
  const location = useLocation()

  return (
    <div className="bg-slate-950 h-full w-[16rem] flex flex-col justify-between ">
      <div className="flex flex-col">
        <div className="flex flex-col gap-8 items-center justify-center w-full h-48 mt-4">
          <img src={Logo} alt="logo" className="w-24 h-24 rounded-full mx-auto mt-4" />
          <span className="text-xs uppercase px-2 py-1 rounded-md ring-1 ring-purple-500  text-purple-500 font-medium">SUPER ADMIN Access</span>
        </div>
        <div className="py-4 flex items-center justify-center flex-col">
          <Link 
            to="/super/admins" 
            className={`px-4 h-10 w-full flex items-center justify-start gap-2 text-base ${location.pathname === "/super/admins" ? "text-purple-500" : "text-gray-300"}`}
          >
            <Users className="w-5 h-5 " />
            Admin
          </Link>
          <Link 
            to="/super/logs" 
            className={`px-4 h-10 w-full flex items-center justify-start gap-2 text-base ${location.pathname === "/super/logs" ? "text-purple-500" : "text-gray-300"}`}
          >
            <FootprintsIcon className="w-5 h-5 " />
            Audit Trail
          </Link>
        </div>  
      </div>
    </div>
  )
}

export default Sidebar