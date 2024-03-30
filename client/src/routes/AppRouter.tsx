import React from 'react'
import {Route, Routes, useLocation } from 'react-router-dom'
import Error from '../components/miscellaneous/Error';
import Home from '../pages/Home';
import "../App.css"
import Sidebar from '../components/miscellaneous/main/Sidebar';
import {  selectIsMoreModalOpen, selectIsNotificationModalOpen, selectIsNotificationRequestsModalOpen, selectIsSearchModalOpen, setSidebarActiveTab, toggleMoreModal, toggleNotificationModal, toggleSearchModal } from '../app/features/appSlice';
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
import Login from '../pages/Login';
import PrivateRoute from '../components/miscellaneous/PrivateRoute';
import { selectCurrentUser } from '../app/features/authSlice';

function AppRouter() {
  const dispatch=useAppDispatch()
  const currentUser=useAppSelector(selectCurrentUser)
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
      dispatch(setSidebarActiveTab(""))
    }
    if(isMoreModalOpen){
      dispatch(toggleMoreModal())
      dispatch(setSidebarActiveTab(""))
    }
    if(isNotificationModalOpen){
      dispatch(toggleNotificationModal())
      dispatch(setSidebarActiveTab(""))
    }
    
  }
  const location=useLocation()
  const hideSidebar=location.pathname.includes("signup")|| location.pathname.includes("login") || !currentUser?._id
  return (
    <div className="App" onClick={handleModal}>
        {!hideSidebar && <Sidebar/>}
        {isCreatePostModalOpen && <CreatePostOverlay/>}
        {isPostModalOpen && <PostModal />}
        {isNewMessageModalOpen && <NewMessageModal/>}
        {isMoreModalOpen && <MoreModal/>}
        {isNotificationModalOpen && <NotificationModal/>}
        {toggleNotificationRequestsModal && <NotificationRequestsModal/>}
        <Routes>
        <Route path='/accounts/emailsignup' element={<SignUp />}/>
        <Route path='/accounts/login' element={<Login/>}/>
        <Route path='/:username' element={<AccountDetail />}/>
        <Route path='/explore/' element={<ExplorePage />}/>
        <Route path='/p/:postId' element={<PostPage />}/>
        <Route path='/reels/:id' element={<ReelsPage />}/>
        <Route element={<PrivateRoute/>}>
          <Route path="/" element={<Home/>} />
          <Route path='/stories/:username/:storyId' element={<StoryPage />}/>
          <Route path='/stories/highlights/:highlightId' element={<HighlightPage />}/>
          <Route path='/direct/inbox' element={<MessagesPage />}/>
        </Route>
        <Route path='*' element={<Error />} />
        </Routes>
    </div>
 )
}

export default AppRouter