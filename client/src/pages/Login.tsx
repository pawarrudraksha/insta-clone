import React from 'react'
import styles from '../styles/login/login.module.css'
import LoginForm from '../components/login/LoginForm'
import OptionsFooter from '../components/signup/OptionsFooter'

const Login :React.FC= () => {
  return (
    <div className={styles.loginContainer}>
        <div className={styles.loginMainContent}>
          <LoginForm/>
        </div>
        <div className={styles.loginGetAppAndSuggestionContainer}>
          <OptionsFooter/>
        </div>
        <div className={styles.footer}>
          {/* <Footer/> */}
        </div>
    </div>
  )
}

export default Login