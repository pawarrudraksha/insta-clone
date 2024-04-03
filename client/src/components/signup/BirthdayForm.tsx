import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/signup/birthdayForm.module.css';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCreateUser, sendOtp, setCreateUser, toggleBirthdayForm, toggleOtpForm, toggleSignupForm } from '../../app/features/authSlice';

const BirthdayForm: React.FC = () => {
  const dispatch=useAppDispatch()
  const generateRange = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  };
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dates = generateRange(1, 31);

  const yr = new Date().getFullYear();
  const years = generateRange(yr - 95, yr);

  const [currentMonth, setCurrentMonth] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<number>(0);
  const [currentYear, setCurrentYear] = useState<number>(0);
  useEffect(() => {
    const currentDate = new Date();
    setCurrentMonth(months[currentDate.getMonth()]);
    setCurrentDate(currentDate.getDate());
    setCurrentYear(currentDate.getFullYear());
  }, []);

  const prevValues=useAppSelector(selectCreateUser)
  
  const handleSubmit=()=>{
    const findMonthNumber=months.findIndex((item)=>item===currentMonth)+1
    const updatedDate=currentDate<10 ? `0${currentDate}`:currentDate
    const updatedMonth=findMonthNumber<10 ? `0${findMonthNumber}`:findMonthNumber
    const updatedVal={
      ...prevValues,
      dob:`${updatedDate}/${updatedMonth}/${currentYear}`
    }
    dispatch(setCreateUser(updatedVal))  
    dispatch(toggleBirthdayForm())  
    dispatch(sendOtp(updatedVal?.email))
    dispatch(toggleOtpForm())
  }
  const handleGoBack=()=>{
    dispatch(toggleBirthdayForm()) 
    dispatch(toggleSignupForm()) 
  }
  return (
    <div className={styles.birthdayFormContainer}>
      <img src="" alt="" />
      <p>Add your birthday</p>
      <div className={styles.whyBirthdayContainer}>
        <p>This won't be a part of your public profile.</p>
        <Link className={styles.whyBirthdayLink} to="">Why do I need to provide my birthday</Link>
        <div className={styles.inputContainer}>
          <div>

            <select name="month" id="month" className={styles.birthdayFormSelect} value={currentMonth} onChange={(e) => setCurrentMonth(e.target.value)}>
              {months.map((month, index) => (
                <option key={index} value={month}>{month}</option>
              ))}
            </select>
            <select name="date" id="date" className={styles.birthdayFormSelect} value={currentDate.toString()} onChange={(e) => setCurrentDate(parseInt(e.target.value, 10))}>
            {dates.map((date, index) => (
              <option key={index} value={date}>{date}</option>
              ))}
          </select>
          <select name="year" id="year" className={styles.birthdayFormSelect}  value={currentYear.toString()} onChange={(e) => setCurrentYear(parseInt(e.target.value, 10))}>
            {years.map((year, index) => (
              <option key={index} value={year}>{year}</option>
            ))}
          </select>
              </div>
          <p>You need to enter the date you were born</p>
          <p>Use your own birthday, even if this account is for a business, a pet, or something else</p>
        </div>
      </div>
      <div className={styles.birthdayBtns}>
        <button onClick={handleSubmit} >Next</button>
        <button onClick={handleGoBack}>Go Back</button>
      </div>
    </div>
  );
}

export default BirthdayForm;
