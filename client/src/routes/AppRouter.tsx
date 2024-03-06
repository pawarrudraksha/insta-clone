import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Error from '../components/miscellaneous/Error';
import Home from '../pages/Home';
import "../App.css"
import Sidebar from '../components/miscellaneous/main/Sidebar';
import Search from '../components/miscellaneous/main/Search';
import {  selectIsMoreModalOpen, selectIsNotificationModalOpen, selectIsNotificationRequestsModalOpen, selectIsSearchModalOpen, toggleMoreModal, toggleNotificationModal, toggleSearchModal } from '../app/features/appSlice';
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
import MoreModal from '../components/miscellaneous/main/MoreModal';
import NotificationModal from '../components/notification/NotificationModal';
import NotificationRequestsModal from '../components/notification/NotificationRequestsModal';

function AppRouter() {
  const dispatch=useAppDispatch()
  const isSearchModalOpen=useAppSelector(selectIsSearchModalOpen)
  const isPostModalOpen=useAppSelector(selectIsPostModalOpen)
  const isCreatePostModalOpen=useAppSelector(selectIsCreatePostModalOpen)
  const isNewMessageModalOpen=useAppSelector(selectIsNewMessageModalOpen)
  const isMoreModalOpen=useAppSelector(selectIsMoreModalOpen)
  const isNotificationModalOpen=useAppSelector(selectIsNotificationModalOpen)
  const toggleNotificationRequestsModal=useAppSelector(selectIsNotificationRequestsModalOpen)

  const handleModal=()=>{
    if(isSearchModalOpen){
      dispatch(toggleSearchModal())
    }
    if(isMoreModalOpen){
      dispatch(toggleMoreModal())
    }
    if(isNotificationModalOpen){
      dispatch(toggleNotificationModal())
    }
    
  }
  return (
    <div className="App" onClick={handleModal}>

    <BrowserRouter>
        <Sidebar/>
        {isCreatePostModalOpen && <CreatePostOverlay/>}
        {isPostModalOpen && <PostModal />}
        {isNewMessageModalOpen && <NewMessageModal/>}
        {isMoreModalOpen && <MoreModal/>}
        {isNotificationModalOpen && <NotificationModal/>}
        {toggleNotificationRequestsModal && <NotificationRequestsModal/>}
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