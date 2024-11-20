import { BookCopy, Calendar, Cross, FootprintsIcon, Logs, Scroll, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../../public/logo.svg.png';

const Sidebar = () => {
  const location = useLocation()

  return (
    <div className="bg-slate-900  h-full w-[16rem] flex flex-col justify-between ">
      <div className="flex flex-col">
        <div className="flex flex-col gap-8 items-center justify-center w-full h-48 mt-4">
          <img src={Logo} alt="logo" className="w-24 h-24 rounded-full mx-auto mt-4" />
          <span className="text-xs uppercase px-2 py-1 rounded-md ring-1 ring-rose-500  text-rose-500 font-medium">Admin Access</span>
        </div>
        <div className="py-4 flex items-center justify-center flex-col">
          <Link 
            to="/admin/accounts" 
            className={`px-4 h-10 w-full flex items-center justify-start gap-2 text-base  ${location.pathname === "/admin/accounts" ? "text-rose-500" : "text-gray-400"}`}
          >
            <Users className="w-5 h-5 " />
            Accounts
          </Link>
          <Link 
            to="/admin/training" 
            className={`px-4 h-10 w-full flex items-center justify-start gap-2 text-base  ${location.pathname === "/admin/training" ? "text-rose-500" : "text-gray-400"}`}
          >
            <Cross className="w-5 h-5 " />
            Trainings
          </Link>
          <Link 
            to="/admin/certificate" 
            className={`px-4 h-10 w-full flex items-center justify-start gap-2 text-base t ${location.pathname === "/admin/certificate" ? "text-rose-500" : "text-gray-400"}`}
          >
            <Scroll className="w-5 h-5 " />
            Certificate
          </Link>
          <Link 
            to="/admin/audit" 
            className={`px-4 h-10 w-full flex items-center justify-start gap-2 text-base  ${location.pathname === "/admin/audit" ? "text-rose-500" : "text-gray-400"}`}
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