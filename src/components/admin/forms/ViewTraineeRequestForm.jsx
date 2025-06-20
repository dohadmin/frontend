import { MapIcon, SquareUser, UserIcon } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, get, useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ScaleLoader  } from 'react-spinners'
import { toast } from 'react-toastify';
import Input from '../../ui/Input'
import ComboBox from '../../ui/ComboBox'
import RadioButton from '../../ui/RadioButton'
import ViewTraineeRequestSchema from '../../../schemas/ViewTraineeRequestSchema'
import Button from '../../ui/Button'
import ImageInput from '../../ui/ImageInput'
import axios from 'axios'

const ViewTraineeRequestForm = ({setOpen, request}) => {

  const queryClient = useQueryClient()
  const [ isLoading , setLoading ] = useState(false)


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  const { control, handleSubmit, formState: { errors }, reset, setError, getValues} = useForm({
    resolver: zodResolver(ViewTraineeRequestSchema),
    defaultValues:{
      _id: request._id,
      avatar: request.avatar,
      firstName: request.firstName,
      middleInitial: request.middleInitial,
      lastName: request.lastName,
      dateOfBirth: request.dateOfBirth,
      civilStatus: request.civilStatus,
      gender: request.gender,
      street: request.street,
      municipality: request.municipality,
      city: request.city,
      province: request.province,
      zipCode: request.zipCode,
      phoneNumber: request.phoneNumber,
      email: request.email, 
      trainerId: request.trainerId._id,
    }
  });


  const onSubmit = async (data) => {
    console.log(data)
    setLoading(true)
    let newData;

    if (typeof data.avatar === "string") {
      newData = data;
    } else if (data.avatar === null || data.avatar === undefined) {
      newData = { ...data, avatar: null };    } 
    else {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'avatar' && value instanceof File) {
          formData.append('trainee_avatar', value);
        } else {
          formData.append(key, value);
        }
      });
      newData = formData; 
    }

    try {
      const res = await axios.post('https://server-np0x.onrender.com/account/approve-trainee-request', newData)
      queryClient.invalidateQueries({queryKey: ['adminTrainersTableData']})
      queryClient.invalidateQueries({queryKey: ['adminTraineeRequestTableData']})
      toast.success(res.data.message)
      setOpen(false)
      setLoading(false)
      console.log(data)
    } catch (error) {
      console.log(error)
      if (error.status === 409) {
        setError("email", {
          type: "manual",
          message: error.message
        })
        setLoading(false)
      }
    } 
  }

  const handleDecline = async () => {
    try {
      const res = await axios.post('https://server-np0x.onrender.com/account/decline-trainee-request', { 
        _id: request._id,
        email: request.email,
        firstName: request.firstName,
      })
      queryClient.invalidateQueries({queryKey: ['adminTrainersTableData']})
      queryClient.invalidateQueries({queryKey: ['adminTraineeRequestTableData']})
      queryClient.invalidateQueries({queryKey: ['adminRequestCountData']})
      queryClient.invalidateQueries({queryKey: ['traineeTrainingsTableData']})
      queryClient.invalidateQueries({queryKey: ['trainerTrainingsTableData']})
      
      toast.success(res.data.message)
      setOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleClose = () => {
    reset()
    setOpen(false)
  }




  return (
    <form className="p-6 flex flex-col items-start gap-4 " onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
          <SquareUser className="w-5 h-5 stroke-2 stroke-gray-500" /> 
        </div>
        <h1 className="text-lg font-medium text-gray-700">Personal Information</h1>
      </div>

      <div className=" flex items-center justify-center gap-4 mt-4 w-full">        
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm uppercase text-neutral-700 font-medium">First Name</label>
          <Controller
            name="firstName"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                value={value}
                placeholder='Juan'
                onChange={(e) => onChange(e.target.value)}
                didError={!!errors.firstName}
                isDisabled={true}
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-2 ">
          <label className="text-sm uppercase text-neutral-700 font-medium">M.I.</label>
          <Controller
            className="w-12"
            name="middleInitial"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                value={value}
                placeholder='D.'
                onChange={(e) => onChange(e.target.value)}
                didError={!!errors.middleInitial}
                isDisabled={true}

              />
            )}
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm uppercase text-neutral-700 font-medium">Last Name</label>
          <Controller
            className="w-12"
            name="lastName"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                value={value}
                placeholder='Dela Cruz'
                onChange={(e) => onChange(e.target.value)}
                didError={!!errors.lastName}
                isDisabled={true}

              />
            )}
          />
        </div>
      </div>
      <div className=" flex items-center justify-center gap-4 w-full">        
        <div className="flex flex-col items-start gap-2 w-full">
          <label className="text-sm uppercase text-neutral-700 font-medium">Date of Birth</label>
          <Controller
            className="w-12"
            name="dateOfBirth"
            control={control}
            render={({ field: { value, onChange } }) => (
              <input 
                type="date" 
                className={`w-full ring-1  rounded-md h-10 px-4 
                  ${errors.dateOfBirth ? " ring-rose-500 text-rose-500 " : " ring-gray-200 placeholder:text-sm text-smplaceholder:text-gray-500 text-gray-700 focus:outline-none focus:ring-2 "}  
                `}
                onChange={(e) => onChange(e.target.value)}
                value={formatDate(value)}
                disabled={true}

              />
            )}
          />
        </div>
        <div className="flex flex-col items-start gap-2 w-full">
          <label className="text-sm uppercase text-neutral-700 font-medium">Civil Status</label>
          <Controller
            name="civilStatus"
            control={control}
            render={({ field: { value, onChange } }) => (
              <ComboBox
                value={value}
                options={["Single", "Married", "Widowed", "Separated", "Divorced"]}
                className="w-full"
                placeholder="Select a civil status"
                didError={!!errors.civilStatus}
                onChange={(newValue) => {
                  onChange(newValue)
                }}
                isDisabled={true}

              />
            )}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <label className="text-sm uppercase text-neutral-700 font-medium">Gender</label>
        <div className="w-full flex items-center justify-center gap-4">
        <Controller
          name="gender"
          control={control}
          render={({ field: { value, onChange } }) => (
            <>
              <RadioButton 
                value="Male"
                className="w-full"
                checked={value === "Male"}
                didError={!!errors.gender}         
                setChecked={value => {
                  onChange(value);
                }}
                isDisabled={true}

              />
              <RadioButton 
                className="w-full"
                value="Female"
                checked={value === "Female"}
                didError={!!errors.gender}         
                setChecked={value => {
                  onChange(value);
                }}
                isDisabled={true}

              />
            </>
          )}
        />
        </div>
      </div>
      <hr className='border-t border-gray-200 w-full mt-4' />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
          <MapIcon className="w-5 h-5 stroke-2 stroke-gray-500" /> 
        </div>
        <h1 className="text-lg font-medium text-gray-700">Address Information</h1>
      </div>      
      <div className=" flex items-center justify-center gap-4 w-full">        
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm uppercase text-neutral-700 font-medium">Street</label>
          <Controller
            name="street"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                value={value}
                placeholder='Consunji'
                onChange={(e) => onChange(e.target.value)}
                didError={!!errors.street}       
                isDisabled={true}
  
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm uppercase text-neutral-700 font-medium">Municipality</label>
          <Controller
            name="municipality"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                value={value}
                placeholder='Sta Lucia'
                onChange={(e) => onChange(e.target.value)}
                didError={!!errors.municipality}       
                isDisabled={true}
  
              />
            )}
          />        
        </div>
      </div>
      <div className=" flex items-center justify-center gap-4 w-full">        
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm uppercase text-neutral-700 font-medium">City</label>
          <Controller
            name="city"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                className="w-full"
                value={value}
                placeholder='San Fernando'
                onChange={(e) => onChange(e.target.value)}
                didError={!!errors.city}        
                isDisabled={true}
 
              />
            )}
          />        
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm uppercase text-neutral-700 font-medium">Province</label>
          <Controller
            name="province"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                className="w-full"
                value={value}
                placeholder='Pampanga'
                onChange={(e) => onChange(e.target.value)}
                didError={!!errors.province}    
                isDisabled={true}
     
              />
            )}
          />        
        </div>
      </div>
      <div className=" flex items-center justify-center  w-1/2">        
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm uppercase text-neutral-700 font-medium">Zip Code</label>
          <Controller
            name="zipCode"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                className="w-full"
                value={value}
                placeholder='2020'
                onChange={(e) => onChange(e.target.value)}
                didError={!!errors.zipCode}    
                isDisabled={true}     
              />
            )}
          />    
        </div>
      </div>
      <hr className='border-t border-gray-200 w-full mt-4' />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
          <UserIcon className="w-5 h-5 stroke-2 stroke-gray-500" /> 
        </div>
        <h1 className="text-lg font-medium text-gray-700">Trainee Details</h1>
      </div>

      <div className=" flex flex-col gap-2 w-full">        
        <label className="text-sm uppercase text-neutral-700 font-medium">Phone Number</label>
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Input
              className="w-full"
              value={value}
              placeholder='+63 098 7654 3210'
              onChange={(e) => onChange(e.target.value)}
              didError={!!errors.phoneNumber}         
              isDisabled={true}

            />
          )}
        />    
      </div>
      <div className=" flex flex-col gap-2 w-full">        
        <label className="text-sm uppercase text-neutral-700 font-medium">Email</label>
        <Controller
          name="email"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Input
              className="w-full"
              value={value}
              placeholder='juandelacruz@gmail.com'
              onChange={(e) => onChange(e.target.value)}
              didError={!!errors.email}         
              isDisabled={true}

            />
          )}
        />
        <label className="text-sm text-gray-500 ">The user account will be automatically sent to the 
          <span className="text-amber-500 mx-1 font-medium">Trainee's</span>
          email.
        </label>
      </div>
      <div className="w-full flex items-center justify-end gap-4 mt-6">
        <button type="button" className="w-24 mr-2" onClick={handleClose}>Cancel</button>
        <button type="button" className="w-24 ring-1 rounded-md ring-rose-500 text-rose-500 px-2 h-9" onClick={handleDecline}>Decline</button>
        <Button 
          className="w-32 flex items-center justify-center gap-2"
          isDisabled={isLoading}
        >
          {isLoading &&(
            <ScaleLoader 
              cssOverride={{
                height: "35px",
                width: "40px",
                transform: 'scale(0.5)', 
              }}
              color="white"
            />          
          )}
          Approve
        </Button>
      </div>
    </form>
  )
}

export default ViewTraineeRequestForm
