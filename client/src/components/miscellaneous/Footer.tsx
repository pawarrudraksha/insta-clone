import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/miscellaneous/footer.module.css';
import { footerData, postFooterData } from '../../data/footerData';

interface FooterProps {
  isPost?: boolean;
}

const Footer: React.FC<FooterProps> = ({ isPost }) => {
  return (
    <div className={`${styles.footerContainer} ${isPost && styles.postFooterContainer}`}>
      <div className={styles.footerContent}>
        {!isPost
          ? footerData.map((item, index) => (
              <div className={styles.footerLinkBox} key={index}>
                <Link to={item.link} className={styles.footerLink}>
                  {item.name}
                </Link>
                <p>.</p>
              </div>
            ))
          : postFooterData.map((item, index) => (
              <div className={styles.footerPostLinkBox} key={index}>
                <Link to={item.link} className={styles.footerLink}>
                  {item.name}
                </Link>
              </div>
            ))}
      </div>
      <p>© 2024 INSTAGRAM FROM META</p>
    </div>
  );
};

export default Footer;
