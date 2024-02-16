import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Error from '../components/Error';
import Home from '../pages/Home';

function AppRouter() {
  return (
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home/>} />
        {/* <Route path='/newsPage/:id' element={<NewsPage />}/> */}
        <Route path='*' element={<Error />} />
        </Routes>
    </BrowserRouter>
 )
}

export default AppRouter