import React, { useEffect, Suspense, lazy, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DateBasie from '../pages/admin/staff-works/DateBasie'
import StaffBasie from '../pages/admin/staff-works/StaffBasie'
import WorkReport from '../pages/admin/work-report/WorkReport'
import NotFound from '../pages/admin/not-found/NotFound '
import PageLoading from '../components/common/spinners/PageLoading'
import AdminPage from '../components/common/page/AdminPage'
import { useSelector } from 'react-redux'

const Dashboard = lazy(() => import('../pages/admin/dashboard/Dashboard'));
const AllStaffs = lazy(() => import('../pages/admin/all-staffs/AllStaffs'))
const AddStaff = lazy(() => import('../pages/admin/add-staff/AddStaff'))
const StaffProfile = lazy(() => import('../pages/admin/staff-profile/StaffProfile'))
const Designations = lazy(() => import('../pages/admin/designations/Designations'))
const Settings = lazy(() => import('../pages/admin/settings/Settings'))
const MonthlyReports = lazy(() => import('../pages/admin/work-report/WorkReport'))


function Admin() {
  let isAuthenticated = false
  const { admin } = useSelector((state) => state.adminAuth)
  const [pageHead, setPageHead] = useState({ title: null, desc: null, right: null })

  if (admin?.token && localStorage.getItem('_aws_temp_tkn_adn')) {
    isAuthenticated = true
  }

  useEffect(() => {
    // Change Title 
    document.title = `Staff Works | Admin Panel`;
  }, [])

  return (
    <AdminPage pageHead={pageHead}>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path='/' element={<PrivateRoute element={<Dashboard setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/staff-list' element={<PrivateRoute element={<AllStaffs setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/staff-list/add-staff' element={<PrivateRoute element={<AddStaff setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/staff-list/:staff_id/view' element={<PrivateRoute element={<StaffProfile setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/designation-list' element={<PrivateRoute element={<Designations setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/settings' element={<PrivateRoute element={<Settings setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/analyze/monthly-reports' element={<PrivateRoute element={<MonthlyReports setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />


          <Route path='/staff-work-analyze/date-basie' element={<PrivateRoute element={<DateBasie setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/staff-work-analyze/staff-basie' element={<PrivateRoute element={<StaffBasie setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/monthly-work-report' element={<PrivateRoute element={<WorkReport setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />

          {/* 404 Route */}
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AdminPage>
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