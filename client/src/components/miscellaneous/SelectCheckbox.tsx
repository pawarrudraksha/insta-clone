import React, { useEffect, useState } from "react";
import { MdCheck } from "react-icons/md";
import styles from "../../styles/miscellaneous/selectCheckbox.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  addToCheckUsers,
  selectCheckedUsers,
} from "../../app/features/messagesSlice";
import {
  addToCreateHighlightStories,
  selectCreateHighlightStories,
} from "../../app/features/highlightSlice";

interface User {
  _id: string;
  username?: string;
  type: "user" | "story";
}
const SelectCheckbox: React.FC<User> = (item) => {
  const checkedStories = useAppSelector(selectCreateHighlightStories);
  const [val, setVal] = useState<boolean>(false);
  const checkedUsers = useAppSelector(selectCheckedUsers);
  const dispatch = useAppDispatch();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.checked);
    if (item?.type === "user") {
      if (e.target.checked) {
        if (!checkedUsers?.some((user) => user._id === item._id)) {
          dispatch(
            addToCheckUsers({ _id: item?._id, username: item?.username })
          );
        }
      }
    } else if (item?.type === "story") {
      dispatch(
        addToCreateHighlightStories({
          _id: item?._id,
          selected: e.target.checked,
        })
      );
    }
  };
  return (
    <div className={styles.checkboxWrapper}>
      <input
        type="checkbox"
        id={`${item?._id}`}
        onChange={handleChange}
        checked={val}
      />
      <label htmlFor={`${item?._id}`}>
        <div
          className={`${styles.selectCheckboxContainer} ${
            val && styles.selectActiveCheckboxContainer
          }`}
        >
          <MdCheck />
        </div>
      </label>
    </div>
  );
};

export default SelectCheckbox;
