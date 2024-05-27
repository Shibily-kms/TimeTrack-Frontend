import React, { useEffect } from 'react'
import './home.scss'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BsQrCodeScan } from "react-icons/bs";
import { IoFingerPrint, IoLogoAppleAr } from "react-icons/io5";
import { MdOutlineMiscellaneousServices, MdAdminPanelSettings } from "react-icons/md";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { FaStore } from "react-icons/fa";
import { LuListPlus } from "react-icons/lu";
import { HiUserGroup } from "react-icons/hi2";
import { BiMath } from "react-icons/bi";
import ProfileCard from '../../../components/user/profile-card/ProfileCard';
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper';
import { MdCleaningServices } from "react-icons/md";



function Home({ setPageHead }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useSelector((state) => state.userAuth)
  const { admin } = useSelector((state) => state.adminAuth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!searchParams.get('page')) {
      setSearchParams(`page=home`)
    }
    setPageHead(() => ({ title: null }))

    // eslint-disable-next-line
  }, [])

  return (
    <div className='home-page'>
      <div className="profile-section">
        <ProfileCard />
        {user.dob?.slice(5) === YYYYMMDDFormat(new Date())?.slice(5) && <div className="birth-box">
          <picture>
            <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.webp" type="image/webp" />
            <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.gif" alt="🎉" width="60" height="60" />
          </picture>
          <h4>Happy Birth Day</h4>
          <h2>{user?.first_name} {user?.last_name}!</h2>
          <p></p>
        </div>}
      </div>
      <div className="section-one-div">
        <div className="section-content">
          {(user?.punch_type === 'scanner' || !user?.punch_type) &&
            <div className="big-button scanner" onClick={() => navigate('/scanner')}>
              <BsQrCodeScan />
              <p>Scanner</p>
            </div>}
          {user?.punch_type === 'software' &&
            <div className="big-button software" onClick={() => navigate('/punch-work?page=more')}>
              <IoFingerPrint />
              <p>Punch to Work</p>
            </div>}
          <div className="big-button" onClick={() => navigate('/enter-today?page=more')}>
            <LuListPlus />
            <p>Enter today</p>
          </div>
        </div>
      </div>

      <div className="section-two-div">
        {user?.origins_list?.[0] && <div className="sub-title-div">
          <h4>App access</h4>
        </div>}
        <div className="section-content">
          {user?.origins_list?.includes('Staff_Admin') && <div className="app-item">
            <div className="icon-div" style={{ backgroundColor: "#4c0c87" }}
              onClick={() => user?._id === admin?.temp_id
                ? navigate('/admin')
                : navigate(`/v1/0auth?temp_id=${user?._id}&location=Staff_Admin&redirect_url=http://staff.alliancewatersolutions.com/admin`)}>
              <MdAdminPanelSettings />
            </div>
            <p>Staff Admin</p>
          </div>}

          {(user?.origins_list?.includes('Accounting')) && <div className="app-item">
            <div className="icon-div" style={{ backgroundColor: "#521f08" }}
              onClick={() => window.location.href = `http://accounting.alliancewatersolutions.com/?id=${user?._id}`}>
              <FaIndianRupeeSign />
            </div>
            <p>Accounting <br></br> App</p>
          </div>}

          {(user?.origins_list?.includes('Sales') || user?.origins_list?.includes('SalesPro')
            || user?.origins_list?.includes('Installation')) && <div className="app-item">
              <div className="icon-div" style={{ backgroundColor: "#0c1663" }}
                onClick={() => window.location.href = `http://sales.alliancewatersolutions.com/?id=${user?._id}`}>
                <FaStore />
              </div>
              <p>Sales App</p>
            </div>}

          {(user?.origins_list?.includes('PR_Service')) && <div className="app-item">
            <div className="icon-div" style={{ backgroundColor: "#52082f" }}
              onClick={() => window.location.href = `http://purifier.alliancewatersolutions.com/?id=${user?._id}`}>
              <MdOutlineMiscellaneousServices />
            </div>
            <p>Purifier Service</p>
          </div>}

          {(user?.origins_list?.includes('PR_Admin')) && <div className="app-item">
            <div className="icon-div" style={{ backgroundColor: "#085212" }}
              onClick={() => window.location.href = `http://purifier.alliancewatersolutions.com/admin/?id=${user?._id}`}>
              <IoLogoAppleAr />
            </div>
            <p>Purifier Admin</p>
          </div>}

          {(user?.origins_list?.includes('ControlNex') || user?.origins_list?.includes('Customer_Info')) &&
            <div className="app-item">
              <div className="icon-div" style={{ backgroundColor: "#046b5f" }}
                onClick={() => window.location.href = `http://controlnex.alliancewatersolutions.com/?id=${user?._id}`}>
                <HiUserGroup />
              </div>
              <p>ControlNex <br></br> App</p>
            </div>}

          {(user?.origins_list?.includes('WH_Service')) && <div className="app-item">
            <div className="icon-div" style={{ backgroundColor: "#4c046b" }}
              onClick={() => window.location.href = `http://wholehouse.alliancewatersolutions.com/?id=${user?._id}`}>
              <MdOutlineMiscellaneousServices />
            </div>
            <p>Whole house <br></br> Service</p>
          </div>}

          {(user?.origins_list?.includes('WH_Admin')) && <div className="app-item">
            <div className="icon-div" style={{ backgroundColor: "#336b04" }}
              onClick={() => window.location.href = `http://wholehouse.alliancewatersolutions.com/admin/?id=${user?._id}`}>
              <IoLogoAppleAr />
            </div>
            <p>Whole house <br></br> Admin</p>
          </div>
          }
        </div>
      </div>
    </div >
  )
}

export default Home