import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { selectCurrentUser } from '../../app/features/authSlice'

export default function PrivateRoute() {
    const currentUser=useAppSelector(selectCurrentUser)
    return currentUser?._id ? <Outlet/> : <Navigate to={"/accounts/login"}/>
}
