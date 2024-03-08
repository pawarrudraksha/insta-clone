import React, { useState } from 'react'
import styles from '../../styles/login/loginForm.module.css'
import { FaFacebookSquare } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { BiCheckCircle } from 'react-icons/bi'

interface formDataProps{
    mobileOrEmail:string;
    password:string;
}
const LoginForm :React.FC= () => {
  const [showPassword,setShowPassword]=useState<boolean>(false)
  const [isNotValidated,setIsNotValidated]=useState<string>("")
  const [isValidated,setIsValidated]=useState<string[]>([]) 
  const [formData,setFormData]=useState<formDataProps>({password:"",mobileOrEmail:""}) 
  
  const handleFormDataChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    e.preventDefault()
    setIsNotValidated("")
    setFormData({
        ...formData,
        [e.target.name]:e.target.value
    })
  }    
  const isFormFilled: boolean = Boolean(formData.mobileOrEmail)  && Boolean(formData.password);
  
  const handleLogin=()=>{
    setIsNotValidated("")
    if (!formData.mobileOrEmail.includes("@")  && !((/^\d/.test(formData.mobileOrEmail)) && formData.mobileOrEmail.length===10)) {
        if(isValidated.includes("mobileOrEmail")){
            setIsValidated((prevData)=>prevData.filter((item)=>item!=='mobileOrEmail'))
        }
        setIsNotValidated("mobileOrEmail")
        return;
    }else{
        setIsValidated(prevState => [...prevState, "mobileOrEmail"])
    }

    if(formData.password.length!==8){
        if(isValidated.includes("password")){
            setIsValidated((prevData)=>prevData.filter((item)=>item!=='password'))
        }
        setIsNotValidated("password")
        return;
    }else{
        setIsValidated(prevState => [...prevState, "password"])
    }

   
    }
  return (
    <div className={styles.loginFormContainer}>
        <p className={styles.loginFormTitle}>
            Instagram
        </p>
        
       
        <div className={styles.loginFormInputs}>
            <div className={`${styles.loginFormInput} ${formData.mobileOrEmail.length >0&& styles.loginFormInputAlignEnd}`}>
                <input 
                    type={"email" ||"text"} 
                    placeholder='Phone number,username or email'
                    value={formData.mobileOrEmail}
                    onChange={handleFormDataChange}
                    name='mobileOrEmail'
                />
                {isNotValidated==='mobileOrEmail' && <IoCloseCircleOutline className={styles.loginFormCloseIcon} />}
                {isValidated.includes('mobileOrEmail') && <BiCheckCircle className={styles.loginFormCheckIcon} />}
                {formData.mobileOrEmail.length >0&&<p className={styles.loginInputName}>Mobile Number or Email</p>}
            </div>
           
            <div className={`${styles.loginFormInput} ${formData.password.length >0 && styles.loginFormInputAlignEnd}`}>
                <input 
                    type={showPassword ? "text":"password"}
                    placeholder='Password' 
                    value={formData.password}
                    onChange={handleFormDataChange}
                    name='password'
                />
                {isNotValidated==='password' && <IoCloseCircleOutline className={`${styles.loginFormCloseIcon} ${(isValidated.includes('password') || isNotValidated==='password')&& styles.loginIconWhenShowPassword}`} />}
                {isValidated.includes('password')&& <BiCheckCircle className={`${styles.loginFormCheckIcon} ${(isValidated.includes('password') || isNotValidated==='password')&& styles.loginIconWhenShowPassword}`} />}
                { formData.password.length>0 && <p className={styles.loginShowPassword} onClick={()=>setShowPassword(!showPassword)}>{showPassword?"Hide":"Show"}</p>}
                {formData.password.length >0 &&<p className={styles.loginInputName}>Password</p>}
            </div>
            <button className={`${styles.loginBtn} ${!isFormFilled && styles.disabledLoginBtn}`} onClick={handleLogin} disabled={isFormFilled}>Log in</button>
            <div className={styles.loginFormOrDividerContainer}>
                <div className={styles.loginFormOrDivider}></div>
                <div className={styles.loginFormOrDividerContent}>
                    <p>OR</p>
                </div>
            </div>
            <div className={styles.loginFormFacebookLoginBtn}>
                <FaFacebookSquare/>
                <p>Log in with Facebook</p>
            </div>
            
        </div>
    </div>
  )
}

export default LoginForm