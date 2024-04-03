import React, { useState } from 'react'
import styles from '../../styles/signup/otpForm.module.css'
import { login, resetCurrentUser, selectCreateUser, setCreateUser, setCurrentUser, signup, toggleOtpForm, verifyOtp } from '../../app/features/authSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { useNavigate } from 'react-router-dom'

const OtpForm:React.FC= () => {
  const dispatch=useAppDispatch()
  const navigate=useNavigate()
  const createUser=useAppSelector(selectCreateUser)
  const [otp,setOtp]=useState<string>("")
  const handleSubmit=async()=>{
    const result=await dispatch(verifyOtp({receivedOtp:otp,email:createUser?.email}))
    if(result?.payload?.data?._id){
      const response=await dispatch(signup({user:{name:createUser.name,username:createUser?.username,password:createUser?.password,dob:createUser?.dob},_id:result?.payload?.data?._id}))
      dispatch(resetCurrentUser())      
      dispatch(setCurrentUser(response?.payload?.data))
      navigate("/")
      dispatch(toggleOtpForm())
      dispatch(login({usernameOrEmail:response?.payload?.data?.username,password:createUser?.password}))
      dispatch(setCreateUser({}))
    }
  }
  const handleOtpChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const input = e.target.value;
    if (/^\d{0,4}$/.test(input)) {
      setOtp(input);
    }

  }
  return (
    <div className={styles.otpFormContainer}>
        <p className={styles.otpFormTitle}>
            Instagram
        </p>
        <div className={styles.otpFormContent}>
            <p>Just one more step , Enter the otp we sent to email</p>
            <input type="text" name="otp" value={otp} onChange={handleOtpChange} placeholder='Enter otp'/>
            <button onClick={handleSubmit}>Confirm</button>
        </div>
    </div>
  )
}

export default OtpForm