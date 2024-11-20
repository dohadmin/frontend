import { useState } from 'react'
import LoginForm from '../components/login/LoginForm'
import VerificationForm from '../components/login/VerificationForm'

const LoginPage = () => {
  const [ activePage, setActivePage ] = useState("login")
  const [ email, setEmail ] = useState("")


  return (
    <div className="w-screen h-screen flex items-center justify-center bg-stone-100 font-inter">
      { activePage === "login" && <LoginForm setActivePage={setActivePage} setEmail={setEmail}/>}
      { activePage === "verify" && <VerificationForm email={email}/>}
    </div>
  )
}

export default LoginPage