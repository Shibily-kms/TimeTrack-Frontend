import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/admin/login/Login'
import Home from '../pages/admin/home/Home'
import StaffWorks from '../pages/admin/staff-works/Staff_works'
import Designations from '../pages/admin/designations/Designations'
import AllStaffs from '../pages/admin/all-staffs/AllStaffs'
import { useSelector } from 'react-redux'

function Admin() {
  let isAuthenticated = false
  const { admin } = useSelector((state) => state.adminAuth)

  if (admin?.token) {
    isAuthenticated = true
  }

  useEffect(() => {
    // Change Title
    document.title = `Staff Works | Admin Panel`;
  }, [])

  return (
    <Routes>
      <Route path='/' element={<PrivateRoute element={<Home />} isAuthenticated={isAuthenticated} />} />
      <Route path='/staff-work-details' element={<PrivateRoute element={<StaffWorks />} isAuthenticated={isAuthenticated} />} />
      <Route path='/designations' element={<PrivateRoute element={<Designations />} isAuthenticated={isAuthenticated} />} />
      <Route path='/all-staffs' element={<PrivateRoute element={<AllStaffs />} isAuthenticated={isAuthenticated} />} />
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