import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Error from '../components/miscellaneous/Error';
import Home from '../pages/Home';
import "../App.css"
import Sidebar from '../components/miscellaneous/Sidebar';
import Search from '../components/miscellaneous/Search';
import {  selectIsSearchModalOpen, toggleSearchModal } from '../app/features/appSlice';
import AccountDetail from '../pages/AccountDetail';
import PostPage from '../pages/PostPage';
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { selectIsPostModalOpen } from '../app/features/postSlice'
import PostModal from '../components/posts/PostModal';
import StoryPage from '../pages/StoryPage';
import HighlightPage from '../pages/HighlightPage';
import ReelsPage from '../pages/ReelsPage';
import ExplorePage from '../pages/ExplorePage';

function AppRouter() {
  const dispatch=useAppDispatch()
  const isSearchModalOpen=useAppSelector(selectIsSearchModalOpen)
  const isPostModalOpen=useAppSelector(selectIsPostModalOpen)

  const handleModal=()=>{
    if(isSearchModalOpen){
      dispatch(toggleSearchModal())
    }
  }
  return (
    <div className="App" onClick={handleModal}>

    <BrowserRouter>
        <Sidebar/>
        {isSearchModalOpen && <Search/>}
        {isPostModalOpen && <PostModal />}
        <Routes>
        <Route path="/" element={<Home/>} />
        <Route path='/:username' element={<AccountDetail />}/>
        <Route path='/explore/' element={<ExplorePage />}/>
        <Route path='/p/:id' element={<PostPage />}/>
        <Route path='/reels/:id' element={<ReelsPage />}/>
        <Route path='/stories/:username/:storyId' element={<StoryPage />}/>
        <Route path='/stories/highlights/:highlightId' element={<HighlightPage />}/>
        <Route path='*' element={<Error />} />
        </Routes>
    </BrowserRouter>
    </div>
 )
}

export default AppRouter