import React, { useState } from 'react'
import { MdCheck } from 'react-icons/md'
import styles from '../../styles/miscellaneous/selectCheckbox.module.css'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { addToCheckUsers, resetCheckedUsers, selectCheckedUsers } from '../../app/features/messagesSlice'

interface User{
    username:string;
    _id:string
}

const SelectCheckbox:React.FC<User>= (item) => {
    const [val,setVal]=useState<boolean>(false)
    const checkedUsers=useAppSelector(selectCheckedUsers)    
    const dispatch=useAppDispatch()
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setVal(e.target.checked)  
        if(e.target.checked){
            if (!checkedUsers?.some(user => user._id === item._id)) {
                dispatch(addToCheckUsers(item))
            }
        }      
    }
    return (
        <div className={styles.checkboxWrapper} >
            <input type="checkbox" id={`${item?._id}`} onChange={handleChange} checked={val} />
            <label htmlFor={`${item?._id}`}>
                <div className={`${styles.selectCheckboxContainer} ${val && styles.selectActiveCheckboxContainer}`}>
                    <MdCheck/>
                </div>
            </label>
        </div>
    )
}

export default SelectCheckbox