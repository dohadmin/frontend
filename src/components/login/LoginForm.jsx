import PasswordInput from "../ui/PasswordInput"
import Input from "../ui/Input"
import Button from "../ui/Button"
import LoginSchema from "../../schemas/LoginSchema";
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { getDeviceType } from "../../utils/GetDevice.js";
import Logo from '../../../public/logo.svg.png';
const LoginForm = ({ setActivePage, setEmail }) => {

  const { control, handleSubmit, formState: { errors }, reset, setError , clearErrors} = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data) => {
    const deviceType = getDeviceType();

    console.log(deviceType)
    try {
      const res = await axios.post('https://server-np0x.onrender.com/auth/login', data,{
        headers: {
          devicetype: deviceType
        }
      })
      setActivePage("verify")
      setEmail(data.email)
    } catch (error) {
      setError("email", {
        type: "manual",
        message: "Invalid login credentials"
      })
      setError("password", {
        type: "manual",
        message: "Invalid login credentials"
      })
    }
  }


  return (
    <section className="w-full h-full flex items-center">
      <div className="w-full flex items-center justify-center ring-1 ring-gray-200 h-full relative ">
        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Department_of_Health_%28DOH%29_%28Rizal_Avenue%2C_Santa_Cruz%2C_Manila%3B_2014-11-12%29.jpg/1200px-Department_of_Health_%28DOH%29_%28Rizal_Avenue%2C_Santa_Cruz%2C_Manila%3B_2014-11-12%29.jpg" 
        alt="background" 
        className="w-full h-full object-cover" 
      />
        <div className="absolute top-0 left-0 w-full h-full bg-slate-950 bg-opacity-80 bg-blend-screen"></div>
       
       <div className="absolute left-0 w-full h-full flex flex-col justify-center items-center">
        <div className="flex items-center justify-center w-full h-1 relative">
          <img src={Logo} alt="logo" className="w-24 h-24 rounded-full absolute -top-[8rem]" />      
        </div>
        <h1 className="text-white text-5xl font-semibold text-center uppercase ">
          Welcome to <br />
          <span className="text-amber-500 text-7xl ">
            CerTrack  <br />
          </span>
          
        </h1>

       </div>

      </div>
    
      <div className="w-1/2 h-full flex items-center justify-center bg-white">
        <form 
          className="bg-white w-[28rem] h-fit rounded-3xl relative shadow-sm shadow-stone-100/40  flex flex-col items-start justify-center gap-4 p-6"
          onSubmit={handleSubmit(onSubmit)}
        >
        <h1 className="font-semibold w-full text-center tracking-tight text-2xl mb-4">Sign In to your account</h1>
          <div className="flex flex-col items-start justify-center w-full gap-2">  
            <p className="text-sm text-stone-900 font-semibold">Email</p>

            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field : {value, onChange} }) => (
                <Input
                  didError={errors.email}
                  className="w-full"
                  value={value}
                  onChange={(e) =>  {
                    onChange(e.target.value)
                    clearErrors('email')
                  }}
                  placeholder="Type your email here"
                />
              )}
            />
            {errors.email && <p className="text-rose-500 text-sm">{errors.email.message}</p>}

          </div>
          <div className="flex flex-col items-start justify-center w-full gap-2">  
            <p className="text-sm text-stone-900 font-semibold">Password</p>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field : {value, onChange} }) => (
                <PasswordInput
                  didError={errors.password}
                  className="w-full"
                  value={value}
                  onChange={(e) =>  {
                    onChange(e.target.value)
                    clearErrors('password')
                  }}            
                />
              )}
            />

            {errors.password && <p className="text-rose-500 text-sm">{errors.password.message}</p>}
          </div>
          <Button className="w-full mt-4">
            Login
          </Button>
        </form>
      </div>

  </section>
  )
}

export default LoginForm
