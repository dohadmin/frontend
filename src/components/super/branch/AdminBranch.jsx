import { Mail, Pencil, Phone, Trash } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAccountStore from "../../../stores/admin/AccountStore.js";
import axios from "axios";
import { useState } from "react";
import Modal from "../../ui/Modal.jsx";
import DeleteModal from "../../ui/DeleteModal.jsx";
import { getColorForInitial } from "../../../utils/NameColor.js";
import { toast } from 'react-toastify';
import { GridLoader } from "react-spinners";
import UpdateAdminForm from "../forms/UpdateAdminForm.jsx";

const AdminBranch = () => {
  const queryClient = useQueryClient();
  const user = useAccountStore(state => state.user);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const admins = useAccountStore(state => state.admins);
  const setAdmins = useAccountStore(state => state.setAdmins);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  const handleOpenEditModal = (e, admin) => {
    e.stopPropagation();
    setSelectedAdmin(admin);
    setEditOpen(true);
  };

  const handleOpenDeleteModal = (e, admin) => {
    e.stopPropagation();
    setSelectedAdmin(admin);
    setDeleteOpen(true);
  };

  const { isLoading } = useQuery({
    queryKey: ['superAdminsTableData'],
    queryFn: async () => {
      try {
        const response = await axios.get('https://server-np0x.onrender.com/account/get-admins');
        setAdmins(response.data);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <GridLoader color="orange" size={15} />
      </div>
    );
  }

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`https://server-np0x.onrender.com/account/delete-admin/${selectedAdmin._id}`);
      queryClient.invalidateQueries({ queryKey: ['superAdminsTableData'] });
      toast.success(`${selectedAdmin.firstName} ${selectedAdmin.lastName}'s account has been deleted`);
      setDeleteOpen(false);
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <div className="w-full h-full flex flex-col overflow-x-hidden">
      <div
        className="h-16 grid grid-cols-6 border-b border-stone-200 text-sm text-gray-950 font-medium overflow-y-scroll "
        style={{ gridTemplateColumns: 'auto 20% 20% 15% 15% 5%' }}
      >
        {["Full Name", "Email", "Phone Number", "Agency", "Joined at"].map((header, index) => (
          <div key={index} className="uppercase px-4 h-full flex items-center justify-start">
            {header}
          </div>
        ))}
      </div>
      <div className="flex flex-col h-full overflow-y-scroll ">
        {admins.map((admin, index) => {
          const initials = admin.firstName[0] + admin.lastName[0];
          const bgColor = getColorForInitial(initials[0]);
          const isYou = admin._id === user._id;

          return (
            <div
              key={index}
              className="h-16 grid grid-flow-col text-sm text-stone-900 font-medium border-b border-stone-200 cursor-pointer"
              style={{ gridTemplateColumns: 'auto 20% 20% 15% 15% 5%' }}
            >
              <div className="px-4 h-full flex items-center justify-start  border-stone-200">
                {admin.avatar ? (
                  <img src={admin.avatar} alt="avatar" className="w-7 h-7 rounded-full mr-2" />
                ) : (
                  <div className={`w-7 h-7 rounded-full ${bgColor} text-white flex items-center justify-center mr-2`}>
                    {initials}
                  </div>
                )}
                <div className="flex items-start justify-center gap-2">
                  <p className="text-gray-700 text-sm">
                    {admin.firstName + " " + admin.middleInitial + " " + admin.lastName}
                  </p>
                  <span className="uppercase text-xs ring-1 ring-rose-500 rounded-md bg-rose-50 text-rose-500 px-2 py-1">Admin</span>
                </div>
              </div>
              <div className="px-4 h-full flex items-center justify-start gap-2  border-stone-200">
                <Mail className="w-4 h-4 stroke-white fill-stone-500" />
                {admin.email}
              </div>
              <div className="px-4 h-full flex items-center justify-start gap-2  border-stone-200">
                <Phone className="w-4 h-4 stroke-white fill-stone-500" />
                {"(+63) " + admin.phoneNumber}
              </div>
              <div className="px-4 h-full flex items-center justify-start gap-2  border-stone-200">
                {admin.agency}
              </div>
              <div className="px-4 h-full flex items-center justify-start gap-2  border-stone-200">
                {formatDate(admin.createdAt)}
              </div>
              <div className="px-8 h-full flex items-center justify-center  border-stone-200">
                {!isYou &&
                  <>
                    <button
                      className="w-10 h-10 flex-shrink-0 flex items-center justify-center"
                      type="button"
                      onClick={(e) => handleOpenEditModal(e, admin)}
                    >
                      <Pencil className="w-4 h-4 stroke-gray-500" />
                    </button>
                    <button
                      className="w-10 h-10 flex-shrink-0 flex items-center justify-center"
                      type="button"
                      onClick={(e) => handleOpenDeleteModal(e, admin)}
                    >
                      <Trash className="w-4 h-4 stroke-rose-500" />
                    </button>
                  </>
                }
              </div>
            </div>
          );
        })}
      </div>
      {selectedAdmin && (
        <DeleteModal
          isOpen={isDeleteOpen}
          setOpen={setDeleteOpen}
          title={"Delete Account"}
          subtitle={"Are you sure you want to delete " + selectedAdmin.firstName + " " + selectedAdmin.lastName + "'s account? This action cannot be undone."}
          onDelete={handleConfirmDelete}
        />
      )} 
     
      {selectedAdmin && (
        <Modal
          isOpen={isEditOpen}
          setOpen={setEditOpen}
          title={"Edit " + selectedAdmin.firstName + " " + selectedAdmin.lastName + "'s Account"}
        >
          <UpdateAdminForm setOpen={setEditOpen} admin={selectedAdmin}  />
        </Modal>
      )} 
    </div>
  );
};

export default AdminBranch;