import React from 'react'
import { FaFacebookSquare } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const UserInfo :React.FC= () => {
  return (
    <div className="userInfoContainer">
        <p className="userInfoTitle">
            Instagram
        </p>
        <p className="userInfoSubTitle">
        Sign up to see photos and videos from your friends.
        </p>
        <div className="userInfoFacebookLoginBtn">
            <p>Log in with Facebook</p>
            <FaFacebookSquare/>
        </div>
        <div className="userInfoOrDivider">
            <p>OR</p>
        </div>
        <div className="userInfoInputs">
            <input type="text" placeholder='Mobile number or email' />
            <input type="text" placeholder='Full Name' />
            <input type="text" placeholder='Username' />
            <input type="text" placeholder='Password' />
        </div>
        <div className="userInfoWarningInfo">
            <p>People who use our service may have uploaded your contact information to Instagram. </p>
            <Link to={"/"}>Learn More</Link>
        </div>
        <div className="userInfoAgreement">
            <p>By signing up, you agree to our <Link to={"/"}>Terms</Link> , <Link to={"/"}>Privacy Policy</Link> and <Link to={"/"}>Cookies policy</Link> .</p>
        </div>
        <button>Sign Up</button>
    </div>
  )
}

export default UserInfo