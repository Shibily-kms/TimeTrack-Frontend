import React, { useEffect } from 'react'
import './home.scss'
import { useNavigate, useSearchParams } from 'react-router-dom';
import {  useSelector } from 'react-redux';
import { BsQrCodeScan } from "react-icons/bs";
import { IoFingerPrint, IoLogoAppleAr } from "react-icons/io5";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import { LuListPlus } from "react-icons/lu";
import { HiUserGroup } from "react-icons/hi2";
import { BiMath } from "react-icons/bi";
import ProfileCard from '../../../components/user/profile-card/ProfileCard';
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper';



function Home({ setPageHead }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useSelector((state) => state.userAuth)
  const navigate = useNavigate()
  const { workDetails } = useSelector((state) => state.workData)

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
        {user.dob === YYYYMMDDFormat(new Date()) && <div className="birth-box">
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
          <div className="big-button">
            <BsQrCodeScan />
            <p>Scanner</p>
          </div>
          <div className="big-button" onClick={() => navigate('/punch-work?page=more')}>
            <IoFingerPrint />
            <p>Punch to Work</p>
          </div>
          <div className="big-button" onClick={() => navigate('/enter-today?page=more')}>
            <LuListPlus />
            <p>Enter today</p>
          </div>
        </div>
      </div>

      <div className="section-two-div">
        <div className="sub-title-div">
          <h4>App access</h4>
        </div>
        <div className="section-content">
          {(user?.designation?.allow_origins?.includes('Sales') || user?.designation?.allow_origins?.includes('SalesPro')
            || user?.designation?.allow_origins?.includes('Installation')) && <div className="app-item">
              <div className="icon-div" style={{ backgroundColor: "#0c1663" }}
                onClick={() => window.location.href = `http://localhost:3001?id=${user?._id}`}>
                <IoLogoAppleAr />
              </div>
              <p>Sales App</p>
            </div>}

          {(user?.designation?.allow_origins?.includes('Accountant')) && <div className="app-item">
            <div className="icon-div" style={{ backgroundColor: "#521f08" }}
              onClick={() => window.location.href = `http://localhost:3001?id=${user?._id}`}>
              <BiMath />
            </div>
            <p>Accounting <br></br> App</p>
          </div>}

          {(user?.designation?.allow_origins?.includes('PR_Service')) && <div className="app-item">
            <div className="icon-div" style={{ backgroundColor: "#52082f" }}
              onClick={() => window.location.href = `http://localhost:3001?id=${user?._id}`}>
              <MdOutlineMiscellaneousServices />
            </div>
            <p>Purifier Service</p>
          </div>}

          {(user?.designation?.allow_origins?.includes('PR_Admin')) && <div className="app-item">
            <div className="icon-div" style={{ backgroundColor: "#085212" }}
              onClick={() => window.location.href = `http://localhost:3001?id=${user?._id}`}>
              <IoLogoAppleAr />
            </div>
            <p>Purifier Admin</p>
          </div>}

          {(user?.designation?.allow_origins?.includes('ControlNex') || user?.designation?.allow_origins?.includes('Customer_Info')) &&
            <div className="app-item">
              <div className="icon-div" style={{ backgroundColor: "#046b5f" }}
                onClick={() => window.location.href = `http://localhost:3001?id=${user?._id}`}>
                <HiUserGroup />
              </div>
              <p>ControlNex <br></br> App</p>
            </div>}

          {(user?.designation?.allow_origins?.includes('WH_Service')) && <div className="app-item">
            <div className="icon-div" style={{ backgroundColor: "#4c046b" }}
              onClick={() => window.location.href = `http://localhost:3001?id=${user?._id}`}>
              <MdOutlineMiscellaneousServices />
            </div>
            <p>Whole house <br></br> Service</p>
          </div>}

          {(user?.designation?.allow_origins?.includes('WH_Admin')) && <div className="app-item">
            <div className="icon-div" style={{ backgroundColor: "#336b04" }}
              onClick={() => window.location.href = `http://localhost:3001?id=${user?._id}`}>
              <IoLogoAppleAr />
            </div>
            <p>Whole house <br></br> Admin</p>
          </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Home