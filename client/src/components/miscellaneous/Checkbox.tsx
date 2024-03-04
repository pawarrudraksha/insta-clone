import React, { useState } from 'react'
import styles from '../../styles/miscellaneous/checkbox.module.css'

interface CheckboxProps{
    value:boolean;
    isDisabled?:boolean;
    setValue:Function;
    name:string;
}
const Checkbox:React.FC<CheckboxProps>= ({value,setValue,isDisabled,name}) => {
    const [toggleCheckboxBall,setToggleCheckboxBall]=useState(false)
    const handleCheckbox=(e: React.ChangeEvent<HTMLInputElement>)=>{
        e.stopPropagation()
        setValue()
        setToggleCheckboxBall(!toggleCheckboxBall)        
    }
    return (
        <div className={styles.checkboxContainer} >
            <input type="checkbox"  id={`check-box-${name}`} onChange={handleCheckbox} checked={value} disabled={isDisabled} />
            <label htmlFor={`check-box-${name}`}>
                <div className={`${styles.checkbox} ${toggleCheckboxBall && styles.activeCheckbox} ${isDisabled &&styles.disabledCheckbox}`}>
                    <div className={`${styles.checkboxBall} ${toggleCheckboxBall && styles.activeCheckboxBall}`}>
                    </div>
                </div>
            </label>
        </div>
    )
}

export default Checkbox