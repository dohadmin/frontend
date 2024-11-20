import { Mail, Pencil, Phone, Trash } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import Modal from "../../ui/Modal.jsx";
import DeleteModal from "../../ui/DeleteModal.jsx";
import { getColorForInitial } from "../../../utils/NameColor.js";
import { toast } from 'react-toastify';
import { GridLoader } from "react-spinners";
import UpdateTraineeForm from "../../trainer/forms/UpdateTraineeForm.jsx";
import useAccountStore from "../../../stores/trainer/AccountStore.js";

const TraineeBranch = ({ setActiveBranch, setData }) => {
  const queryClient = useQueryClient();
  const user = useAccountStore(state => state.user);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState(null);

  const trainees = useAccountStore(state => state.trainees);
  const setTrainees = useAccountStore(state => state.setTrainees);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleOpenEditModal = (e, trainee) => {
    e.stopPropagation();
    setSelectedTrainee(trainee);
    setEditOpen(true);
  };

  const handleOpenDeleteModal = (e, trainee) => {
    e.stopPropagation();
    setSelectedTrainee(trainee);
    setDeleteOpen(true);
  };

  const { isLoading, isError } = useQuery({
    queryKey: ['trainerTraineesTableData'],
    queryFn: async () => {
      try {
        const response = await axios.get(`http://localhost:8080/account/get-trainees`);
        setTrainees(response.data);
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
  if (isError) return <div>Error fetching data</div>;

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/account/delete-user/${selectedTrainee.credentialId}`);
      queryClient.invalidateQueries({ queryKey: ['trainerTraineesTableData'] });
      toast.success(`${selectedTrainee.firstName} ${selectedTrainee.lastName}'s account has been deleted`);
      setDeleteOpen(false);
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <div className="w-full h-full flex flex-col overflow-x-hidden">
      <div
        className="h-16  grid grid-cols-6 border-b border-stone-200 text-sm text-gray-950 font-medium overflow-y-scroll "
        style={{ gridTemplateColumns: 'auto 20% 20% 15% 15% 5%' }}
      >
        {["Full Name", "Email", "Phone Number", "Control No.", "Joined at"].map((header, index) => (
          <div key={index} className="uppercase px-4 h-full flex items-center justify-start">
            {header}
          </div>
        ))}
      </div>
      <div className="flex flex-col h-full overflow-y-scroll ">
        {trainees.map((trainee, index) => {
          const initials = trainee.firstName[0] + trainee.lastName[0];
          const bgColor = getColorForInitial(initials[0]);
          const isYou = trainee._id === user._id;

          return (
            <div
              key={index}
              className="h-16 grid grid-flow-col text-sm text-stone-900 font-medium border-b border-stone-200 cursor-pointer"
              style={{ gridTemplateColumns: 'auto 20% 20% 15% 15% 5%' }}
              onClick={() => {
                setActiveBranch("viewTrainee");
                setData(trainee);
              }}
            >
              <div className="px-4 h-full flex items-center justify-start  border-stone-200">
                {trainee.avatar ? (
                  <img src={trainee.avatar} alt="avatar" className="w-9 h-9 rounded-full mr-2" />
                ) : (
                  <div className={`w-9 h-9 rounded-full ${bgColor} text-white flex items-center justify-center mr-2`}>
                    {initials}
                  </div>
                )}
                <div className="flex items-start justify-center gap-2">
                  <p className="text-gray-700 text-sm">
                    {trainee.firstName + " " + trainee.middleInitial + " " + trainee.lastName}
                  </p>
                  <span className="uppercase text-xs ring-1 ring-cyan-500 rounded-md bg-cyan-50 text-cyan-500 px-2 py-1">Trainee</span>
                </div>
                {isYou && <span className="uppercase text-xs px-2 h-5 flex items-center justify-center rounded-full text-purple-500 bg-purple-100 ml-2">You</span>}
              </div>
              <div className="px-4 h-full flex items-center justify-start gap-2  border-stone-200">
                <Mail className="w-4 h-4 stroke-white fill-stone-500" />
                {trainee.email}
              </div>
              <div className="px-4 h-full flex items-center justify-start gap-2  border-stone-200">
                <Phone className="w-4 h-4 stroke-white fill-stone-500" />
                {"(+63) " + trainee.phoneNumber}
              </div>
              <div className="px-4 h-full flex items-center justify-start gap-2  border-stone-200">
                #{trainee.controlNumber}
              </div>
              <div className="px-4 h-full flex items-center justify-start gap-2  border-stone-200">
                {formatDate(trainee.createdAt)}
              </div>
              <div className="px-8 h-full flex items-center justify-center  border-stone-200">
                {!isYou &&
                  <>
                    <button
                      className="w-10 h-10 flex-shrink-0 flex items-center justify-center"
                      type="button"
                      onClick={(e) => handleOpenEditModal(e, trainee)}
                    >
                      <Pencil className="w-4 h-4 stroke-gray-500" />
                    </button>
                    <button
                      className="w-10 h-10 flex-shrink-0 flex items-center justify-center"
                      type="button"
                      onClick={(e) => handleOpenDeleteModal(e, trainee)}
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
      {selectedTrainee && (
        <DeleteModal
          isOpen={isDeleteOpen}
          setOpen={setDeleteOpen}
          title={"Delete Account"}
          subtitle={"Are you sure you want to delete " + selectedTrainee.firstName + " " + selectedTrainee.lastName + "'s account? This action cannot be undone."}
          onDelete={handleConfirmDelete}
        />
      )}
      {selectedTrainee && (
        <Modal
          isOpen={isEditOpen}
          setOpen={setEditOpen}
          title={"Edit " + selectedTrainee.firstName + " " + selectedTrainee.lastName + "'s Account"}
        >
          <UpdateTraineeForm setOpen={setEditOpen} trainee={selectedTrainee} setData={setData} />
        </Modal>
      )}
    </div>
  );
};

export default TraineeBranch;