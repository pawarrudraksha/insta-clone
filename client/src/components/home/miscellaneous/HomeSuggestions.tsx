import React, { useEffect, useState } from "react";
import HomeSuggestionCard from "./HomeSuggestionCard";
import styles from "../../../styles/home/homeSuggestions.module.css";
import Footer from "../../miscellaneous/Footer";
import { searchUsers } from "../../../app/features/appSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectCurrentUser } from "../../../app/features/authSlice";
import {
  fetchFollowerDoc,
  fetchFollowingDoc,
} from "../../../app/features/homeSlice";

export interface SuggestionUser {
  _id: string;
  name: string;
  profilePic: string;
  username: string;
  isFollower?: boolean;
}
const HomeSuggestions: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const [homeSuggestions, setHomeSuggestions] = useState<SuggestionUser[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dispatch(
          searchUsers({ searchQuery: "", page: 1, limit: 10 })
        );
        const filteredResults: SuggestionUser[] = result?.payload?.data?.filter(
          (item: SuggestionUser) => item._id !== currentUser._id
        );

        const updatedResults = await Promise.all(
          filteredResults.map(async (result) => {
            const followDoc = await dispatch(fetchFollowerDoc(result?._id));
            const isAlreadyFollowing = await dispatch(
              fetchFollowingDoc(result?._id)
            );
            const isFollow = followDoc.payload?.data;
            if (isAlreadyFollowing?.payload?.data?._id) {
              return undefined;
            } else if (isFollow && isFollow.isRequestAccepted) {
              return { ...result, isFollower: true };
            } else {
              return result;
            }
          })
        );

        const filteredUpdatedResults: SuggestionUser[] = updatedResults.filter(
          (result): result is SuggestionUser => !!result
        );
        setHomeSuggestions(filteredUpdatedResults);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={styles.homeSuggestionsContainer}>
      <div className={styles.homeSuggestionHeader}>
        <HomeSuggestionCard isSelf user={currentUser} />
      </div>
      <div className={styles.homeSuggestionsContent}>
        <div className={styles.homeSuggestionsContentHeader}>
          <p className={styles.homeSuggestionsContentHeaderTitle}>
            Suggested for you
          </p>
          <p className={styles.homeSuggestionsContentHeaderBtn}>See All</p>
        </div>
        <div className={styles.homeSuggestionsCards}>
          {homeSuggestions?.map((user, index) => (
            <HomeSuggestionCard key={index} user={user} />
          ))}
        </div>
      </div>
      <div className={styles.homeSuggestionsFooter}>
        <Footer isPost={false} />
      </div>
    </div>
  );
};

export default HomeSuggestions;
