import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Error from '../components/miscellaneous/Error';
import Home from '../pages/Home';
import "../App.css"
import Sidebar from '../components/miscellaneous/Sidebar';
import Search from '../components/miscellaneous/Search';
import {  selectIsSearchModalOpen } from '../app/features/appSlice';
import { useSelector } from 'react-redux';

function AppRouter() {
  const isSearchModalOpen=useSelector(selectIsSearchModalOpen)
  return (
    <div className="App">

    <BrowserRouter>
        <Sidebar/>
        {isSearchModalOpen && <Search/>}
        <Routes>
        <Route path="/" element={<Home/>} />
        {/* <Route path='/newsPage/:id' element={<NewsPage />}/> */}
        <Route path='*' element={<Error />} />
        </Routes>
    </BrowserRouter>
    </div>
 )
}

export default AppRouter