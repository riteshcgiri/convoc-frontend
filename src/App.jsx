import { Routes, Route, useNavigate } from 'react-router-dom'
import Landing from './pages/Landing'
import SignUp from './pages/auth/SignUp'
import SignIn from './pages/auth/SignIn'
import VerifyOTP from './pages/auth/VerifyOTP'
import NotificationManager from './components/Notification/NotificationManager'
import ForgetPassword from './pages/auth/ForgetPassword'
import Navbar from './components/nav/Navbar'
import ResetPassword from './pages/auth/ResetPassword'
import OtpGuard from './components/guards/OtpGuard'
import ResetGuard from './components/guards/ResetGuard'
import PublicGuard from './components/guards/PublicGuard'
import useAuthStore from './store/auth.store'
import { useEffect } from 'react'
import useNotificationStore from './store/notification.store'
import Chat from './pages/chat/Chat'
import { connectSocket } from './services/socket'
import useSocket from './hooks/useSocket'
import useSocketEvents from './hooks/useSocketEvents'


const App = () => {

  const {isAuth, checkAuth, user} = useAuthStore()
  const {addNotification} = useNotificationStore()
  const navigate = useNavigate()
  
  useSocket();
  useSocketEvents();

  
  useEffect(() => {
    checkAuth();
  }, []);
  
  
  useEffect(() => {
     if (user?._id) {
      connectSocket(user._id);
    }
  }, [user]);

  return (

    <div className='relative'>
      <div className={`w-full h-screen bg-white ${!isAuth && ' px-20 py-5'} font-sansation`}>
       {!isAuth && <Navbar />}
          <Routes >
            <Route path='/' element={<PublicGuard><Landing /></PublicGuard>} />
            <Route path='/signup' element={<PublicGuard><SignUp /></PublicGuard>} />
            <Route path='/signin' element={<PublicGuard><SignIn /></PublicGuard>} />
            <Route path='/verify-otp' element={<OtpGuard><VerifyOTP /></OtpGuard>} />
            <Route path='/forget-password' element={<PublicGuard><ForgetPassword /></PublicGuard>} />
            <Route path='/reset-password' element={<ResetGuard><ResetPassword /></ResetGuard>} />


            <Route path='/chat' element={<Chat />} />
          </Routes>

      </div>

      <NotificationManager />
    </div>

  )
}

export default App
