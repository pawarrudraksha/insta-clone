import React from 'react'
import { Link } from 'react-router-dom'

const OptionsFooter:React.FC= () => {
  return (
    <div className="optionsFooter">
        <div className="optionsFooterQuestion">
            <p>Have an account</p>
            <Link to={"/"}>Log in</Link>
        </div>
        <div className="optionsFooterGetApp">
            <p>Get the app</p>
            <div className="optionsFooterApps">
                <img src="assets/googlePlay.png" alt="google play" />
                <img src="assets/microsoft.png" alt="microsoft" />
            </div>
        </div>
    </div>
  )
}

export default OptionsFooter