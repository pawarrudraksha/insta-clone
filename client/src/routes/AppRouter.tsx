import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Error from '../components/miscellaneous/Error';
import Home from '../pages/Home';
import "../App.css"
import Sidebar from '../components/miscellaneous/Sidebar';

function AppRouter() {
  return (
    <div className="App">

    <BrowserRouter>
        <Sidebar/>
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