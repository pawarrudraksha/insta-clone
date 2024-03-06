import React from 'react'
import OptionsFooter from '../signup/OptionsFooter'
import Footer from '../miscellaneous/Footer'
import { FaFacebookSquare } from 'react-icons/fa'

const Login:React.FC= () => {
  return (
    <div className="loginWrapper">
        <div className="loginCard">
            <p>Instagram</p>
            <input type="text" placeholder='Phone number,username, or email'/>
            <button>Login</button>
            <div className="userInfoOrDivider">
                <p>OR</p>
            </div>
            <div className="loginWithFacebookContainer">
                <FaFacebookSquare/>
                <p>Login with facebook</p>
            </div>
            <button>Forgot passoword</button>
        </div>
        <OptionsFooter/>
        <Footer/>
    </div>
  )
}

export default Login