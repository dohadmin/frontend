import { BookCopy, Calendar, CrossIcon, FootprintsIcon, Logs, Scroll, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../../public/logo.svg.png';

const Sidebar = () => {
  const location = useLocation()

  return (
    <div className="bg-slate-900  h-full w-[16rem] flex flex-col justify-between ">
      <div className="flex flex-col">
        <div className="flex flex-col gap-8 items-center justify-center w-full h-48 mt-4">
          <img src={Logo} alt="logo" className="w-24 h-24 rounded-full mx-auto mt-4" />
          <span className="text-xs uppercase px-2 py-1 rounded-md ring-1 ring-amber-500  text-amber-500 font-medium">Trainer Access</span>
        </div>
        <div className="py-4 flex items-center justify-center flex-col">
          <Link 
            to="/trainer/calendar" 
            className={`px-4 h-10 w-full flex items-center justify-start gap-2 text-base ${location.pathname === "/trainer/calendar" ? "text-amber-500" : "text-gray-400"}`}
          >
            <Calendar className="w-5 h-5 " />
            Calendar
          </Link>
          
          <Link 
            to="/trainer/trainees" 
            className={`px-4 h-10 w-full flex items-center justify-start gap-2 text-base ${location.pathname === "/trainer/trainees" ? "text-amber-500" : "text-gray-400"}`}
          >
            <Users className="w-5 h-5 " />
            Trainees
          </Link>
          <Link 
            to="/trainer/training" 
            className={`px-4 h-10 w-full flex items-center justify-start gap-2 text-base ${location.pathname === "/trainer/training" ? "text-amber-500" : "text-gray-400"}`}
          >
            <CrossIcon className="w-5 h-5 " />
            Trainings
          </Link>
          
        </div>  
      </div>
    </div>
  )
}

export default Sidebar