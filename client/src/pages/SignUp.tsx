import React, { useEffect } from 'react';
import styles from '../styles/signup/signup.module.css';
import SignupForm from '../components/signup/SignupForm';
import OptionsFooter from '../components/signup/OptionsFooter';
import Footer from '../components/miscellaneous/Footer';
import BirthdayForm from '../components/signup/BirthdayForm';
import OtpForm from '../components/signup/OtpForm';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectCurrentUser, selectIsSignupFormOpen, selectIsBirthdayFormOpen, selectIsOtpFormOpen, toggleBirthdayForm, toggleOtpForm, toggleSignupForm } from '../app/features/authSlice';

const SignUp: React.FC = () => {
  const dispatch=useAppDispatch()
  const isSignupFormOpen = useAppSelector(selectIsSignupFormOpen);
  const isBirthdayFormOpen = useAppSelector(selectIsBirthdayFormOpen);
  const isOtpFormOpen = useAppSelector(selectIsOtpFormOpen);
  useEffect(()=>{
    if(isBirthdayFormOpen){
      dispatch(toggleBirthdayForm())
      dispatch(toggleSignupForm())     
    }
    if(isOtpFormOpen){
      dispatch(toggleOtpForm()) 
      dispatch(toggleSignupForm())     
    }
    if(!isSignupFormOpen && !isBirthdayFormOpen && !isOtpFormOpen){
      dispatch(toggleSignupForm())
    }
  },[])
  
  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupMainContent}>
        {isSignupFormOpen && <SignupForm />}
        {isBirthdayFormOpen && <BirthdayForm />}
        {isOtpFormOpen && <OtpForm />}
      </div>
      <div className={styles.signupGetAppAndSuggestionContainer}>
        <OptionsFooter />
      </div>
      <div className={styles.footer}>
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default SignUp;
