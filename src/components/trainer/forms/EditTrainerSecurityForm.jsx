import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ScaleLoader  } from 'react-spinners'
import { toast } from 'react-toastify';
import PasswordInput from '../../ui/PasswordInput.jsx'
import ChangePasswordSchema from '../../../schemas/ChangePasswordSchema.js'
import Button from '../../ui/Button.jsx'
import useAccountStore from '../../../stores/trainer/AccountStore.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditTrainerSecurityForm = ({ setOpen }) => {


  const user = useAccountStore(state => state.user);
  const navigate = useNavigate()

  const [ isLoading , setLoading ] = useState(false)

  const { control, handleSubmit, formState: { errors }, reset, setError} = useForm({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      _id: user.credentialId,
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });



  const onSubmit = async (data) => {

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
          formData.append('admin_avatar', value);
        } else {
          formData.append(key, value);
        }
      });
      newData = formData; 
    }


    try {
      const res = await axios.put('https://server-np0x.onrender.com/account/update-admin-security', newData)
      toast.success(res.data.message)
      setOpen(false)
      setLoading(false)
      localStorage.removeItem('token')
      navigate('/login')
    } catch (error) {
      console.log(error)
      if (error.status === 409) {
        setError("email", {
          type: "manual",
          message: error.response.data.message
        })
      }
      if (error.status === 404){
        setError("oldPassword", {
          type: "manual",
          message: error.response.data.message
        })
      }
      console.log(error)
    } finally{
      setLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    setOpen(false)
  }



  return (
    <form className="p-6 flex flex-col items-start gap-4  h-full" onSubmit={handleSubmit(onSubmit)}>
      <div className=" flex flex-col gap-2 w-full h-full flex-1">        

        <label className="text-sm uppercase text-neutral-700 font-medium mt-2">Old Password</label>
        <Controller
          name="oldPassword"
          control={control}
          render={({ field: { value, onChange } }) => (
            <PasswordInput
              className="w-full"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              didError={!!errors.oldPassword}         
            />
          )}
        />    
        {errors.oldPassword && <span className="text-xs text-red-500">{errors.oldPassword.message}</span>}
        <label className="text-sm uppercase text-neutral-700 font-medium mt-2">New Password</label>
        <Controller
          name="newPassword"
          control={control}
          render={({ field: { value, onChange } }) => (
            <PasswordInput
              className="w-full"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              didError={!!errors.newPassword}         
            />
          )}
        />    
        <label className="text-sm uppercase text-neutral-700 font-medium mt-2">Confirm Password</label>
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field: { value, onChange } }) => (
            <PasswordInput
              className="w-full"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              didError={!!errors.confirmPassword}         
            />
          )}
        />    
        <label className="text-sm text-gray-500 ">NOTE: You will be logged out after changing your password. Please login again using your new password. </label>
      </div>
      <div className="w-full flex items-center justify-end gap-4 mt-6">
        <button type="button" className="w-24" onClick={handleClose}>Cancel</button>
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
          Save
        </Button>
      </div>
    </form>
  )
}

export default EditTrainerSecurityForm