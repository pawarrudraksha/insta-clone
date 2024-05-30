import React from "react";
import styles from "../styles/home/home.module.css";
import HomeStories from "../components/home/HomeStories";
import HomeProfileAndSuggestions from "../components/home/HomeProfileAndSuggestions";
import HomePosts from "../components/home/HomePosts";
import MobileHomeHeader from "../components/home/MobileHomeHeader";

const Home: React.FC = () => {
  const isMobile = window.innerWidth < 768;
  return (
    <div className={styles.home}>
      <div className={styles.homeFeed}>
        {isMobile && <MobileHomeHeader />}
        <HomeStories />
        <HomePosts />
      </div>
      <div className={styles.homeProfileAndSuggestionsWrapper}>
        <HomeProfileAndSuggestions />
      </div>
    </div>
  );
};

export default Home;
