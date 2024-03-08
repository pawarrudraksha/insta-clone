import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from '../../styles/signup/optionsFooter.module.css'

const OptionsFooter:React.FC= () => {
  const location=useLocation()
  return (
    <div className={styles.optionsFooter}>
        {location.pathname.includes("signup")? <div className={styles.optionsFooterQuestion}>
            <p>Have an account? </p>
            <Link to={"/accounts/login"}>Log in</Link>
        </div>
        :
        <div className={styles.optionsFooterQuestion}>
            <p>Don't have an account? </p>
            <Link to={"/accounts/emailsignup"}>Sign up</Link>
        </div>
        }
        <div className={styles.optionsFooterGetApp}>
            <p>Get the app</p>
            <div className={styles.optionsFooterApps}>
                <img src="/assets/googlePlay.png" alt="google play" />
                <img src="/assets/microsoft.png" alt="microsoft" />
            </div>
        </div>
    </div>
  )
}

export default OptionsFooter