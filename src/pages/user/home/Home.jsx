import React, { useEffect, useMemo } from 'react'
import './home.scss'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaStore } from "react-icons/fa";
import { IoInformationCircleOutline, IoWarningOutline } from 'react-icons/io5';
import ProfileCard from '../../../components/user/profile-card/ProfileCard';
import WorkDetails from '../../../components/user/semi-work-details/WorkDetails';
import TTController from '../../../assets/images/app-icons/TT Controller.jpg'
import Finance from '../../../assets/images/app-icons/Finance.jpg'
import ControlNex from '../../../assets/images/app-icons/ControlNex.jpg'
import PRService from '../../../assets/images/app-icons/Purifier Service.jpg'
import PRAdmin from '../../../assets/images/app-icons/Purifier Admin.jpg'
import Vessel from '../../../assets/images/app-icons/Vessel.jpg'
import VesselAdmin from '../../../assets/images/app-icons/Vessel Admin.jpg'
import Service from '../../../assets/images/app-icons/Service.jpg'
import ServiceAdmin from '../../../assets/images/app-icons/Service Admin.jpg'
import Lead from '../../../assets/images/app-icons/SL Lead.jpg'
import Enquiry from '../../../assets/images/app-icons/SL Enquiry.jpg'
import Install from '../../../assets/images/app-icons/SL Install.jpg'
import SLController from '../../../assets/images/app-icons/SL Controller.jpg'
import Warehouse from '../../../assets/images/app-icons/Warehouse.jpg'
import ProfileStatusSemi from '../../../components/user/profile-status/ProfileStatusSemi';
import Alliance from '../../../components/common/icon/Alliance';
import { TbCarouselHorizontal, TbCheck } from 'react-icons/tb';


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




  const autoPunchNotice = useMemo(() => {
    const now = new Date();
    const todayNum = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();

    if (todayNum < 20261129) {
      return {
        variant: 'warning',
        title: 'Auto Punch-Out Notice',
        message: 'The auto punch-out feature will work only up to 30 Nov.',
      };
    }

    if (todayNum === 20261129) {
      return {
        variant: 'warning',
        title: 'Auto Punch-Out Ending Tomorrow',
        message: 'The auto punch-out feature ends tomorrow (30 Nov).',
      };
    }

    if (todayNum === 20261130) {
      return {
        variant: 'warning',
        title: 'Auto Punch-Out Ends Today',
        message: 'The auto punch-out feature ends today (30 Nov). From tomorrow, you will need to punch out manually.',
      };
    }

    return {
      variant: 'info',
      title: 'Manual Punch-Out Required',
      message: 'You must punch out today. If you do not close your work, your working time cannot be added to your report.',
    };
  }, []);

  return (
    <div className='home-page'>
      <div className="profile-section">
        <ProfileCard />
      </div>
      <div className="work-section">
        <WorkDetails />
        <div className={`auto-punch-notice ${autoPunchNotice.variant}`} role="status">
          <span className="notice-icon">
            {autoPunchNotice.variant === 'warning' ? <IoWarningOutline /> : <IoInformationCircleOutline />}
          </span>
          <div className="notice-content">
            <span className="notice-title">{autoPunchNotice.title}</span>
            <p className="notice-message">{autoPunchNotice.message}</p>
          </div>
        </div>
        
        {user?.profile_status !== 100 && <ProfileStatusSemi />}
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
            <div className="icon-div" onClick={() => window.location.href = `https://accounting.alliancewatersolutions.com?id=${user?.acc_id}`}>
              <img alt='app-icon' src={Finance} draggable={false} />
              <span >  <Alliance width={'40px'} hight={'40px'} /> </span>
            </div>
            <p>Finance</p>
          </div>}

          {(user?.allowed_origins?.includes('ControlNex') || user?.allowed_origins?.includes('Customer_Info')) &&
            <div className="app-item">
              <div className="icon-div" onClick={() => window.location.href = `https://controlnex.alliancewatersolutions.com?id=${user?.acc_id}`}>
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

          {(user?.allowed_origins?.includes('PR_Admin')) && <div className="app-item">
            <div className="icon-div" onClick={() => window.location.href = `https://purifier.alliancewatersolutions.com/admin?id=${user?.acc_id}`}>
              <img alt='app-icon' src={PRAdmin} draggable={false} />
              <span >  <Alliance width={'40px'} hight={'40px'} /> </span>
            </div>
            <p>PR Controller</p>
          </div>}


          {user?.allowed_origins?.some((access) => access?.slice(0, 9) === 'slur_lead') && <div className="app-item">
            <div className="icon-div" onClick={() => window.location.href = `https://salesV1.alliancewatersolutions.com/lead?page=home`}>
              <img alt='app-icon' src={Lead} draggable={false} />
              <span >  <Alliance width={'40px'} hight={'40px'} /> </span>
            </div>
            <p>SL Lead</p>
          </div>}

          {user?.allowed_origins?.some((access) => access?.slice(0, 8) === 'slur_eqr') && <div className="app-item">
            <div className="icon-div" onClick={() => window.location.href = `https://salesV1.alliancewatersolutions.com/enquiry?page=home`}>
              <img alt='app-icon' src={Enquiry} draggable={false} />
              <span >  <Alliance width={'40px'} hight={'40px'} /> </span>
            </div>
            <p>SL Enquiry</p>
          </div>}

          {user?.allowed_origins?.some((access) => access?.slice(0, 12) === 'slur_install') && <div className="app-item">
            <div className="icon-div" onClick={() => window.location.href = `https://salesV1.alliancewatersolutions.com/installation?page=home`}>
              <img alt='app-icon' src={Install} draggable={false} />
              <span >  <Alliance width={'40px'} hight={'40px'} /> </span>
            </div>
            <p>SL Install</p>
          </div>}

          {user?.allowed_origins?.some((access) => access?.slice(0, 9) === 'slur_gdwn') && <div className="app-item">
            <div className="icon-div" onClick={() => window.location.href = `https://salesV1.alliancewatersolutions.com/warehouse?page=pending`}>
              <img alt='app-icon' src={Warehouse} draggable={false} />
              <span >  <Alliance width={'40px'} hight={'40px'} /> </span>
            </div>
            <p>SL Warehouse</p>
          </div>}

          {user?.allowed_origins?.some((access) => access?.slice(0, 4) === 'slcr') && <div className="app-item">
            <div className="icon-div" onClick={() => window.location.href = `https://salesV1.alliancewatersolutions.com/controller`}>
              <img alt='app-icon' src={SLController} draggable={false} />
              <span >  <Alliance width={'40px'} hight={'40px'} /> </span>
            </div>
            <p>SL Controller</p>
          </div>}

          {(user?.allowed_origins?.includes('service_t_write')) && <div className="app-item">
            <div className="icon-div" onClick={() => window.location.href = `https://service.alliancewatersolutions.com/tech`}>
              <img alt='app-icon' src={Service} draggable={false} />
              <span >  <Alliance width={'40px'} hight={'40px'} /> </span>
            </div>
            <p>Service App</p>
          </div>}

          {user?.allowed_origins?.some((access) => access?.slice(0, 9) === 'service_c') && <div className="app-item">
            <div className="icon-div" onClick={() => window.location.href = `https://service.alliancewatersolutions.com/controller/home`}>
              <img alt='app-icon' src={ServiceAdmin} draggable={false} />
              <span >  <Alliance width={'40px'} hight={'40px'} /> </span>
            </div>
            <p>Service <br></br> Controller</p>
          </div>}

        </div>
      </div>

    </div >
  )
}

export default Home