import React, { useState } from 'react'
import styles from '../../styles/signup/signupForm.module.css'
import { FaFacebookSquare } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { BiCheckCircle } from 'react-icons/bi'

interface formDataProps{
    name:string;
    username:string;
    mobileOrEmail:string;
    password:string;
}
const SignupForm :React.FC= () => {
  const [showPassword,setShowPassword]=useState<boolean>(false)
  const [isNotValidated,setIsNotValidated]=useState<string>("")
  const [isValidated,setIsValidated]=useState<string[]>([]) 
  const [formData,setFormData]=useState<formDataProps>({name:"",username:"",password:"",mobileOrEmail:""}) 
  
  const handleFormDataChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    e.preventDefault()
    setIsNotValidated("")
    setFormData({
        ...formData,
        [e.target.name]:e.target.value
    })
  }    
  const isFormFilled: boolean = Boolean(formData.mobileOrEmail) && Boolean(formData.name) && Boolean(formData.username) && Boolean(formData.password);
  
  const handleSignUp=()=>{
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
    if(formData.name.length<4){
        if(isValidated.includes("name")){
            setIsValidated((prevData)=>prevData.filter((item)=>item!=='name'))
        }
        setIsNotValidated("name")
        return;
    }else{
        setIsValidated(prevState => [...prevState, "name"])
    }

    if((formData.username.length<4)){
        if(isValidated.includes("username")){
            setIsValidated((prevData)=>prevData.filter((item)=>item!=='username'))
        }
        setIsNotValidated("username")
        return;
    }else{
        setIsValidated(prevState => [...prevState, "username"])
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
    <div className={styles.signupFormContainer}>
        <p className={styles.signupFormTitle}>
            Instagram
        </p>
        <p className={styles.signupFormSubTitle}>
        Sign up to see photos and videos from your friends.
        </p>
        <div className={styles.signupFormFacebookLoginBtn}>
            <FaFacebookSquare/>
            <p>Log in with Facebook</p>
        </div>
        <div className={styles.signupFormOrDividerContainer}>
        <div className={styles.signupFormOrDivider}> 
        </div>
        <div className={styles.signupFormOrDividerContent}>
        <p>OR</p>
        </div>
        </div>
        <div className={styles.signupFormInputs}>
            <div className={`${styles.signupFormInput} ${formData.mobileOrEmail.length >0&& styles.signupFormInputAlignEnd}`}>
                <input 
                    type={"email" ||"text"} 
                    placeholder='Mobile Number or Email'
                    value={formData.mobileOrEmail}
                    onChange={handleFormDataChange}
                    name='mobileOrEmail'
                />
                {isNotValidated==='mobileOrEmail' && <IoCloseCircleOutline className={styles.signupFormCloseIcon} />}
                {isValidated.includes('mobileOrEmail') && <BiCheckCircle className={styles.signupFormCheckIcon} />}
                {formData.mobileOrEmail.length >0&&<p className={styles.signupInputName}>Mobile Number or Email</p>}
            </div>
            <div className={`${styles.signupFormInput} ${formData.name.length >0 && styles.signupFormInputAlignEnd}`}>
                <input 
                    type="text" 
                    placeholder='Full Name' 
                    value={formData.name}
                    onChange={handleFormDataChange}
                    name='name'
                />
                {isNotValidated==='name' && <IoCloseCircleOutline className={styles.signupFormCloseIcon} />}
                {isValidated.includes('name')&& <BiCheckCircle className={styles.signupFormCheckIcon} />}
                {formData.name.length >0&&<p className={styles.signupInputName}>Full Name</p>}
            </div>
            <div className={`${styles.signupFormInput} ${formData.username.length >0 && styles.signupFormInputAlignEnd}`}>
                <input 
                    type="text" 
                    placeholder='Username' 
                    value={formData.username}
                    onChange={handleFormDataChange}
                    name='username'
                />
                {isNotValidated==='username' && <IoCloseCircleOutline className={styles.signupFormCloseIcon} />}
                {isValidated.includes('username')&& <BiCheckCircle className={styles.signupFormCheckIcon} />}
                {formData.username.length >0&&<p className={styles.signupInputName}>Username</p>}
            </div>
            <div className={`${styles.signupFormInput} ${formData.password.length >0 && styles.signupFormInputAlignEnd}`}>
                <input 
                    type={showPassword ? "text":"password"}
                    placeholder='Password' 
                    value={formData.password}
                    onChange={handleFormDataChange}
                    name='password'
                />
                {isNotValidated==='password' && <IoCloseCircleOutline className={`${styles.signupFormCloseIcon} ${(isValidated.includes('password') || isNotValidated==='password')&& styles.signUpIconWhenShowPassword}`} />}
                {isValidated.includes('password')&& <BiCheckCircle className={`${styles.signupFormCheckIcon} ${(isValidated.includes('password') || isNotValidated==='password')&& styles.signUpIconWhenShowPassword}`} />}
                { formData.password.length>0 && <p className={styles.signUpShowPassword} onClick={()=>setShowPassword(!showPassword)}>{showPassword?"Hide":"Show"}</p>}
                {formData.password.length >0 &&<p className={styles.signupInputName}>Password</p>}
            </div>

        </div>
        <div className={styles.signupFormWarningInfo}>
            <p>People who use our service may have uploaded your contact information to Instagram.
            <Link to={"/"} className={styles.signupLink}>Learn More</Link> </p>
        </div>
        <div className={styles.signupFormAgreement}>
            <p>By signing up, you agree to our <Link to={"/"} className={styles.signupLink}>Terms</Link> , <Link to={"/"} className={styles.signupLink}>Privacy Policy</Link> and <Link to={"/"} className={styles.signupLink}>Cookies policy</Link> .</p>
        </div>
        <button className={`${styles.signupBtn} ${!isFormFilled && styles.disabledSignupBtn}`} onClick={handleSignUp} disabled={!isFormFilled}>Sign Up</button>
    </div>
  )
}

export default SignupForm