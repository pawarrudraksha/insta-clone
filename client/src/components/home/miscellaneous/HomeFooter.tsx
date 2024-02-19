import React from 'react'
import { footerData } from '../../../data/footerData'
import { Link } from 'react-router-dom'
import styles from "../../../styles/home/homeFooter.module.css"

const HomeFooter:React.FC = () => {
  return (
    <div className={styles.homeFooterContainer}>
      <div className={styles.homeFooterContent}>
        {
          footerData.map((item,index)=>(
            <div className={styles.homeFooterLinkBox} key={index}>
              <Link to={item.link} className={styles.homeFooterLink}>{item.name}</Link>
              <p>.</p>
            </div>
          ))
        }
      </div>
      <p>© 2024 INSTAGRAM FROM META</p>
    </div>
  )
}

export default HomeFooter