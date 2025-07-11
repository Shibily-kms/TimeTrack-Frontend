import React, { useState } from 'react'
import './admin-page.scss'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import AllianceLogo from '../../../assets/images/alliance-logo.png'
import {
    MdOutlineSpaceDashboard, MdSpaceDashboard, MdOutlineWorkHistory, MdWorkHistory,
} from "react-icons/md";
import { LuIndianRupee, LuQrCode } from "react-icons/lu";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { PiUserListBold, PiUserListFill } from "react-icons/pi";
import { RiFileList3Line, RiFileList3Fill, RiShieldStarLine, RiShieldStarFill } from "react-icons/ri";
import { IoPricetagsSharp, IoPricetagsOutline } from 'react-icons/io5'
import { setAdminActivePage } from '../../../redux/features/user/systemSlice'
import { getUserProfileImagePath } from '../../../assets/javascript/find-helpers'
import { ui_version } from '../../../assets/javascript/const-data'
import { TbLayoutSidebarLeftCollapseFilled, TbLayoutSidebarLeftExpandFilled, TbRouteAltLeft, TbRouteAltRight } from 'react-icons/tb'
import { IoMdLogOut } from 'react-icons/io'


function AdminPage({ pageHead, children }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { adminActivePage } = useSelector((state) => state.systemInfo)
    const { user } = useSelector((state) => state.userAuth)
    const userProfileImage = getUserProfileImagePath(user?.first_name);
    const [navActive, setNavActive] = useState(false)

    const clickMenuItem = (url, page) => {
        dispatch(setAdminActivePage(page))
        navigate(url || '/admin')
    }



    return (

        <div className={`admin-page-body ${navActive && "semi-nav-active"}`}>

            <div className="admin-body-section">
                <div className="admin-body">
                    <div className="title-section">
                        <div className="left">
                            <div className="title">
                                {navActive
                                    ? <TbLayoutSidebarLeftCollapseFilled onClick={() => setNavActive(!navActive)} />
                                    : <TbLayoutSidebarLeftExpandFilled onClick={() => setNavActive(!navActive)} />
                                }
                                <h3>{pageHead?.title}</h3>
                            </div>
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
                            {/* Dashboard */}
                            <div className={adminActivePage === 'dashboard' ? "menu-item active-menu" : "menu-item"}
                                onClick={() => clickMenuItem('/admin', 'dashboard')}>
                                {adminActivePage === 'dashboard' ? <MdSpaceDashboard /> : <MdOutlineSpaceDashboard />}
                                <span>Dashboard</span>
                            </div>

                            {/* Staff list */}
                            {user?.allowed_origins?.some(access => ['ttcr_stfAcc_read', 'ttcr_stfAcc_write'].includes(access)) &&
                                <div className={adminActivePage === 'staff-list' ? "menu-item active-menu" : "menu-item"}
                                    onClick={() => clickMenuItem('/admin/staff-list', 'staff-list')}>
                                    {adminActivePage === 'staff-list' ? <PiUserListFill /> : <PiUserListBold />}
                                    <span>Staff List</span>
                                </div>}

                            {/* Leave letter */}
                            {user?.allowed_origins?.some(access => ['ttcr_l2_read', 'ttcr_l2_write'].includes(access)) &&
                                <div className={adminActivePage === 'leave-letters' ? "menu-item active-menu" : "menu-item"}
                                    onClick={() => clickMenuItem('/admin/leave-letters', 'leave-letters')}>
                                    {adminActivePage === 'leave-letters' ? <RiFileList3Fill /> : <RiFileList3Line />}
                                    <span>Leave letters</span>
                                </div>}

                            {/* Work analyze */}
                            {user?.allowed_origins?.some(access => ['ttcr_anlz_read', 'ttcr_anlz_write'].includes(access)) &&
                                <div className={adminActivePage === 'work-analyze' ? "menu-item active-menu" : "menu-item"}
                                    onClick={() => clickMenuItem(`/admin/analyze/work-analyze?month=${new Date().toISOString().split('T')[0].slice(0, 7)}&staff=all`, 'work-analyze')}>
                                    {adminActivePage === 'work-analyze' ? <MdWorkHistory /> : <MdOutlineWorkHistory />}
                                    <span>Work Analyze</span>
                                </div>}

                            {/* Salary report */}
                            {user?.allowed_origins?.some(access => ['ttcr_rprt_read', 'ttcr_rprt_write'].includes(access)) &&
                                <div className={adminActivePage === 'salary-reports' ? "menu-item active-menu" : "menu-item"}
                                    onClick={() => clickMenuItem('/admin/analyze/salary-reports', 'salary-reports')}>
                                    {adminActivePage === 'salary-reports' ? <FaIndianRupeeSign /> : <LuIndianRupee />}
                                    <span>Salary Reports</span>
                                </div>}

                            {/* QR */}
                            {user?.allowed_origins?.some(access => ['ttcr_qr_write'].includes(access)) &&
                                <div className={adminActivePage === 'qr-generator' ? "menu-item active-menu" : "menu-item"}
                                    onClick={() => clickMenuItem('/admin/qr-generator', 'qr-generator')}>
                                    {adminActivePage === 'qr-generator' ? <LuQrCode /> : <LuQrCode />}
                                    <span>QR Generator</span>
                                </div>}

                            {/* Designation */}
                            {user?.allowed_origins?.some(access => ['ttcr_pro_read', 'ttcr_pro_write'].includes(access)) &&
                                <div className={adminActivePage === 'designation-list' ? "menu-item active-menu" : "menu-item"}
                                    onClick={() => clickMenuItem('/admin/designation-list', 'designation-list')}>
                                    {adminActivePage === 'designation-list' ? <IoPricetagsSharp /> : <IoPricetagsOutline />}
                                    <span>Designation List</span>
                                </div>}

                            {/* Software Origins */}
                            {/* {user?.allowed_origins?.some(access => ['ttcr_pro_read', 'ttcr_pro_write'].includes(access)) &&
                                <div className={adminActivePage === 'software-origins' ? "menu-item active-menu" : "menu-item"}
                                    onClick={() => clickMenuItem('/admin/software-origins', 'software-origins')}>
                                    {adminActivePage === 'software-origins' ? <TbRouteAltLeft /> : <TbRouteAltRight />}
                                    <span>Software Origins</span>
                                </div>} */}

                            {/* Pro Accounts */}
                            {user?.allowed_origins?.includes('dvur_backup_read') &&
                                <div className={adminActivePage === 'pro-accounts' ? "menu-item active-menu" : "menu-item"}
                                    onClick={() => clickMenuItem('/admin/pro-accounts', 'pro-accounts')}>
                                    {adminActivePage === 'pro-accounts' ? <RiShieldStarFill /> : <RiShieldStarLine />}
                                    <span>Pro Accounts</span>
                                </div>}

                            {/* Settings */}
                            <div className={"menu-item exit-item"} onClick={() => navigate('/?page=home')}>
                                {adminActivePage === 'settings' ? <IoMdLogOut /> : <IoMdLogOut />}
                                <span>Exit</span>
                            </div>
                        </div>
                        <div className="software-info">
                            <p>@Alliance water solutions</p>
                            <p>version {ui_version}</p>
                        </div>
                    </div>
                    <div className="bottom-div">
                        <div className="profile-div">
                            <div className="image-div">
                                <img src={userProfileImage || AllianceLogo} alt='profile' />
                            </div>
                            <div className="name-div">
                                <h4>{user?.first_name} {user?.last_name}</h4>
                                <p>{user?.designation}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div >
    )
}

export default AdminPage