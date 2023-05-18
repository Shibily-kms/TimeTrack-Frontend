import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/admin/login/Login'
import Home from '../pages/admin/home/Home'
import Add_work from '../pages/admin/add-work/Add_work'
import Staff_works from '../pages/admin/staff-works/Staff_works'
import { useSelector } from 'react-redux'

function Admin() {
  let isAuthenticated = false
  const { admin } = useSelector((state) => state.adminAuth)

  if (admin?.token) {
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