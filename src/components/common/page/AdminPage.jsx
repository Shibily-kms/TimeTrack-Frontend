import React, { useEffect } from 'react'
import './admin-page.scss'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import AllianceLogo from '../../../assets/images/alliance-logo.png'
import {
    MdOutlineSpaceDashboard, MdSpaceDashboard, MdAddCircleOutline, MdAddCircle,
    MdOutlineVerified, MdVerified, MdOutlineWorkHistory, MdWorkHistory
} from "react-icons/md";
import { IoCalendarNumberOutline, IoCalendarNumber } from "react-icons/io5";
import { PiUserListBold, PiUserListFill } from "react-icons/pi";
import { RiFileList3Line, RiFileList3Fill, RiSettingsLine, RiSettingsFill } from "react-icons/ri";
import { setAdminActivePage } from '../../../redux/features/user/systemSlice'



function AdminPage({ pageHead, children }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { internet, adminActivePage } = useSelector((state) => state.systemInfo)

    // eslint-disable-next-line
    const [searchParams, setSearchParams] = useSearchParams()

    const clickMenuItem = (url, page) => {
        dispatch(setAdminActivePage(page))
        navigate(url || '/admin')
    }



    return (

        <div className="admin-page-body">

            <div className="admin-body-section">
                <div className="admin-body">
                    <div className="title-section">
                        <div className="left">
                            <h3>{pageHead?.title}</h3>
                            <p>{pageHead?.desc}</p>
                        </div>
                        <div className="right">
                            {pageHead?.right}
                        </div>
                    </div>
                    <div className="body-content-div">
                        {children}
                    </div>
                </div>
            </div>

            <div className="nav-div">
                <div className="nav-sub-div">
                    <div className="title-section">
                        <div className="logo-section">
                            <div className="image-div">
                                <img src={AllianceLogo} alt='logo' />
                            </div>
                            <h3>Alliance</h3>
                        </div>
                    </div>
                    <div className="content-div">
                        <div className="menu-item-list">
                            <div className={adminActivePage === 'dashboard' ? "menu-item active-menu" : "menu-item"}
                                onClick={() => clickMenuItem('/admin', 'dashboard')}>
                                {adminActivePage === 'dashboard' ? <MdSpaceDashboard /> : <MdOutlineSpaceDashboard />}
                                <span>Dashboard</span>
                            </div>
                            <div className={adminActivePage === 'add-staff' ? "menu-item active-menu" : "menu-item"}
                                onClick={() => clickMenuItem('/admin/staff-list/add-staff', 'add-staff')}>
                                {adminActivePage === 'add-staff' ? <MdAddCircle /> : <MdAddCircleOutline />}
                                <span>Add Staff</span>
                            </div>
                            <div className={adminActivePage === 'staff-list' ? "menu-item active-menu" : "menu-item"}
                                onClick={() => clickMenuItem('/admin/staff-list', 'staff-list')}>
                                {adminActivePage === 'staff-list' ? <PiUserListFill /> : <PiUserListBold />}
                                <span>Staff List</span>
                            </div>
                            <div className={adminActivePage === 'leave-letters' ? "menu-item active-menu" : "menu-item"}
                                onClick={() => clickMenuItem('', 'leave-letters')}>
                                {adminActivePage === 'leave-letters' ? <RiFileList3Fill /> : <RiFileList3Line />}
                                <span>Leave letters</span>
                            </div>
                            <div className={adminActivePage === 'work-analyze' ? "menu-item active-menu" : "menu-item"}
                                onClick={() => clickMenuItem('', 'work-analyze')}>
                                {adminActivePage === 'work-analyze' ? <MdWorkHistory /> : <MdOutlineWorkHistory />}
                                <span>Work Analyze</span>
                            </div>
                            <div className={adminActivePage === 'monthly-reports' ? "menu-item active-menu" : "menu-item"}
                                onClick={() => clickMenuItem('', 'monthly-reports')}>
                                {adminActivePage === 'monthly-reports' ? <IoCalendarNumber /> : <IoCalendarNumberOutline />}
                                <span>Monthly Reports</span>
                            </div>
                            <div className={adminActivePage === 'designation-list' ? "menu-item active-menu" : "menu-item"}
                                onClick={() => clickMenuItem('/admin/designation-list', 'designation-list')}>
                                {adminActivePage === 'designation-list' ? <MdVerified /> : <MdOutlineVerified />}
                                <span>Designation List</span>
                            </div>
                            <div className={adminActivePage === 'settings' ? "menu-item active-menu" : "menu-item"}
                                onClick={() => clickMenuItem('/admin/settings', 'settings')}>
                                {adminActivePage === 'settings' ? <RiSettingsFill /> : <RiSettingsLine />}
                                <span>Settings</span>
                            </div>
                        </div>
                        <div className="software-info">
                            <p>@Alliance water solutions</p>
                            <p>version 2.0.0</p>
                        </div>
                    </div>
                    <div className="bottom-div">
                        <div className="profile-div">
                            <div className="image-div">
                                <img src={AllianceLogo} alt='profile' />
                            </div>
                            <div className="name-div">
                                <h4>Full Name</h4>
                                <p>SRL NO : 56846</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div >
    )
}

export default AdminPage