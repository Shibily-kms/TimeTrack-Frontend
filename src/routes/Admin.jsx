import React, { useEffect, Suspense, lazy, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import NotFound from '../pages/admin/not-found/NotFound '
import PageLoading from '../components/common/spinners/PageLoading'
import AdminPage from '../components/common/page/AdminPage'
import Cookies from 'js-cookie';


const Dashboard = lazy(() => import('../pages/admin/dashboard/Dashboard'));
const AllStaffs = lazy(() => import('../pages/admin/all-staffs/AllStaffs'))
const AddStaff = lazy(() => import('../pages/admin/add-staff/AddStaff'))
const StaffProfile = lazy(() => import('../pages/admin/staff-profile/StaffProfile'))
const Designations = lazy(() => import('../pages/admin/designations/Designations'))
const Settings = lazy(() => import('../pages/admin/settings/Settings'))
const MonthlyReports = lazy(() => import('../pages/admin/work-report/WorkReport'))
const WorkAnalyze = lazy(() => import('../pages/admin/staff-works/WorkAnalyze'))
const QrGenerator = lazy(() => import('../pages/admin/qr-generator/QrGenerator'))
const LeaveApp = lazy(() => import('../pages/admin/leave-app/LeaveApp'))


function Admin() {
  let isAuthenticated = false

  const [pageHead, setPageHead] = useState({ title: null, desc: null, right: null })
  const acc_tkn = Cookies.get('_acc_tkn');
  const rfs_tkn = Cookies.get('_rfs_tkn');
  const ACC_ID = Cookies.get('ACC_ID');
  const DVC_ID = Cookies.get('DVC_ID');

  if (acc_tkn && ACC_ID && DVC_ID && rfs_tkn) {
    isAuthenticated = true
  }

  useEffect(() => {
    // Change Title
    document.title = `Time Track | Controller`;

  }, [])

  return (
    <AdminPage pageHead={pageHead}>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path='/' element={<PrivateRoute element={<Dashboard setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/staff-list' element={<PrivateRoute element={<AllStaffs setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/staff-list/:staff_id/view' element={<PrivateRoute element={<StaffProfile setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/designation-list' element={<PrivateRoute element={<Designations setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/settings' element={<PrivateRoute element={<Settings setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/analyze/salary-reports' element={<PrivateRoute element={<MonthlyReports setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/analyze/work-analyze' element={<PrivateRoute element={<WorkAnalyze setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/leave-letters' element={<PrivateRoute element={<LeaveApp setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/staff-list/add-staff' element={<PrivateRoute element={<AddStaff setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/qr-generator' element={<PrivateRoute element={<QrGenerator setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />


          {/* 404 Route */}
          <Route path="/*" element={<NotFound setPageHead={setPageHead} />} />
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
    <Navigate to="/admin/sign-in" />
  )
}

export default Admin