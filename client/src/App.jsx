import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { BrowserRouter, Routes, Route } from "react-router"
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from './Context/ThemeContext'
import { AuthProvider } from './Context/AuthContext'
import { BlogProvider } from './Context/BlogContext'
import ProtectedRoute from './ProtectedRoute'
import AddBlog from './pages/AddBlog'
import BlogDetail from './pages/BlogDetail'
import UpdateProfile from './pages/UpdateProfile'
import Profile from './pages/Profile'

function App() {


  return (
    <div>

      <ToastContainer />
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <BlogProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/addblog" element={
                <ProtectedRoute>
                  <AddBlog />
                </ProtectedRoute>
              } />
              <Route path='/blogDetail/:blogId' element={
                <ProtectedRoute>
                <BlogDetail />
              </ProtectedRoute>
              } />
              <Route path='/updateProfile' element={
                <ProtectedRoute>
                <UpdateProfile/>
              </ProtectedRoute>
              } />
              <Route path='/profile/:userId' element={
                <ProtectedRoute>
                <Profile/>
              </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
            </BlogProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>



    </div>
  )
}

export default App
