import React, { useState } from 'react'
import { MdCheck } from 'react-icons/md'
import styles from '../../styles/miscellaneous/selectCheckbox.module.css'

const SelectCheckbox:React.FC = () => {
    const [val,setVal]=useState<boolean>(false)
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setVal(e.target.checked)        
    }
    return (
        <div className={styles.checkboxWrapper} >
            <input type="checkbox" id='checkbox-id' onChange={handleChange} checked={val} />
            <label htmlFor="checkbox-id">
                <div className={`${styles.selectCheckboxContainer} ${val && styles.selectActiveCheckboxContainer}`}>
                    <MdCheck/>
                </div>
            </label>
        </div>
    )
}

export default SelectCheckbox