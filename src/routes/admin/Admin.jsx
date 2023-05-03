import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../../pages/admin/login/Login'
import Home from '../../pages/admin/Home'
import { useDispatch, useSelector } from 'react-redux'
import { setAdmin } from '../../redux/features/admin/authSlice'

function Admin() {
  const dispatch = useDispatch()
  let isAuthenticated = false
  const { admin } = useSelector((state) => state.adminAuth)
  let loacl = JSON.parse(localStorage.getItem('adminData'))

  // console.log(loacl.token,'is')

  if (admin && loacl.token) {
    console.log('1');
    isAuthenticated = true
  } else if (!admin && loacl.token) {
    console.log('2');
    dispatch(setAdmin(loacl))
    isAuthenticated = true
  }
  console.log('3');
  console.log(isAuthenticated,'is')

  return (
    <Routes>
      <Route path='/' element={<PrivateRoute element={<Home />} isAuthenticated={isAuthenticated} />} />
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