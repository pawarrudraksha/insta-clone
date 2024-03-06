import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Error from '../components/miscellaneous/Error';
import Home from '../pages/Home';
import "../App.css"
import Sidebar from '../components/miscellaneous/main/Sidebar';
import Search from '../components/miscellaneous/main/Search';
import {  selectIsSearchModalOpen, toggleSearchModal } from '../app/features/appSlice';
import AccountDetail from '../pages/AccountDetail';
import PostPage from '../pages/PostPage';
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { selectIsPostModalOpen } from '../app/features/viewPostSlice'
import PostModal from '../components/posts/PostModal';
import StoryPage from '../pages/StoryPage';
import HighlightPage from '../pages/HighlightPage';
import ReelsPage from '../pages/ReelsPage';
import ExplorePage from '../pages/ExplorePage';
import { selectIsCreatePostModalOpen } from '../app/features/createPostSlice';
import CreatePostOverlay from '../components/create/CreatePostOverlay';
import SignUp from '../pages/SignUp';
import MessagesPage from '../pages/MessagesPage';
import NewMessageModal from '../components/messages/sidebar/NewMessageModal';
import { selectIsNewMessageModalOpen } from '../app/features/messagesSlice';

function AppRouter() {
  const dispatch=useAppDispatch()
  const isSearchModalOpen=useAppSelector(selectIsSearchModalOpen)
  const isPostModalOpen=useAppSelector(selectIsPostModalOpen)
  const isCreatePostModalOpen=useAppSelector(selectIsCreatePostModalOpen)

  const handleModal=()=>{
    if(isSearchModalOpen){
      dispatch(toggleSearchModal())
    }
  }
  const isNewMessageModalOpen=useAppSelector(selectIsNewMessageModalOpen)
  return (
    <div className="App" onClick={handleModal}>

    <BrowserRouter>
        <Sidebar/>
        {isCreatePostModalOpen && <CreatePostOverlay/>}
        {isPostModalOpen && <PostModal />}
        {isNewMessageModalOpen && <NewMessageModal/>}
        <Routes>
        <Route path="/" element={<Home/>} />
        <Route path='/:username' element={<AccountDetail />}/>
        <Route path='/explore/' element={<ExplorePage />}/>
        <Route path='/p/:id' element={<PostPage />}/>
        <Route path='/reels/:id' element={<ReelsPage />}/>
        <Route path='/stories/:username/:storyId' element={<StoryPage />}/>
        <Route path='/stories/highlights/:highlightId' element={<HighlightPage />}/>
        <Route path='/accounts/emailsignup' element={<SignUp />}/>
        <Route path='/direct/inbox' element={<MessagesPage />}/>
        <Route path='*' element={<Error />} />
        </Routes>
    </BrowserRouter>
    </div>
 )
}

export default AppRouter