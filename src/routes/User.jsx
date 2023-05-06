import React, { useEffect, useState } from 'react'
import Sing_up from '../pages/user/sign-up/Sing_up'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../redux/features/user/authSlice'
import Login from '../pages/user/login/Login'
import Home from '../pages/user/home/Home'
import Work_details from '../pages/user/work-details/Work_details'


function User() {
  const dispatch = useDispatch()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { user } = useSelector((state) => state.userAuth)
  let loacl = JSON.parse(localStorage.getItem('userData'))

  useEffect(() => {
    if (user && loacl?.token) {
      setIsAuthenticated(true)
    } else if (!user && loacl?.token) {
      dispatch(setUser(loacl))
      setIsAuthenticated(true)
    }
  }, [])

  return (
    <Routes>
      <Route path='/' element={<PrivateRoute element={<Home />} isAuthenticated={isAuthenticated} />} />
      <Route path='/enter-work-details' element={<PrivateRoute element={<Work_details />} isAuthenticated={isAuthenticated} />} />
      <Route path='/sign-up' element={<Sing_up />} />
      <Route path='/login' element={<Login />} />
    </Routes>
  )
}

function PrivateRoute({ element, isAuthenticated }) {
  return isAuthenticated ? (
    <Routes>
      <Route path='/' element={element} />
    </Routes>
  ) : (
    <Navigate to="/login" />
  )
}

export default User