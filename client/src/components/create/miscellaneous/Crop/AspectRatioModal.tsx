import React from 'react'
import { CiImageOn } from 'react-icons/ci'
import { LuRectangleHorizontal, LuRectangleVertical } from 'react-icons/lu'
import { MdCropSquare } from 'react-icons/md'
import styles from '../../../../styles/create/aspectRatioModal.module.css'
import { selectCurrentAspectRatio, setCurrentAspectRatio } from '../../../../app/features/createPostSlice'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'

const AspectRatioModal :React.FC= () => {
    const currentAspectRatio=useAppSelector(selectCurrentAspectRatio)
    const dispatch=useAppDispatch()
    const aspectRatioItems=[
        {
            name:"Original",
            svg:<CiImageOn/>
        },
        {
            name:"1:1",
            svg:<MdCropSquare/>
        },
        {
            name:"4:5",
            svg:<LuRectangleVertical/>
        },
        {
            name:"16:9",
            svg:<LuRectangleHorizontal/>
        },
    ]  
    
    const handleAspectRatioClick=(ratio:string)=>{
        dispatch(setCurrentAspectRatio(ratio))
    }
    
    return (
        <div className={styles.aspectRatioModal}>
            <ul className={styles.aspectRatioList}>
                {
                    aspectRatioItems.map((item,index)=>(
                        <li 
                        className={`${styles.aspectRatioListItem} ${currentAspectRatio===item.name && styles.activeAspectRatioItem}`} 
                        key={index} 
                        onClick={()=>handleAspectRatioClick(item.name)}
                        >
                            <p>{item.name}</p>
                            {item.svg}
                        </li>
                ))
                }
            </ul>
        </div>
    )
}

export default AspectRatioModal