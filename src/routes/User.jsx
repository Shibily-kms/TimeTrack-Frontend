import React from 'react'
import SingUp from '../pages/user/sign-up/Sing_up'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../redux/features/user/authSlice'
import Login from '../pages/user/login/Login'
import Home from '../pages/user/home/Home'
import WorkDetails from '../pages/user/work-details/Work_details'


function User() {
  const dispatch = useDispatch()
  let isAuthenticated = false
  const { user } = useSelector((state) => state.userAuth)
  let loacl = JSON.parse(localStorage.getItem('userData'))

  if (user && loacl?.token) {
    isAuthenticated = true
  } else if (!user && loacl?.token) {
    dispatch(setUser(loacl))
    isAuthenticated = true
  }

  return (
    <Routes>
      <Route path='/' element={<PrivateRoute element={<Home />} isAuthenticated={isAuthenticated} />} />
      <Route path='/enter-work-details' element={<PrivateRoute element={<WorkDetails />} isAuthenticated={isAuthenticated} />} />
      <Route path='/sign-up' element={<SingUp />} />
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