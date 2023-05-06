import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/admin/login/Login'
import Home from '../pages/admin/home/Home'
import Add_work from '../pages/admin/add-work/Add_work'
import Staff_works from '../pages/admin/staff-works/Staff_works'
import { useDispatch, useSelector } from 'react-redux'
import { setAdmin } from '../redux/features/admin/authSlice'

function Admin() {
  const dispatch = useDispatch()
  let isAuthenticated = false
  const { admin } = useSelector((state) => state.adminAuth)
  let loacl = JSON.parse(localStorage.getItem('adminData'))


  if (admin && loacl?.token) {
    isAuthenticated = true
  } else if (!admin && loacl?.token) {
    dispatch(setAdmin(loacl))
    isAuthenticated = true
  }


  return (
    <Routes>
      <Route path='/' element={<PrivateRoute element={<Home />} isAuthenticated={isAuthenticated} />} />
      <Route path='/add-work' element={<PrivateRoute element={<Add_work />} isAuthenticated={isAuthenticated} />} />
      <Route path='/staff-work-details' element={<PrivateRoute element={<Staff_works />} isAuthenticated={isAuthenticated} />} />
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
    <Navigate to="/admin/login" />
  )
}

export default Admin