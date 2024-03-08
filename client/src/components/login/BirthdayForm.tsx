import React from 'react'
import { Link } from 'react-router-dom'

const BirthdayForm:React.FC = () => {
  return (
    <div className="birthdayFormContainer">
        <img src="" alt="" />
        <p>Add your birthday</p>
        <div className="whyBirthdayContainer">
            <p>This won't be a part of your public profile.</p>
            <Link className="whyBirthdayLink" to="">Why do I need to provide my birthday</Link>
            <div className="inputContainer">
            <input type="month" />
            <input type="number"  />
            <input type="number"  />
            <p>You need to enter the date you were born</p>
            </div>
        </div>
        <p>Use your own birthday, even if this account is for a business, a pet, or something else</p>
        <div className="birthdayBtns">
            <button>Next</button>
            <button>Go Bacl</button>
        </div>
    </div>
  )
}

export default BirthdayForm