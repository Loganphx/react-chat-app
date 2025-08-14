import './App.css'
import {Route, Routes, Navigate, useLocation} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import {useAuthStore} from "./store/useAuthStore.js";
import {useEffect} from "react";
import {Loader} from "lucide-react";
import {Toaster} from "react-hot-toast";
import {useThemeStore} from "./store/useThemeStore.js";
function App() {
    const {authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();
    const {theme} = useThemeStore();

    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    const location = useLocation();

    useEffect(() => {
        switch (location.pathname) {
            case '/':
                document.title = 'Home | Strife';
                break;
            case '/settings':
                document.title = 'Settings | Strife';
                break;
            case '/profile':
                document.title = 'Profile | Strife';
                break;
            case '/login':
                document.title = 'Login | Strife';
                break;
            case '/signup':
                document.title = 'Signup | Strife';
                break;
            default:
                document.title = 'Strife';
        }
    }, [location.pathname]);

    if(isCheckingAuth && !authUser) return (
        <div className="flex items-center justify-center h-screen">
            <Loader className="size-10 animate-spin"/>
        </div>
    )
    return (
      <div data-theme={theme}>
        <Navbar/>
          <div className="pt-16">  {/* <-- Add this padding */}
              <Routes>
                <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login"/>}/>
                <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to="/"/>}/>
                <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/"/>}/>
                <Route path="/settings" element={<SettingsPage/>}/>
                <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to="/login"/>}/>
                <Route path="/*" element={<Navigate to="/"/>}/>
            </Routes>
          </div>
      <Toaster/>
      </div>
  )
}

export default App
