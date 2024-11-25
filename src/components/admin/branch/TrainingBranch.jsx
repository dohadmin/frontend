import { Building2, Mail, Pencil, Phone, Scroll, Trash } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAccountStore from "../../../stores/admin/AccountStore.js";
import axios from "axios";
import { useState } from "react";
import Modal from "../../ui/Modal.jsx";
import { getColorForInitial } from "../../../utils/NameColor.js";
import DeleteModal from "../../ui/DeleteModal.jsx";
import { toast } from 'react-toastify';
import ViewTrainingForm from "../forms/ViewTrainingForm.jsx";
import { GridLoader } from "react-spinners";
import EditAdminTrainingForm from "../../admin/forms/EditAdminTrainingForm.jsx";

const TrainingBranch = ({ setActiveBranch, setData }) => {
  const queryClient = useQueryClient();
  const user = useAccountStore((state) => state.user);

  const trainings = useAccountStore((state) => state.trainings);
  const setTrainings = useAccountStore((state) => state.setTrainings);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isViewOpen, setViewOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);


  const { isLoading, isError } = useQuery({
    queryKey: ["adminTrainingsTableData"],
    queryFn: async () => {
      try {
        const response = await axios.get("https://server-np0x.onrender.com/training/get-trainings");
        setTrainings(response.data);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    cacheTime: 0,
  });


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <GridLoader color="orange" size={15} />
      </div>
    );
  }  
    if (isError) return <div>Error fetching data</div>;


  
  const handleOpenEditModal = (e, training) => {
    e.stopPropagation();
    setSelectedTraining(training);
    setEditOpen(true);
  };


  const handleOpenViewModal = (e, training) => {
    e.stopPropagation();
    setSelectedTraining(training);
    setViewOpen(true);
  }

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`https://server-np0x.onrender.com/training/delete-training/${selectedTraining._id}`);
      queryClient.invalidateQueries({ queryKey: ["adminTrainingsTableData"] });
      toast.success(`${selectedTraining.title} has been deleted`);
      setDeleteOpen(false);
    } catch (error) {
      console.log(error);
    }
  };



  const getStatusColor = (status) => {
    switch (status) {
      case 'on hold':
        return {
          bg: 'bg-orange-50',
          text: 'text-orange-500',
          ring: 'ring-orange-500',
          label: "On Hold"
        };
      case 'released':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-500',
          ring: 'ring-emerald-500',
          label: "Released"
        };
      case 'declined':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-500',
          ring: 'ring-rose-500',
          label: "Declined"
        };
      default:
        return {
          bg: '',
          text: ''
        };
    }
  };





  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div
        className="h-16  grid grid-cols-6 border-b border-stone-200 text-sm text-gray950 font-medium overflow-y-scroll "
        style={{ gridTemplateColumns: "auto 25% 15% 15% 10% 15% 5%" }}
      >
        {["Trainer", "Title", "Trainees", "Certificates","Status" ,"Date"].map((header, index) => (
          <div key={index} className="uppercase px-4 h-full flex items-center justify-start">
            {header}
          </div>
        ))}
      </div>
      <div 
        className="flex flex-col overflow-y-scroll h-full "
        style={{ scrollbarGutter: "stable" }}
      >
        {trainings.map((training, index) => {
          const initials = training.trainerId.firstName[0] + training.trainerId.lastName[0];
          const bgColor = getColorForInitial(initials[0]);
          const { bg, text,label , ring } = getStatusColor(training.status);
          const validTrainees = training.trainees.filter(subTrainee => subTrainee.status === "trainees");
          const filteredTrainees = training.trainees.filter(
            trainee => Object.keys(trainee).length !== 0
          );
          return (
            <div
              key={index}
              className="h-16 grid grid-flow-col text-sm text-stone-900 font-medium border-b border-stone-200 cursor-pointer"
              style={{ gridTemplateColumns: "auto 25% 15% 15% 10% 15% 5%" }}
              onClick={() => {
                // setActiveBranch("ViewTrianing");
                setData(training);
              }}
            >
              <div className="px-4 h-full flex items-center justify-start  border-stone-200">
                {training.trainerId.avatar ? (
                  <img src={training.trainerId.avatar} alt="avatar" className="w-9 h-9 rounded-full mr-2" />
                ) : (
                  <div className={`w-9 h-9 rounded-full ${bgColor} text-white flex items-center justify-center mr-2`}>
                    {initials}
                  </div>
                )}
                {training.trainerId.firstName + " " + training.trainerId.middleInitial + " " + training.trainerId.lastName}
              </div>
              <div className="px-4 h-full flex items-center justify-start  border-stone-200">
                 <span className="truncate max-w-full overflow-hidden">
                  {training.title}
                </span>
              </div>
              <div className="px-4 h-full  items-center flex items-cener justify-start gap-2  border-stone-200 relative">
               {validTrainees.length > 0 ? (
                  training.trainees.slice(0,5).map((trainee, index) => {
                    const initials = trainee.id.firstName[0] + trainee.id.lastName[0];
                    const bgColor = getColorForInitial(initials[0]);
                    return (
                      <div key={trainee.id._id} className="ml-4 absolute" style={{ left: `${20 * index}px` }}>
                        <div className="w-8 h-8 rounded-full ring-2 ring-white flex items-center justify-center flex-shrink-0">
                          {trainee.id.avatar ? (
                            <img src={trainee.id.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                          ) : (
                            <div className={`w-8 h-8 rounded-full ${bgColor} text-white flex items-center justify-center flex-shrink-0`}>
                              {initials}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ):(
                  <div className="text-gray-500">No Trainees</div>
                )}
              </div>
              <div className="px-4 h-full flex items-center justify-start gap-2  border-stone-200">
                <Scroll className="w-4 h-4 stroke-2 stroke-gray-500" />
                {training.certificates.length} {training.certificates.length === 1 ? "certificate" : "certificates"}              
              </div>
              <div className="px-4 h-full flex items-center justify-start gap-2  border-stone-200" >
                <span className={` px-2 py-1 ring-1 rounded-md text-xs uppercase ${text} ${bg} ${ring}`}>
                  {label}
                </span>
              </div>
              <div className="px-4 h-full flex items-center justify-start gap-2  border-stone-200">
                {formatDate(training.createdAt)}
              </div>
              <div className="px-8 h-full flex items-center justify-center  border-stone-200">
              {filteredTrainees.length > 0 ? (
                training.status === "on hold" ? (
                  <button
                    className="text-xs uppercase px-4 py-2 rounded-md text-amber-500"
                    onClick={(e) => handleOpenEditModal(e, training)}
                  >
                    Release
                  </button>
                ) : (
                  <button
                    className="text-xs uppercase px-4 py-2 rounded-md text-amber-500"
                    onClick={(e) => handleOpenViewModal(e, training)}
                  >
                    View
                  </button>
                )
              ) : null}

                {/* <button
                  className="w-10 h-10 flex-shrink-0 flex items-center justify-center"
                  type="button"
                  onClick={(e) => handleOpenDeleteModal(e, training)}
                >
                  <Trash className="w-4 h-4 stroke-rose-500" />
                </button> */}
              </div>
            </div>
          );
        })}
      </div>
      {selectedTraining && (
        <Modal
          isOpen={isEditOpen}
          setOpen={setEditOpen}
          title={"Release " + selectedTraining.title}
        >
          <EditAdminTrainingForm selectedTraining={selectedTraining}  setOpen={setEditOpen} />
        </Modal>
      )} 
      {selectedTraining && (
        <Modal
          isOpen={isViewOpen}
          setOpen={setViewOpen}
          title={"View " + selectedTraining.title}
        >
          <ViewTrainingForm selectedTraining={selectedTraining} />
        </Modal>
      )}
      {selectedTraining && (
        <DeleteModal
          isOpen={isDeleteOpen}
          setOpen={setDeleteOpen}
          title={"Delete Training"}
          subtitle={"Are you sure you want to delete " + selectedTraining.title + "'s account? This action cannot be undone."}
          onDelete={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default TrainingBranch;
