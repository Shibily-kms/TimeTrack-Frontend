import React, { useEffect } from 'react'
import './admin-page.scss'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import AllianceLogo from '../../../assets/images/alliance-logo.png'
import {
    MdOutlineSpaceDashboard, MdSpaceDashboard, MdAddCircleOutline, MdAddCircle,
    MdOutlineVerified, MdVerified
} from "react-icons/md";
import { PiUserListBold, PiUserListFill } from "react-icons/pi";
import { RiFileList3Line, RiFileList3Fill, RiSettingsLine, RiSettingsFill } from "react-icons/ri";
import { setAdminActivePage } from '../../../redux/features/user/systemSlice'



function AdminPage({ pageHead, children }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { internet, adminActivePage } = useSelector((state) => state.systemInfo)

    // eslint-disable-next-line
    const [searchParams, setSearchParams] = useSearchParams()



    return (

        <div className="admin-page-body">
            <div className="nav-div">
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
                            onClick={() => dispatch(setAdminActivePage('dashboard'))}>
                            {adminActivePage === 'dashboard' ? <MdSpaceDashboard /> : <MdOutlineSpaceDashboard />}
                            <span>Dashboard</span>
                        </div>
                        <div className={adminActivePage === 'add-staff' ? "menu-item active-menu" : "menu-item"}
                            onClick={() => dispatch(setAdminActivePage('add-staff'))}>
                            {adminActivePage === 'add-staff' ? <MdAddCircle /> : <MdAddCircleOutline />}
                            <span>Add Staff</span>
                        </div>
                        <div className={adminActivePage === 'staff-list' ? "menu-item active-menu" : "menu-item"}
                            onClick={() => dispatch(setAdminActivePage('staff-list'))}>
                            {adminActivePage === 'staff-list' ? <PiUserListFill /> : <PiUserListBold />}
                            <span>Staff List</span>
                        </div>
                        <div className={adminActivePage === 'designation-list' ? "menu-item active-menu" : "menu-item"}
                            onClick={() => dispatch(setAdminActivePage('designation-list'))}>
                            {adminActivePage === 'designation-list' ? <MdVerified /> : <MdOutlineVerified />}
                            <span>Designation List</span>
                        </div>
                        <div className={adminActivePage === 'leave-letters' ? "menu-item active-menu" : "menu-item"}
                            onClick={() => dispatch(setAdminActivePage('leave-letters'))}>
                            {adminActivePage === 'leave-letters' ? <RiFileList3Fill /> : <RiFileList3Line />}
                            <span>Leave letters</span>
                        </div>
                        <div className={adminActivePage === 'settings' ? "menu-item active-menu" : "menu-item"}
                            onClick={() => dispatch(setAdminActivePage('settings'))}>
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

        </div >
    )
}

export default AdminPage