import {  Mail, Phone, X } from 'lucide-react';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ViewTraineeRequestForm from '../forms/ViewTraineeRequestForm';
import { getColorForInitial } from '../../../utils/NameColor';
import Modal from '../../ui/Modal';
import { GridLoader } from 'react-spinners';
import EditRequestForm from '../forms/EditRequestForm';
import useAccountStore from '../../../stores/trainer/AccountStore';

const RequestBranch = () => {
  const user = useAccountStore((state) => state.user);
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [isOpen, setOpen] = useState(false);

  const requests = useAccountStore((state) => state.requests);
  const setRequests = useAccountStore((state) => state.setRequests);


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };



  const { isLoading, isError } = useQuery({
    queryKey: ['trainerTraineeRequestTableData'],
    queryFn: async () => {
      try {
        const response = await axios.get(`https://server-np0x.onrender.com/account/get-trainee-requests-by-id/${user._id}`);
        setRequests(response.data);
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

  const handleOpenModal = (account) => {
    setSelectedTrainee(account);
    setOpen(true);
  };




  return (
    <div className="w-full h-full flex flex-col overflow-x-hidden">
        
      {/*  */}
      <div 
        className="h-16 grid grid-cols-6 border-b border-stone-200 text-sm text-gray-950 font-medium overflow-y-scroll "
        style={{gridTemplateColumns: '20% 20% 15% 10% 15% 12% 8%'}}
        >
        {[  "Full Name", "Email", "Phone Number", "APPLIED ROLE", "Trainer", "Requested at", ""].map((header, index) => (
          <div key={index} className="uppercase px-4 h-full flex items-center justify-start">
            {header}
          </div>
        ))}
      </div>
      <div className="flex flex-col h-full overflow-y-scroll ">
        {requests.map((request, index) => {
          const initials = request.firstName[0] + request.lastName[0];
          const bgColor = getColorForInitial(initials[0]);

          const trainerInitials = request.trainerId ? request.trainerId.firstName[0] + request.trainerId.lastName[0] : '';
          const trainerBgColor = getColorForInitial(trainerInitials[0]);
          
          return (
            <div
              key={index}
              className="h-16 grid grid-flow-col text-sm text-stone-900 font-medium border-b border-stone-200 decoration-amber-500"
              style={{gridTemplateColumns: '20% 20% 15% 10% 15% 12% 8%'}}
            >
              <div className="px-4 h-full flex items-center justify-start  border-stone-200">
                {request.avatar ? (
                  <img src={request.avatar} alt="avatar" className="w-9 h-9 rounded-full mr-2" />
                ) : (
                  <div className={`w-9 h-9 rounded-full ${bgColor} text-white flex items-center justify-center mr-2`}>
                    {initials}
                  </div>
                )}
                {request.firstName + " " + request.middleInitial + " " + request.lastName}
              </div>
              <div className="px-4 h-full flex items-center justify-start gap-2  border-stone-200 truncate text-ellipsis overflow-clip">
                <Mail className="w-4 h-4 stroke-white fill-stone-500 "/>
                {request.email}
              </div>
              <div className="px-4 h-full flex items-center justify-start gap-2  border-stone-200">
                <Phone className="w-4 h-4 stroke-white fill-stone-500"/>
                {"(+63) " + request.phoneNumber}
              </div>
              <div className="px-4 h-full flex items-center justify-start  border-stone-200">
                <span className="px-2 py-1  flex items-center justify-center rounded-md text-xs uppercase ring-1 ring-cyan-500 bg-cyan-50 text-cyan-500">
                  Trainee
                </span>
              </div>
              <div className="px-4 h-full flex items-center justify-start  border-stone-200">
                <div className="px-4 h-full flex items-center justify-start border-stone-200">
                  {request.trainerId && request.trainerId.avatar ? (
                    <img src={request.trainerId.avatar} alt="avatar" className="w-6 h-6 rounded-full mr-2" />
                  ) : (
                    <div className={`w-7 h-7 rounded-full ${trainerBgColor} text-white flex items-center justify-center mr-2`}>
                      {trainerInitials}
                    </div>
                  )}
                  {request.trainerId ? request.trainerId.firstName + " " + request.trainerId.middleInitial + " " + request.trainerId.lastName : 'N/A'}
                </div>
              </div>
              <div className="px-4 h-full flex items-center justify-start gap-2  border-stone-200">
                {formatDate(request.createdAt)}
              </div>
              <div className="px-4 h-full flex items-center justify-center gap-2 border-stone-200 ">
                <button className="text-xs uppercase px-4 py-2 rounded-md text-amber-500"
                  onClick={() => handleOpenModal(request)}
                >
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {selectedTrainee && (
        <Modal
          isOpen={isOpen}
          setOpen={setOpen}
          title={"Edit " + selectedTrainee.firstName + " " + selectedTrainee.lastName + "'s Application"}
        >
          <EditRequestForm setOpen={setOpen} request={selectedTrainee} />
        </Modal>
      )}
    </div>
  );
};

export default RequestBranch;