import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useState, useEffect } from 'react';
import VerificationSchema from '../../schemas/VerificationSchema';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Logo from '../../../public/logo.svg.png';

const VerificationForm = ({ email }) => {
  const { control, handleSubmit, formState: { errors }, reset, setError, clearErrors } = useForm({
    resolver: zodResolver(VerificationSchema),
    defaultValues: {
      email: email
    }
  });

  const navigate = useNavigate();
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  const onSubmit = async (data) => {
    try {
      const res = await axios.put('https://server-np0x.onrender.com/auth/verify-otp', data);
      localStorage.setItem('token', res.data.token);
      console.log(res)
      if (res.data.role === "admin") {
        navigate('/admin/accounts');
      }
      if (res.data.role === "trainer") {
        navigate('/trainer/trainees');
      }
      if (res.data.role === "trainee") {
        navigate('/trainee/profile');
      }

      if (res.data.role === "super") {
        navigate('/super/admins');
      }


    } catch (error) {
      setError("otp", {
        type: "manual",
        message: "Incorrect otp"
      });
    }
  };

  const handleResend = async () => {
    try {
      await axios.post('https://server-np0x.onrender.com/auth/resend-otp', { email });
      setTimer(60);
      setIsResendDisabled(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="w-full h-full flex items-center">
      <div className="w-full flex items-center justify-center ring-1 ring-gray-200 h-full relative ">
        <img src="https://news-image-api.abs-cbn.com/Prod/editorImage/172838869571420160614-doh-building-JC-1.jpg" 
        alt="background" 
        className="w-full h-full object-cover" 
      />
        <div className="absolute top-0 left-0 w-full h-full bg-slate-950 bg-opacity-80 bg-blend-screen"></div>
       
       <div className="absolute left-0 w-full h-full flex flex-col justify-center items-center">
        <div className="flex items-center justify-center w-full h-1 relative">
          <img src={Logo} alt="logo" className="w-24 h-24 rounded-full absolute -top-[8rem]" />      
        </div>
        <h1 className="text-white text-6xl font-semibold text-center uppercase ">
          <span className="text-amber-500 text-7xl ">
            Department of Health  <br />
          </span>
          Training Portal
        </h1>

       </div>

      </div>
    
      <div className="w-1/2 h-full flex items-center justify-center bg-white">
        <form 
          className="bg-white w-[28rem] h-fit rounded-3xl relative shadow-sm shadow-stone-100/40  flex flex-col items-start justify-center gap-4 p-6"
          onSubmit={handleSubmit(onSubmit)}
        >

          <div className="flex flex-col gap-1 w-full">
            <h1 className=" w-full text-center font-semibold tracking-tight text-2xl">Confirm your Account</h1>
          </div>
          <div className="flex flex-col items-start justify-center w-full gap-2">  
            <p className="text-sm text-stone-900 font-semibold">OTP</p>

            <Controller
              name="otp"
              control={control}
              defaultValue=""
              render={({ field: { value, onChange } }) => (
                <Input
                  didError={errors.otp}
                  className="w-full"
                  value={value}
                  onChange={(e) => {
                    onChange(e.target.value);
                    clearErrors('otp');
                  }}
                  placeholder="123456"
                  maxLength={6}
                />
              )}
            />
            {errors.otp && <p className="text-rose-500 text-sm">{errors.otp.message}</p>}
          </div>
          <Button className="w-full mt-2">
            Verify
          </Button>
          <p className='text-sm'>
            Didn't receive the code? 
            <button 
              onClick={handleResend}
              className={`text-amber-500 cursor-pointer font-medium ml-1 ${isResendDisabled ? 'cursor-not-allowed text-gray-400' : ''}`}
              disabled={isResendDisabled}
            >
              Resend {isResendDisabled && `(${timer}s)`}
            </button>
          </p>
        </form>
      </div>
    </section>
  );
};

export default VerificationForm;