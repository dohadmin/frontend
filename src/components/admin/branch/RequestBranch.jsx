import { Check, Mail, Phone, X } from 'lucide-react';
import React, { useState } from 'react';
import useAccountStore from '../../../stores/admin/AccountStore';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ViewTraineeRequestForm from '../forms/ViewTraineeRequestForm';
import { getColorForInitial } from '../../../utils/NameColor';
import Modal from '../../ui/Modal';
import Checkbox from "react-custom-checkbox";
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import MultiSelectSchema from '../../../schemas/MultiSelectSchema';
import { toast } from 'react-toastify';
const RequestBranch = () => {
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [isOpen, setOpen] = useState(false);

  const requests = useAccountStore((state) => state.requests);
  const setRequests = useAccountStore((state) => state.setRequests);


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const { control, handleSubmit, formState: { errors }, reset, setError, getValues, setValue, watch} = useForm({
    resolver: zodResolver(MultiSelectSchema),
    defaultValues: {
      ids: [],
    }
  });


  const { isLoading, isError } = useQuery({
    queryKey: ['adminTraineeRequestTableData'],
    queryFn: async () => {
      try {
        const response = await axios.get('http://localhost:8080/account/get-trainee-requests');
        setRequests(response.data);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  const handleOpenModal = (account) => {
    setSelectedTrainee(account);
    setOpen(true);
  };


  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked;
    const allIds = isChecked ? requests.map(request => request._id) : [];
    setValue('ids', allIds);
  };

  const idLenghth = watch('ids').length;

  // const handleApproveAll = async () => {
  //   try {
  //     const res = await axios.post('http://localhost:8080/account/approve-all-trainee-requests', { ids: getValues('ids') });
  //     toast.success(res.data.message)
  //     invalidateQueries({ queryKey: ['adminTraineeRequestTableData'] });
  //     reset();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // {idLenghth > 0 && (
  //   <div className="flex items-center justify-between px-4 py-2 bg-amber-50 border-b border-stone-200">
  //     <div className="text-stone-900 font-medium text-sm">{idLenghth} selected</div>
  //     <div className="w-fit flex items-center justify-normal gap-4">
  //       {/* <button className="text-rose-500 font-medium text-sm" onClick={() => setValue('ids', [])}>
  //         Delete
  //       </button> */}
  //       <button
  //         className="text-amber-500 px-2 py-1 rounded-md text-sm  font-normal "
  //         onClick={handleApproveAll}
  //       >
  //         Approve
  //       </button>
  //     </div>
  //   </div>
  // )} 

  return (
    <div className="w-full h-full flex flex-col overflow-x-hidden">
        
      {/*  */}
      <div 
        className="h-12 bg-gray-50 grid grid-cols-6 border-b border-stone-200 text-sm text-stone-500 font-medium overflow-y-scroll "
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
              className="h-12 grid grid-flow-col text-sm text-stone-900 font-medium border-b border-stone-200 decoration-amber-500"
              style={{gridTemplateColumns: '20% 20% 15% 10% 15% 12% 8%'}}
            >
              {/* <div className="
                flex w-full h-full items-center justify-center ml-2
              ">
                <Controller
                  control={control}
                  name="ids" // Ensure this matches the field name in your schema
                  render={({ field: { value, onChange } }) => (
                    <Checkbox
                      checked={value.includes(request._id)} // Check if the ID is in the array
                      borderColor="#e5e7eb"
                      borderWidth={1}
                      icon={
                        <div
                          style={{
                            backgroundColor: "#f59e0b",
                            alignSelf: "stretch",
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 4,
                          }}
                        >
                          <Check color="white" />
                        </div>
                      }
                      borderRadius={4}
                      size={20}
                      onChange={(checked, event)=> {
                        const isChecked = checked;
                        if (isChecked) {
                          onChange([...value, request._id]); // Add the ID to the array
                        } else {
                          onChange(value.filter((id) => id !== request._id)); // Remove the ID from the array
                        }
                      }}
                    />
                  )}
                /> 
              </div> */}
              <div className="px-4 h-full flex items-center justify-start border-r border-stone-200">
                {request.avatar ? (
                  <img src={request.avatar} alt="avatar" className="w-6 h-6 rounded-full mr-2" />
                ) : (
                  <div className={`w-7 h-7 rounded-full ${bgColor} text-white flex items-center justify-center mr-2`}>
                    {initials}
                  </div>
                )}
                {request.firstName + " " + request.middleInitial + " " + request.lastName}
              </div>
              <div className="px-4 h-full flex items-center justify-start gap-2 border-r border-stone-200 truncate text-ellipsis overflow-clip">
                <Mail className="w-4 h-4 stroke-white fill-stone-500 "/>
                {request.email}
              </div>
              <div className="px-4 h-full flex items-center justify-start gap-2 border-r border-stone-200">
                <Phone className="w-4 h-4 stroke-white fill-stone-500"/>
                {"(+63) " + request.phoneNumber}
              </div>
              <div className="px-4 h-full flex items-center justify-start border-r border-stone-200">
                <span className="px-2 py-1  flex items-center justify-center rounded-md text-xs uppercase ring-1 ring-cyan-500 bg-cyan-50 text-cyan-500">
                  Trainee
                </span>
              </div>
              <div className="px-4 h-full flex items-center justify-start border-r border-stone-200">
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
              <div className="px-4 h-full flex items-center justify-start gap-2 border-r border-stone-200">
                {formatDate(request.createdAt)}
              </div>
              <div className="px-4 h-full flex items-center justify-center gap-2 border-stone-200 ">
                <button className="text-xs uppercase px-4 py-2 rounded-md text-amber-500"
                  onClick={() => handleOpenModal(request)}
                >
                  View
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
          title={"View " + selectedTrainee.firstName + " " + selectedTrainee.lastName + "'s Application"}
        >
          <ViewTraineeRequestForm setOpen={setOpen} request={selectedTrainee} />
        </Modal>
      )}
    </div>
  );
};

export default RequestBranch;