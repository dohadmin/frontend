import { ChevronDown, LogOut, Settings, ShieldCheckIcon, UserIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getColorForInitial } from "../../utils/NameColor.js";
import Modal from "../ui/Modal.jsx";
import EditTraineeSecurityForm from "./forms/EditTraineeSecurityForm.jsx";
import EditTraineeProfileForm from "./forms/EditTraineeProfileForm.jsx";

const Header = ({ name }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isEditProfileOpen, setEditProfileOpen] = useState(false);
  const [isEditSecurityOpen, setEditSecurityOpen] = useState(false);
  const modalRef = useRef(null);
  const token = localStorage.getItem("token");

  // Function to fetch role validation data
  const fetchValidateRole = async () => {
    try {
      const res = await axios.get("http://localhost:8080/auth/validate-role", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // Fetch user data with react-query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["trainerProfileData"],
    queryFn: fetchValidateRole,
  });

  // Handle clicking outside the dropdown
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Render loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  // Extracting initials and background color
  const initials = data?.user?.firstName[0] + data?.user?.lastName[0];
  const bgColor = getColorForInitial(initials ? initials[0] : "");




  return (
    <div className="w-full flex-1">
      {/* Modals */}
      <Modal isOpen={isEditProfileOpen} setOpen={setEditProfileOpen} title={"Edit your profile"}>
        <EditTraineeProfileForm setOpen={setEditProfileOpen} />
      </Modal>
      <Modal isOpen={isEditSecurityOpen} setOpen={setEditSecurityOpen} title={"Change your password"}>
        <EditTraineeSecurityForm setOpen={setEditSecurityOpen} />
      </Modal>

      {/* Header */}
      <div className="w-full h-16 flex items-center justify-between p-6 border-b border-stone-200">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{name}</h1>
        <div className="flex items-center justify-end w-80">
          <div className="flex items-center justify-end gap-2 p-2 rounded-md w-fit">
            {data.user.avatar ? (
              <img src={data.user.avatar} alt="profile" className="w-7 h-7 rounded-full flex-shrink-0" />
            ) : (
              <div className={`w-7 h-7 rounded-full ${bgColor} text-white flex items-center justify-center flex-shrink-0`}>
                {initials}
              </div>
            )}
            <div className="flex flex-col items-start justify-between flex-shrink-0 overflow-clip w-fit">
              <h1 className="text-sm font-semibold text-stone-950">
                {`${data.user.firstName} ${data.user.middleInitial || ""} ${data.user.lastName}`}
              </h1>
              <p className="text-xs text-gray-500 truncate break-all text-ellipsis">
                {data.user.email.length > 20 ? `${data.user.email.substring(0, 20)}...` : data.user.email}
              </p>
            </div>
          </div>

          {/* Settings Button */}
          <div
            ref={modalRef}
            className="relative w-10 h-10 flex items-center justify-center cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}
          >
            <Settings className="w-5 h-5 stroke-2 stroke-gray-500" />
            {open && (
              <div className="p-4 flex flex-col items-center gap-3 absolute top-12 right-0 w-40 ring-1 ring-gray-200 bg-white rounded-md z-50">
                <button
                  className="w-full flex justify-start items-start text-sm text-gray-700 gap-1"
                  onClick={() => setEditProfileOpen(true)}
                >
                  <UserIcon className="w-5 h-5 stroke-2 stroke-gray-500" />
                  Profile
                </button>
                <button
                  className="w-full flex justify-start items-start text-sm text-gray-700 gap-1"
                  onClick={() => setEditSecurityOpen(true)}
                >
                  <ShieldCheckIcon className="w-5 h-5 stroke-2 stroke-gray-500" />
                  Security
                </button>
                <hr className="w-full border-t border-gray-200" />
                <button
                  className="h- w-full flex items-center justify-start gap-2 font-medium text-base text-rose-500 text-sm"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
