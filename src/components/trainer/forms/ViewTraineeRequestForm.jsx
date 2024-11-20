import { MapIcon, SquareUser, UserIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ScaleLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import Button from '../../ui/Button';
import axios from 'axios';

const ViewTraineeRequestForm = ({ setOpen, request }) => {
  const queryClient = useQueryClient();
  const [isLoading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDecline = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    setLoading(true);
    try {
      const res = await axios.post('https://server-np0x.onrender.com/account/decline-trainee-request', {
        _id: request._id,
        email: request.email,
        firstName: request.firstName,
      });
      queryClient.invalidateQueries({ queryKey: ['trainerTraineeRequestTableData'] });
      toast.success(res.data.message);
      setOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <form className="p-6 flex flex-col items-start gap-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
          <SquareUser className="w-5 h-5 stroke-2 stroke-gray-500" />
        </div>
        <h1 className="text-lg font-medium text-gray-700">Personal Information</h1>
      </div>
      {request.avatar === "" && (
        <div className="w-full flex items-start justify-start">
          <img
            src={request.avatar}
            alt="Uploaded"
            className="w-full h-full object-cover rounded-md overflow-clip"
          />
        </div>
      )}
      <div className="flex items-center justify-center gap-4 mt-4 w-full">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm uppercase text-neutral-700 font-medium w-full">First Name</label>
          <label className="text-sm h-7 w-full text-gray-700">{request.firstName}</label>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm uppercase text-neutral-700 font-medium w-full">Middle Initial</label>
          <label className="text-sm h-7 w-full text-gray-700">{request.middleInitial}</label>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 w-full">
        <div className="flex flex-col items-start gap-2 w-full">
          <label className="text-sm uppercase text-neutral-700 font-medium">Last Name</label>
          <label className="text-sm h-7 w-full text-gray-700">{request.lastName}</label>
        </div>
        <div className="flex flex-col items-start gap-2 w-full">
          <label className="text-sm uppercase text-neutral-700 font-medium">Date of Birth</label>
          <label className="text-sm h-7 w-full text-gray-700">{formatDate(request.dateOfBirth)}</label>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 w-full">
        <div className="flex flex-col items-start gap-2 w-full">
          <label className="text-sm uppercase text-neutral-700 font-medium">Gender</label>
          <label className="text-sm h-7 w-full text-gray-700">{request.gender}</label>
        </div>
        <div className="flex flex-col items-start gap-2 w-full">
          <label className="text-sm uppercase text-neutral-700 font-medium">Civil Status</label>
          <label className="text-sm h-7 w-full text-gray-700">{request.civilStatus}</label>
        </div>
      </div>
      <hr className="border-t border-gray-200 w-full mt-4" />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
          <MapIcon className="w-5 h-5 stroke-2 stroke-gray-500" />
        </div>
        <h1 className="text-lg font-medium text-gray-700">Address Information</h1>
      </div>
      <div className="flex items-center justify-center gap-4 w-full">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm uppercase text-neutral-700 font-medium">Street</label>
          <label className="text-sm h-7 w-full text-gray-700">{request.street}</label>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm uppercase text-neutral-700 font-medium">Municipality</label>
          <label className="text-sm h-7 w-full text-gray-700">{request.municipality}</label>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 w-full">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm uppercase text-neutral-700 font-medium">City</label>
          <label className="text-sm h-7 w-full text-gray-700">{request.city}</label>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm uppercase text-neutral-700 font-medium">Province</label>
          <label className="text-sm h-7 w-full text-gray-700">{request.province}</label>
        </div>
      </div>
      <div className="flex items-center justify-center w-1/2">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm uppercase text-neutral-700 font-medium">Zip Code</label>
          <label className="text-sm h-7 w-full text-gray-700">{request.zipCode}</label>
        </div>
      </div>
      <hr className="border-t border-gray-200 w-full mt-4" />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
          <UserIcon className="w-5 h-5 stroke-2 stroke-gray-500" />
        </div>
        <h1 className="text-lg font-medium text-gray-700">Trainee Details</h1>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <label className="text-sm uppercase text-neutral-700 font-medium">Phone Number</label>
        <label className="text-sm h-7 w-full text-gray-700">{request.phoneNumber}</label>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <label className="text-sm uppercase text-neutral-700 font-medium">Email</label>
        <label className="text-sm h-7 w-full text-gray-700">{request.email}</label>
      </div>
      <div className="w-full flex items-center justify-end gap-4 mt-6">
        <button type="button" className="w-24 mr-2" onClick={handleClose}>
          Close
        </button>
        <Button
          className="bg-rose-500 w-32 flex items-center justify-center gap-2"
          isDisabled={isLoading}
          onClick={handleDecline}
        >
          {isLoading && (
            <ScaleLoader
              cssOverride={{
                height: '35px',
                width: '40px',
                transform: 'scale(0.5)',
              }}
              color="white"
            />
          )}
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ViewTraineeRequestForm;