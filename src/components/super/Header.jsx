import { Bell, LogOut, Settings, ShieldCheckIcon, UserIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getColorForInitial } from "../../utils/NameColor.js";
import axios from "axios";
import Modal from "../ui/Modal.jsx";
import EditAdminProfileForm from '../admin/forms/EditAdminProfileForm.jsx';
import EditAdminSecurityForm from '../admin/forms/EditAdminSecurityForm.jsx';

const Header = ({ name }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isEditProfileOpen, setEditProfileOpen] = useState(false);
  const [isEditSecurityOpen, setEditSecurityOpen] = useState(false);
  const [ openNotif, setOpenNotif ] = useState(false);
  const modalRef = useRef(null);
  const queryClient = useQueryClient();
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
    queryKey: ["superProfileData"],
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


  const { data: notificationData , isLoading: isNotifLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const response = await axios.get("http://localhost:8080/notification/get-notifications");
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  })

  if (isLoading || isNotifLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error...</div>;
  }
  

  // Extracting initials and background color
  const initials = data?.user?.firstName[0] + data?.user?.lastName[0];
  const bgColor = getColorForInitial(initials ? initials[0] : "");

  
  const unReadNotifs = notificationData.filter((notif) => notif.didRead === false).length


  return (
    <div className="w-full flex-1">
      {/* Modals */}
      <Modal isOpen={isEditProfileOpen} setOpen={setEditProfileOpen} title={"Edit your profile"}>
        <EditAdminProfileForm setOpen={setEditProfileOpen} />
      </Modal>
      <Modal isOpen={isEditSecurityOpen} setOpen={setEditSecurityOpen} title={"Change your password"}>
        <EditAdminSecurityForm setOpen={setEditSecurityOpen} />
      </Modal>

      {/* Header */}
      <div className="w-full h-16 flex items-center justify-between p-6 border-b border-stone-200">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{name}</h1>
        <div className="flex items-center justify-end w-80">
          <button 
            className="w-4 h-4 mr-2 relative"
            onClick={()=> {

              setOpenNotif((prev) => !prev)
              try {
                axios.put("http://localhost:8080/notification/read-notification")
              } catch (error) {
                console.error(error)
              }
              queryClient.refetchQueries("notifications")
            }}
          >
            <Bell className="w-5 h-5 stroke-2 stroke-gray-500" />
            {unReadNotifs >0 &&
              <div className="w-4 h-4 bg-rose-500 rounded-full absolute -top-2 -right-2 text-xs text-white">
                {unReadNotifs}
              </div>
            }
            {openNotif && (
              <div className="p-4 flex flex-col items-center gap-3 absolute top-12 right-0 w-80 ring-1 ring-gray-200 bg-white rounded-md z-50">
                <h1 className="w-full text-start text-lg text-gray-700 font-medium">
                  Notification
                </h1>
                <div>
                  {notificationData.map((notif, index) => {

                    const traineeData = notif.traineeId;
                    const traineeInitials = traineeData.firstName[0] + traineeData.lastName[0];
                    const notifBgColor = getColorForInitial(traineeInitials ? traineeInitials[0] : "");
                    return (
                      <section 
                        className=" border-b border-gray-200 flex items-start justify-center gap-3"
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate('/trainee')
                        }}
                      >
                        <div className="flex items-center justify-center w-10 h-full pl-2 pt-2">
                          {traineeData.avatar ? (
                            <img src={traineeData.avatar} alt="avatar" className="w-9 h-9 rounded-full mr-2 flex-shrink-0" />
                          ) : (
                            <div className={`w-9 h-9 rounded-full ${notifBgColor} text-white flex items-center justify-center mr-2 flex-shrink-0`}>
                              {traineeInitials}
                            </div>
                          )}
                        </div>
                        <div key={index} className="w-full flex items-start justify-start gap-1 pb-4 rounded-md flex-col ">
                          <p className="text-md font-medium">{traineeData.firstName + " " + traineeData.middleInitial + " " + traineeData.lastName }</p>
                          <p className="text-xs text-gray-700 text-start">{notif.message}</p>
                        </div>
                      </section>
                    )})
                  }
                </div>
              </div>
            )}
          </button>
            
          <div className="flex items-center justify-end gap-2 p-2 rounded-md w-fit">
            {data.user.avatar ? (
              <img src={data.user.avatar} alt="profile" className="w-9 h-9 rounded-full flex-shrink-0" />
            ) : (
              <div className={`w-9 h-9 rounded-full ${bgColor} text-white flex items-center justify-center flex-shrink-0`}>
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
                  className="h- w-full flex items-center justify-start gap-2 font-medium text-rose-500 text-sm"
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
