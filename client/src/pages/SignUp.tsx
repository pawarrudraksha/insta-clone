import React from 'react'
import styles from '../styles/signup/signup.module.css'
import SignupForm from '../components/signup/SignupForm'
import OptionsFooter from '../components/signup/OptionsFooter'
import Footer from '../components/miscellaneous/Footer'

const SignUp :React.FC= () => {
  return (
    <div className={styles.signupContainer}>
        <div className={styles.signupMainContent}>
          <SignupForm/>
        </div>
        <div className={styles.signupGetAppAndSuggestionContainer}>
          <OptionsFooter/>
        </div>
        <div className={styles.footer}>
          {/* <Footer/> */}
        </div>
    </div>
  )
}

export default SignUp