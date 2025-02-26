import React, { useEffect } from 'react'
import './home.scss'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IoLogoAppleAr } from "react-icons/io5";
import { MdOutlineMiscellaneousServices, MdAdminPanelSettings } from "react-icons/md";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { FaStore } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi2";
import ProfileCard from '../../../components/user/profile-card/ProfileCard';
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper';
import WorkDetails from '../../../components/user/semi-work-details/WorkDetails';
import { PiGraphFill } from 'react-icons/pi';
import { TbDropletSearch } from 'react-icons/tb';
import { GrInstall } from 'react-icons/gr';


function Home({ setPageHead }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useSelector((state) => state.userAuth)
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
        {user?.dob?.slice(5) === YYYYMMDDFormat(new Date())?.slice(5) && <div className="birth-box">
          <picture>
            <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.webp" type="image/webp" />
            <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.gif" alt="🎉" width="60" height="60" />
          </picture>
          <h4>Happy Birth Day</h4>
          <h2>{user?.first_name} {user?.last_name}!</h2>
          <p></p>
        </div>}
      </div>
      <div className="work-section">
        <WorkDetails />
      </div>

      <div className="section-two-div">
        {user?.allowed_origins?.[0] && <div className="sub-title-div">
          <h4>App access</h4>
        </div>}
        <div className="section-content">
          {/* Staff Admin */}
          {user?.allowed_origins?.some((access) => access?.slice(0, 4) === 'ttcr') && (<div className="app-item">
            <div className="icon-div" style={{ backgroundColor: "#4c0c87" }}
              onClick={() => navigate('/admin')}>
              <MdAdminPanelSettings />
            </div>
            <p>TT Controller</p>
          </div>)}

          {(user?.allowed_origins?.includes('Accountant')) && <div className="app-item">
            <div className="icon-div" style={{ backgroundColor: "#521f08" }}
              onClick={() => window.location.href = `http://localhost:3001?id=${user?.acc_id}`}>
              <FaIndianRupeeSign />
            </div>
            <p>Accounting <br></br> App</p>
          </div>}

          {(user?.allowed_origins?.includes('Sales') || user?.allowed_origins?.includes('SalesPro')
            || user?.allowed_origins?.includes('Installation')) && <div className="app-item">
              <div className="icon-div" style={{ backgroundColor: "#0c1663" }}
                onClick={() => window.location.href = `http://localhost:3001?id=${user?.acc_id}`}>
                <FaStore />
              </div>
              <p>Sales App</p>
            </div>}

          {(user?.allowed_origins?.includes('PR_Service')) && <div className="app-item">
            <div className="icon-div" style={{ backgroundColor: "#52082f" }}
              onClick={() => window.location.href = `http://localhost:3001?id=${user?.acc_id}`}>
              <MdOutlineMiscellaneousServices />
            </div>
            <p>Purifier Service</p>
          </div>}

          {(user?.allowed_origins?.includes('PR_Admin')) && <div className="app-item">
            <div className="icon-div" style={{ backgroundColor: "#085212" }}
              onClick={() => window.location.href = `http://localhost:3001?id=${user?.acc_id}`}>
              <IoLogoAppleAr />
            </div>
            <p>Purifier Admin</p>
          </div>}

          {(user?.allowed_origins?.includes('ControlNex') || user?.allowed_origins?.includes('Customer_Info')) &&
            <div className="app-item">
              <div className="icon-div" style={{ backgroundColor: "#046b5f" }}
                onClick={() => window.location.href = `http://localhost:3001?id=${user?.acc_id}`}>
                <HiUserGroup />
              </div>
              <p>ControlNex <br></br> App</p>
            </div>}

          {(user?.allowed_origins?.includes('WH_Service')) && <div className="app-item">
            <div className="icon-div" style={{ backgroundColor: "#4c046b" }}
              onClick={() => window.location.href = `http://localhost:3001?id=${user?.acc_id}`}>
              <MdOutlineMiscellaneousServices />
            </div>
            <p>Whole house <br></br> Service</p>
          </div>}

          {(user?.allowed_origins?.includes('WH_Admin')) && <div className="app-item">
            <div className="icon-div" style={{ backgroundColor: "#336b04" }}
              onClick={() => window.location.href = `http://localhost:3001?id=${user?.acc_id}`}>
              <IoLogoAppleAr />
            </div>
            <p>Whole house <br></br> Admin</p>
          </div>}

          {user?.allowed_origins?.some((access) => access?.slice(0, 9) === 'slur_lead') && <div className="app-item">
            <div className="icon-div" style={{ backgroundColor: "#960c84" }}
              onClick={() => window.location.href = `http://localhost:3001/lead?page=home`}>
              <PiGraphFill />
            </div>
            <p>SL Lead</p>
          </div>}

          {user?.allowed_origins?.some((access) => access?.slice(0, 8) === 'slur_eqr') && <div className="app-item">
            <div className="icon-div" style={{ backgroundColor: "#2b6dd6" }}
              onClick={() => window.location.href = `http://localhost:3001/enquiry?page=home`}>
              <TbDropletSearch />
            </div>
            <p>SL Enquiry</p>
          </div>}

          {user?.allowed_origins?.some((access) => access?.slice(0, 4) === 'slcr') && <div className="app-item">
            <div className="icon-div" style={{ backgroundColor: "#fc9700" }}
              onClick={() => window.location.href = `http://localhost:3001/controller`}>
              <IoLogoAppleAr />
            </div>
            <p>SL Controller</p>
          </div>}

          {user?.allowed_origins?.some((access) => access?.slice(0, 12) === 'slur_install') && <div className="app-item">
            <div className="icon-div" style={{ backgroundColor: "#154c79" }}
              onClick={() => window.location.href = `http://localhost:3001/installation?page=home`}>
              <GrInstall />
            </div>
            <p>SL Install</p>
          </div>}
        </div>
      </div>
    </div >
  )
}

export default Home