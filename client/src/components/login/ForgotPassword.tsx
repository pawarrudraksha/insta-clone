import React from 'react'
import { FiLock } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const ForgotPassword:React.FC= () => {
  return (
    <div className="forgotPasswordContainer">
        <div className="forgotPasswordContent">
            <div className="forgotPasswordIconContainer">
                <FiLock/>
                <p>Trouble logging in?</p>
            </div>
            <p>Enter your email, phone, or username and we'll send you a link to get back into your account.</p>
            <input type="text" placeholder='Email, Phone, or Username' />
            <button>Send login link</button>
            <p>Can't reset your password</p>
        </div>
        <div className="forgotPasswordOrDivider">
            <p>OR</p>
        </div>
        <Link to="/accounts/emailsignup">Create new account</Link>
        <Link className="forgotPasswordBack" to="/">
            Back to Login
        </Link>
    </div>
  )
}

export default ForgotPassword