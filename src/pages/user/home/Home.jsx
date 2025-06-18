import React, { useEffect } from 'react'
import './home.scss'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaStore } from "react-icons/fa";
import ProfileCard from '../../../components/user/profile-card/ProfileCard';
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper';
import WorkDetails from '../../../components/user/semi-work-details/WorkDetails';
import TTController from '../../../assets/images/app-icons/TT Controller.jpg'
import Finance from '../../../assets/images/app-icons/Finance.jpg'
import ControlNex from '../../../assets/images/app-icons/ControlNex.jpg'
import PRService from '../../../assets/images/app-icons/Purifier Service.jpg'
import PRAdmin from '../../../assets/images/app-icons/Purifier Admin.jpg'
import Vessel from '../../../assets/images/app-icons/Vessel.jpg'
import VesselAdmin from '../../../assets/images/app-icons/Vessel Admin.jpg'
import Lead from '../../../assets/images/app-icons/SL Lead.jpg'
import Enquiry from '../../../assets/images/app-icons/SL Enquiry.jpg'
import Install from '../../../assets/images/app-icons/SL Install.jpg'
import SLController from '../../../assets/images/app-icons/SL Controller.jpg'
import Warehouse from '../../../assets/images/app-icons/Warehouse.jpg'
import ProfileStatusSemi from '../../../components/user/profile-status/ProfileStatusSemi';
import Alliance from '../../../components/common/icon/Alliance';


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
            <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.gif" alt="🎉" width="60" height="60" />
            <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.webp" type="image/webp" />
          </picture>
          <h4>Happy Birth Day</h4>
          <h2>{user?.first_name} {user?.last_name}!</h2>
          <p></p>
        </div>}
      </div>
      <div className="work-section">
        {user?.profile_status !== 100 && <ProfileStatusSemi />}
        <WorkDetails />
      </div>

      <div className="section-two-div">
        {user?.allowed_origins?.[0] && <div className="sub-title-div">
          <h4>App access</h4>
        </div>}
        <div className="section-content">
          {/* Staff Admin */}
          {user?.allowed_origins?.some((access) => access?.slice(0, 4) === 'ttcr') && (<div className="app-item">
            <div className="icon-div" onClick={() => navigate('/admin')}>
              <span >  <Alliance width={'40px'} hight={'40px'} /> </span>
              <img alt='app-icon' src={TTController} draggable={false} />
            </div>
            <p>TT Controller</p>
          </div>)}

          {(user?.allowed_origins?.includes('Accountant')) && <div className="app-item">
            <div className="icon-div" onClick={() => window.location.href = `http://localhost:3001?id=${user?.acc_id}`}>
              <img alt='app-icon' src={Finance} draggable={false} />
              <span >  <Alliance width={'40px'} hight={'40px'} /> </span>
            </div>
            <p>Finance</p>
          </div>}

          {(user?.allowed_origins?.includes('ControlNex') || user?.allowed_origins?.includes('Customer_Info')) &&
            <div className="app-item">
              <div className="icon-div" onClick={() => window.location.href = `http://localhost:3001?id=${user?.acc_id}`}>
                <img alt='app-icon' src={ControlNex} draggable={false} />
                <span >  <Alliance width={'40px'} hight={'40px'} /> </span>
              </div>
              <p>ControlNex</p>
            </div>}

          {(user?.allowed_origins?.includes('Sales') || user?.allowed_origins?.includes('SalesPro')
            || user?.allowed_origins?.includes('Installation')) && <div className="app-item">
              <div className="icon-div" style={{ backgroundColor: "#0c1663" }}
                onClick={() => window.location.href = `https://sales.alliancewatersolutions.com?id=${user?.acc_id}`}>
                <FaStore />
              </div>
              <p>Sales App</p>
            </div>}


          {(user?.allowed_origins?.includes('PR_Service')) && <div className="app-item">
            <div className="icon-div" onClick={() => window.location.href = `http://localhost:3001?id=${user?.acc_id}`}>
              <img alt='app-icon' src={PRService} draggable={false} />
              <span >  <Alliance width={'40px'} hight={'40px'} /> </span>
            </div>
            <p>PR Service</p>
          </div>}

          {(user?.allowed_origins?.includes('PR_Admin')) && <div className="app-item">
            <div className="icon-div" onClick={() => window.location.href = `http://localhost:3001?id=${user?.acc_id}`}>
              <img alt='app-icon' src={PRAdmin} draggable={false} />
              <span >  <Alliance width={'40px'} hight={'40px'} /> </span>
            </div>
            <p>PR Controller</p>
          </div>}

          {(user?.allowed_origins?.includes('WH_Service')) && <div className="app-item">
            <div className="icon-div" onClick={() => window.location.href = `http://localhost:3001?id=${user?.acc_id}`}>
              <img alt='app-icon' src={Vessel} draggable={false} />
              <span >  <Alliance width={'40px'} hight={'40px'} /> </span>
            </div>
            <p>VS Service</p>
          </div>}

          {(user?.allowed_origins?.includes('WH_Admin')) && <div className="app-item">
            <div className="icon-div" onClick={() => window.location.href = `http://localhost:3001?id=${user?.acc_id}`}>
              <img alt='app-icon' src={VesselAdmin} draggable={false} />
              <span >  <Alliance width={'40px'} hight={'40px'} /> </span>
            </div>
            <p>VS Controller</p>
          </div>}

          {user?.allowed_origins?.some((access) => access?.slice(0, 9) === 'slur_lead') && <div className="app-item">
            <div className="icon-div" onClick={() => window.location.href = `http://localhost:3001/lead?page=home`}>
              <img alt='app-icon' src={Lead} draggable={false} />
              <span >  <Alliance width={'40px'} hight={'40px'} /> </span>
            </div>
            <p>SL Lead</p>
          </div>}

          {user?.allowed_origins?.some((access) => access?.slice(0, 8) === 'slur_eqr') && <div className="app-item">
            <div className="icon-div" onClick={() => window.location.href = `http://localhost:3001/enquiry?page=home`}>
              <img alt='app-icon' src={Enquiry} draggable={false} />
              <span >  <Alliance width={'40px'} hight={'40px'} /> </span>
            </div>
            <p>SL Enquiry</p>
          </div>}

          {user?.allowed_origins?.some((access) => access?.slice(0, 12) === 'slur_install') && <div className="app-item">
            <div className="icon-div" onClick={() => window.location.href = `http://localhost:3001/installation?page=home`}>
              <img alt='app-icon' src={Install} draggable={false} />
              <span >  <Alliance width={'40px'} hight={'40px'} /> </span>
            </div>
            <p>SL Install</p>
          </div>}

          {user?.allowed_origins?.some((access) => access?.slice(0, 9) === 'slur_gdwn') && <div className="app-item">
            <div className="icon-div" onClick={() => window.location.href = `http://localhost:3001/warehouse?page=pending`}>
              <img alt='app-icon' src={Warehouse} draggable={false} />
              <span >  <Alliance width={'40px'} hight={'40px'} /> </span>
            </div>
            <p>SL Warehouse</p>
          </div>}

          {user?.allowed_origins?.some((access) => access?.slice(0, 4) === 'slcr') && <div className="app-item">
            <div className="icon-div" onClick={() => window.location.href = `http://localhost:3001/controller`}>
              <img alt='app-icon' src={SLController} draggable={false} />
              <span >  <Alliance width={'40px'} hight={'40px'} /> </span>
            </div>
            <p>SL Controller</p>
          </div>}

        </div>
      </div>

    </div >
  )
}

export default Home