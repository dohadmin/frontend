import React, { useState } from 'react'
import Button from '../../ui/Button';
import { PencilIcon, Scroll } from 'lucide-react';
import DeleteModal from '../../ui/DeleteModal';
import Modal from '../../ui/Modal';
import UpdateTraineeForm from '../forms/UpdateTraineeForm';
import { getColorForInitial } from '../../../utils/NameColor';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { GridLoader } from 'react-spinners';
import ViewTrainingForm from '../forms/ViewTrainingForm';
import EditTrainingForm from '../forms/EditTrainingForm';

const ViewTraineeBranch = ({setActiveBranch, selectedTrainee, setData}) => {

  const [ isOpen, setOpen ] = useState(false);
  const [ isDeleteOpen, setDeleteOpen ] = useState(false);
  const [ selectedTraining, setSelectedTraining ] = useState(null);
  const [ isViewOpen, setViewOpen ] = useState(false);
  const [ isEditOpen, setEditOpen ] = useState(false);
  

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleOpenViewModal = (e, selectedTraining ) => {
    setSelectedTraining(selectedTraining);
    e.stopPropagation();
    setViewOpen(true);
  }

  const handleOpenEditModal = (e, training) => {
    e.stopPropagation();
    setSelectedTraining(training);
    setEditOpen(true);
  }

  
  const handleDeleteModal = (e) => {
    e.stopPropagation();
    setDeleteOpen(true);
  }

  
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/account/delete-user/${selectedTrainee.credentialId}`);
      queryClient.invalidateQueries({queryKey: ['trainerTraineesTableData']})
      toast.success(`${selectedTrainee.firstName} ${selectedTrainee.lastName}'s account has been deleted`)
      setDeleteOpen(false)
      setActiveBranch("Trainees");

    } catch (error) {
      console.log(error)
    }
  }

  const initials = selectedTrainee?.firstName[0] + selectedTrainee?.lastName[0];
  const bgColor = getColorForInitial(initials ? initials[0] : "");



  const { data: trainings, isLoading, isError } = useQuery({
    queryKey: ["traineeTrainingsTableData", selectedTrainee._id],
    queryFn: async () => {
      try {
        const response = await axios.get(`http://localhost:8080/training/get-trainings-by-trainee/${selectedTrainee._id}`);
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
    <div className=" items-center justify-center gap-6 p-6 w-full h-full flex flex-col overflow-hidden">
      <div className="w-full flex-grow grid grid-cols-[20%_auto] gap-6 max-h-[20rem] h-full ">
        <div className="w-full h-full rounded-md ring-1 ring-gray-200 p-6 flex flex-col items-center justify-center bg-white">
          <div className="w-24 h-24 rounded-full">
            {selectedTrainee.avatar ? (
              <img src={selectedTrainee.avatar} alt="avatar" className="w-full h-full rounded-full" />
            ) : (
              <div className={`w-full h-full  text-4xl  rounded-full ${bgColor} text-white flex items-center justify-center flex-shrink-0`}>
                {initials}
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-2 mt-6">
            <h1 className="text-lg font-semibold text-gray-700">{selectedTrainee.firstName + " " + selectedTrainee.middleInitial + " " + selectedTrainee.lastName}</h1>
            {/* <span className=" uppercase text-xs px-2 py-1 rounded-md ring-1 ring-cyan-500 text-cyan-500 bg-cyan-50">Trainee</span> */}
          </div>
          <div className="flex items-center justify-center gap-1 mt-2">
            <span className="text-xs uppercase px-2 py-1 rounded-md ring-1 ring-cyan-500 bg-cyan-50 text-cyan-500">TRAINEE</span>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6  ">
            <button 
              className="text-white bg-rose-500 rounded-md h-10 px-4"
              onClick={handleDeleteModal}
            >
              Delete
            </button>
            <Button  
              className="px-4 flex items-center justify-center gap-1" 
              onClick={() => setOpen(true)}
            >
              <PencilIcon className="w-4 h-4 stroke-0 stroke-white fill-white" />
              Edit 
            </Button>
          </div>
        </div>
        <div className="w-full items-center h-full grid grid-flow-row grid-rows-[10%_auto_auto_auto] rounded-md ring-1 ring-gray-200 p-6 bg-white">
          <h1 className="text-xl font-medium text-gray-800">Personal Information</h1>
          <div className="grid grid-cols-4 grid-flow-col w-full">
            <div className="flex flex-col items-start justify-start gap-2">
              <p className="font-medium text-sm uppercase text-gray-500">Control Number</p>
              <p className="font-semibold text-gray-700 text-sm">#{selectedTrainee.controlNumber}</p>
            </div>
            <div className="flex flex-col items-start justify-start gap-2">
              <p className="font-medium text-sm uppercase text-gray-500">Email</p>
              <p className="font-medium text-gray-700 text-sm">{selectedTrainee.email}</p>
            </div>
            <div className="flex flex-col items-start justify-start gap-2">
              <p className="font-medium text-sm uppercase text-gray-500">Phone Number</p>
              <p className="font-medium text-gray-700 text-sm">+(63){ " " + selectedTrainee.phoneNumber}</p>
            </div>
            <div className="flex flex-col items-start justify-start gap-2">
              <p className="font-medium text-sm uppercase text-gray-500">Birthday</p>
              <p className="font-medium text-gray-700 text-sm">{formatDate(selectedTrainee.dateOfBirth)}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 grid-flow-col w-full">
            <div className="flex flex-col items-start justify-start gap-2">
              <p className="font-medium text-sm uppercase text-gray-500">Civil Status</p>
              <p className="font-medium text-gray-700 text-sm">{selectedTrainee.civilStatus}</p>
            </div>
            <div className="flex flex-col items-start justify-start gap-2">
              <p className="font-medium text-sm uppercase text-gray-500">Street</p>
              <p className="font-medium text-gray-700 text-sm">{selectedTrainee.street}</p>
            </div>
            <div className="flex flex-col items-start justify-start gap-2">
              <p className="font-medium text-sm uppercase text-gray-500">Municipality</p>
              <p className="font-medium text-gray-700 text-sm">{selectedTrainee.municipality}</p>
            </div>
            <div className="flex flex-col items-start justify-start gap-2">
              <p className="font-medium text-sm uppercase text-gray-500">City</p>
              <p className="font-medium text-gray-700 text-sm">{selectedTrainee.city}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 grid-flow-col w-full">
            <div className="flex flex-col items-start justify-start gap-2">
              <p className="font-medium text-sm uppercase text-gray-500">Province</p>
              <p className="font-medium text-gray-700 text-sm">{selectedTrainee.province}</p>
            </div>
            <div className="flex flex-col items-start justify-start gap-2">
              <p className="font-medium text-sm uppercase text-gray-500">Zip Code</p>
              <p className="font-medium text-gray-700 text-sm">{selectedTrainee.zipCode}</p>
            </div> 
            <div className="flex flex-col items-start justify-start gap-2">
              <p className="font-medium text-sm uppercase text-gray-500">Last updated</p>
              <p className="font-medium text-gray-700 text-sm">{formatDate(selectedTrainee.updatedAt)}</p>
            </div>
            <div className="flex flex-col items-start justify-start gap-2">
              <p className="font-medium text-sm uppercase text-gray-500">Joined at</p>
              <p className="font-medium text-gray-700 text-sm">{formatDate(selectedTrainee.createdAt)}</p>
            </div>
          </div>
        </div>

      </div>
      <div className="w-full justify-start h-full flex flex-col items-center  rounded-md ring-1 ring-gray-200 bg-white">
        {/* <h1 className="text-xl font-medium text-gray-800 w-full text-start px-4 pt-4 ">Tranings</h1> */}
        <div 
          className="h-12  w-full grid grid-cols-6 border-b border-stone-200 text-sm text-stone-500 font-medium overflow-x-hidden overflow-y-scroll "
          style={{ gridTemplateColumns: "auto 20% 20% 15% 15% 5%" }}
        >
          {[ "Title", "Trainer", "Certificates","Status" ,"Date"].map((header, index) => (
            <div key={index} className="uppercase px-4 h-full flex items-center justify-start">
              {header}
            </div>
          ))}
        </div>
        <div className="flex flex-col w-full overflow-x-hidden overflow-y-scroll h-full">
          {trainings.map((training, index) => {
            const initials = training.trainerId.firstName[0] + training.trainerId.lastName[0];
            const bgColor = getColorForInitial(initials[0]);
            const { bg, text,label , ring } = getStatusColor(training.status);
            return (
              <div
                key={index}
                className="h-16 grid grid-flow-col text-sm text-stone-900 font-medium border-b border-stone-200 cursor-pointer"
                style={{ gridTemplateColumns: "auto 20% 20% 15% 15% 5%" }}
                onClick={() => {

                }}
              >
                {/* <div className="px-4 h-full flex items-center justify-start  border-stone-200">
                  {training.trainerId.avatar ? (
                    <img src={training.trainerId.avatar} alt="avatar" className="w-6 h-6 rounded-full mr-2" />
                  ) : (
                    <div className={`w-7 h-7 rounded-full ${bgColor} text-white flex items-center justify-center mr-2`}>
                      {initials}
                    </div>
                  )}
                  {training.trainerId.firstName + " " + training.trainerId.middleInitial + " " + training.trainerId.lastName}
                </div> */}
                <div className="px-4 h-full flex items-center justify-start  border-stone-200">
                  <span className="truncate max-w-full overflow-hidden">
                    {training.title}
                  </span>
                </div>
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
                <div className="px-4 h-full flex items-center justify-start gap-2  border-stone-200">
                  <Scroll className="w-4 h-4 stroke-2 stroke-gray-500" />
                  {training.certificates.length} {training.certificates.length === 1 ? "certificate" : "certificates"}              
                </div>
                <div className="px-4 h-full flex items-center justify-start gap-2  border-stone-200" >
                  <span className={` px-2 py-1 rounded-md text-xs uppercase ring-1 ${text} ${bg} ${ring}`}>
                    {label}
                  </span>
                </div>
                <div className="px-4 h-full flex items-center justify-start gap-2  border-stone-200">
                  {formatDate(training.createdAt)}
                </div>
                <div className="px-8 h-full flex items-center justify-center  border-stone-200">
                  {training.status === "on hold" ? (
                    <button 
                      className="text-xs uppercase px-4 py-2 rounded-md text-amber-500"
                      onClick={(e) => handleOpenEditModal(e, training)}
                    >
                      Update
                    </button>
                  ) : (
                    <button 
                      className="text-xs uppercase px-4 py-2 rounded-md text-amber-500"
                      onClick={(e) => handleOpenViewModal(e, training)}
                    >
                      View
                    </button>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      </div>

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
        <Modal
          isOpen={isEditOpen}
          setOpen={setEditOpen}
          title={"Update " + selectedTraining.title}
        >
          <EditTrainingForm selectedTraining={selectedTraining} setOpen={setEditOpen} />
        </Modal>
      )} 

        
      <DeleteModal
        isOpen={isDeleteOpen}
        setOpen={setDeleteOpen}
        title={"Delete Account"}
        subtitle={"Are you sure you want to delete " + selectedTrainee.firstName + " " + selectedTrainee.lastName + "'s account?. This action cannot be undone."}
        onDelete={handleConfirmDelete}
      >
      </DeleteModal>
      <Modal
        isOpen={isOpen}
        setOpen={setOpen}
        title={"Edit " + selectedTrainee.firstName + " " + selectedTrainee.lastName + "'s Account"}
      >
        <UpdateTraineeForm setOpen={setOpen} trainee={selectedTrainee} setData={setData}/>          
      </Modal>
    </div>
  )
}

export default ViewTraineeBranch