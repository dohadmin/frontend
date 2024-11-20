import { Building2, Mail, Pencil, Phone, Trash } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAccountStore from "../../../stores/admin/AccountStore";
import axios from "axios";
import { useState } from "react";
import Modal from "../../ui/Modal";
import UpdateTrainerForm from "../forms/UpdateTrainerForm";
import { getColorForInitial } from "../../../utils/NameColor.js";
import DeleteModal from "../../ui/DeleteModal.jsx";
import { toast } from 'react-toastify';
import { GridLoader } from "react-spinners";

const TrainerBranch = ({ setActiveBranch, setData }) => {
  const queryClient = useQueryClient();
  const user = useAccountStore((state) => state.user);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);

  const trainers = useAccountStore((state) => state.trainers);
  const setTrainers = useAccountStore((state) => state.setTrainers);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleOpenEditModal = (e, trainer) => {
    e.stopPropagation();
    setSelectedTrainer(trainer);
    setEditOpen(true);
  };

  const handleOpenDeleteModal = (e, trainer) => {
    e.stopPropagation();
    setSelectedTrainer(trainer);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/account/delete-user/${selectedTrainer.credentialId}`);
      queryClient.invalidateQueries({ queryKey: ["adminTrainersTableData"] });
      toast.success(`${selectedTrainer.firstName} ${selectedTrainer.lastName}'s account has been deleted`);
      setDeleteOpen(false);
      setActiveBranch("Trainers");
    } catch (error) {
      console.log(error);
    }
  };

  const { isLoading, isError } = useQuery({
    queryKey: ["adminTrainersTableData"],
    queryFn: async () => {
      try {
        const response = await axios.get("http://localhost:8080/account/get-trainers");
        setTrainers(response.data);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    cacheTime: 0,
  });

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <GridLoader color="orange" size={15} />
      </div>
    );
  }
  if (isError) return <div>Error fetching data</div>;

  return (
    <div className="w-full h-full flex flex-col overflow-x-hidden">
      <div
        className="h-16  grid grid-cols-6 border-b border-stone-200 text-sm text-stone-950 font-medium overflow-y-scroll "
        style={{ gridTemplateColumns: "auto 20% 20% 15% 15% 5%" }}
      >
        {["Full Name", "Email", "Phone Number", "Agency", "Joined at"].map((header, index) => (
          <div key={index} className="uppercase px-4 h-full flex items-center justify-start">
            {header}
          </div>
        ))}
      </div>
      <div className="flex flex-col h-full overflow-y-scroll ">
        {trainers.map((trainer, index) => {
          const initials = trainer.firstName[0] + trainer.lastName[0];
          const bgColor = getColorForInitial(initials[0]);
          const isYou = trainer._id === user._id;

          return (
            <div
              key={index}
              className="h-16 grid grid-flow-col text-sm text-stone-900 font-medium border-b border-stone-200 cursor-pointer"
              style={{ gridTemplateColumns: "auto 20% 20% 15% 15% 5%" }}
              onClick={() => {
                setActiveBranch("ViewTrainer");
                setData(trainer);
              }}
            >
              <div className="px-4 h-full flex items-center justify-start  border-stone-200">
                {trainer.avatar ? (
                  <img src={trainer.avatar} alt="avatar" className="w-9 h-9 rounded-full mr-2" />
                ) : (
                  <div className={`w-9 h-9 rounded-full ${bgColor} text-white flex items-center justify-center mr-2`}>
                    {initials}
                  </div>
                )}
                <div className="flex items-start justify-center gap-2">
                  <p className="text-gray-700 text-sm">
                    {trainer.firstName + " " + trainer.middleInitial + " " + trainer.lastName}
                  </p>
                  <span className="uppercase text-xs bg-amber-50 rounded-md ring-1 ring-amber-500 text-amber-500 px-2 py-1">
                    Trainer
                  </span>
                </div>
                {isYou && (
                  <span className="uppercase text-xs px-2 h-5 flex items-center justify-center rounded-full text-purple-500 bg-purple-100 ml-2">
                    You
                  </span>
                )}
              </div>
              <div className="px-4 h-full flex items-center justify-start gap-2  border-stone-200">
                <Mail className="w-4 h-4 stroke-white fill-stone-500" />
                {trainer.email}
              </div>
              <div className="px-4 h-full flex items-center justify-start gap-2  border-stone-200">
                <Phone className="w-4 h-4 stroke-white fill-stone-500" />
                {"(+63) " + trainer.phoneNumber}
              </div>
              <div className="px-4 h-full flex items-center justify-start gap-2  border-stone-200">
                <Building2 className="w-4 h-4 stroke-white fill-stone-500" />
                {trainer.agency}
              </div>
              <div className="px-4 h-full flex items-center justify-start gap-2  border-stone-200">
                {formatDate(trainer.createdAt)}
              </div>
              <div className="px-8 h-full flex items-center justify-center  border-stone-200">
                {!isYou && (
                  <>
                    <button
                      className="w-10 h-10 flex-shrink-0 flex items-center justify-center"
                      type="button"
                      onClick={(e) => handleOpenEditModal(e, trainer)}
                    >
                      <Pencil className="w-4 h-4 stroke-gray-500" />
                    </button>
                    <button
                      className="w-10 h-10 flex-shrink-0 flex items-center justify-center"
                      type="button"
                      onClick={(e) => handleOpenDeleteModal(e, trainer)}
                    >
                      <Trash className="w-4 h-4 stroke-rose-500" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {selectedTrainer && (
        <DeleteModal
          isOpen={isDeleteOpen}
          setOpen={setDeleteOpen}
          title={"Delete Account"}
          subtitle={
            "Are you sure you want to delete " +
            selectedTrainer.firstName +
            " " +
            selectedTrainer.lastName +
            "'s account? This action cannot be undone."
          }
          onDelete={handleConfirmDelete}
        />
      )}
      {selectedTrainer && (
        <Modal
          isOpen={isEditOpen}
          setOpen={setEditOpen}
          title={"Edit " + selectedTrainer.firstName + " " + selectedTrainer.lastName + "'s Account"}
        >
          <UpdateTrainerForm setOpen={setEditOpen} trainer={selectedTrainer} setData={setData} />
        </Modal>
      )}
    </div>
  );
};

export default TrainerBranch;