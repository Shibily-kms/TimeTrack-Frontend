import React, { useEffect, useState } from 'react'
import './staff-profile.scss'
import { adminAxios } from '../../../config/axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from '../../../redux/features/user/systemSlice'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import { YYYYMMDDFormat, getTimeFromSecond } from '../../../assets/javascript/date-helper'
import SingleButton from '../../../components/common/buttons/SingleButton'
import { HiPlus } from 'react-icons/hi'
import { FaListCheck } from 'react-icons/fa6'
import RegularWorkCard from '../../../components/user/regular-work-card/RegularWorkCard'
import AddEditRegWork from '../../../components/user/add-edit-work/AddEditRegWork'
import DeleteStaff from '../../../components/admin/models/DeleteStaff'
import Modal from '../../../components/common/modal/Modal'
import Badge from '../../../components/common/badge/Badge'
import { FaCheckCircle } from "react-icons/fa";

const StaffProfile = ({ setPageHead }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { staff_id } = useParams()
  const [data, setData] = useState({})
  const [loading, setLoading] = useState('fetch')
  const [modal, setModal] = useState({ status: false })
  const [regular, setRegular] = useState([])


  const openWorkModal = (title, data) => {
    setModal({
      status: true, content: <AddEditRegWork setModal={setModal} updateData={data} admin={true} staff_id={staff_id}
        setData={setRegular} />, title
    })
  }

  const scrollTo = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };


  useEffect(() => {
    setLoading('fetch')
    adminAxios.get(`/staff/${staff_id}?if_delete=yes`).then((response) => {
      setData(response.data)
      setPageHead({ title: `${response?.data?.sid || ''}_${response.data.first_name} ${response.data.last_name}` })
      setLoading('')

      adminAxios.get(`/regular-work?staff_id=${staff_id}`).then((result) => {
        setRegular(result.data)
      })

    }).catch((error) => {
      dispatch(toast.push.error({ message: error.message }))
      // navigate('/admin?page=dashboard')
      setLoading('')
    })
    //eslint-disable-next-line
  }, [])

  return (
    <div className="staff-profile-page-div">
      <Modal modal={modal} setModal={setModal} />
      <div className="section-one-div">
        <div className="list-details-div" id="title1">
          <h3>Personal Info</h3>
          {loading
            ? <SpinWithMessage load={loading === 'fetch'} fullView />
            : <>
              <div className="list-item-div">
                <span><p>Full name</p></span>
                <span><p>: {data?.first_name} {data?.last_name}</p></span>
              </div>
              <div className="list-item-div">
                <span><p>Date of Birth</p></span>
                <span><p>: {new Date(data?.dob).toDateString()}</p></span>
              </div>
              <div className="list-item-div">
                <span><p>Address</p></span>
                <span><p>: {data?.address?.address}</p></span>
              </div>
              <div className="list-item-div">
                <span><p>Place</p></span>
                <span><p>: {data?.address?.place}</p></span>
              </div>
              <div className="list-item-div">
                <span><p>Post office</p></span>
                <span><p>: {data?.address?.post} - {data?.address?.pin_code}</p></span>
              </div>
              <div className="list-item-div">
                <span><p>District</p></span>
                <span><p>: {data?.address?.district}</p></span>
              </div>
              <div className="list-item-div">
                <span><p>State</p></span>
                <span><p>: {data?.address?.state || 'Kerala'}, India</p></span>
              </div>
              <div className="list-item-div">
                <span><p>Mobile number</p></span>
                <span><p>: {data?.contact1}</p></span>
              </div>
              {data?.contact2 && <div className="list-item-div">
                <span><p></p></span>
                <span><p>: {data?.contact2}</p></span>
              </div>}
              <div className="list-item-div">
                <span><p>Whatsapp</p></span>
                <span><p>: {data?.whatsapp}</p></span>
              </div>
              <div className="list-item-div">
                <span><p>Email ID</p></span>
                <span><p>: {data?.email_id}</p></span>
              </div>
            </>}
        </div>
        <div className="list-details-div" id="title2">
          <div className="title">
            <h3>Professional Info</h3>
          </div>
          {loading
            ? <SpinWithMessage load={loading === 'fetch'} fullView />
            : <>
              <div className="list-item-div">
                <span><p>Current Status</p></span>
                <span>: {data?.delete
                  ? <Badge text={'Left the company'} className={'error-fill'} icon={<FaCheckCircle />} />
                  : <Badge text={'Active'} className={'success-fill'} icon={<FaCheckCircle />} />}
                </span>
              </div>
              {data?.delete && <>
                <div className="list-item-div">
                  <span><p>Left date</p></span>
                  <span><p>: {YYYYMMDDFormat(new Date(data?.deleteReason?.date))}</p></span>
                </div>
                <div className="list-item-div">
                  <span><p>Left reason</p></span>
                  <span><p>: {data?.deleteReason?.reason}</p></span>
                </div>
              </>}
              <div className="list-item-div">
                <span><p>SID</p></span>
                <span><p>: {data?.sid}</p></span>
              </div>
              <div className="list-item-div">
                <span><p>Designation</p></span>
                <span><p>: {data?.designation?.designation}</p></span>
              </div>
              <div className="list-item-div">
                <span><p>Salary</p></span>
                <span><p>: {data?.current_salary} / Month</p></span>
              </div>
              <div className="list-item-div">
                <span><p>Working days</p></span>
                <span><p>: {data?.current_working_days} / Month</p></span>
              </div>
              <div className="list-item-div">
                <span><p>Working time</p></span>
                <span><p>: {getTimeFromSecond(data?.current_working_time) || '0m'} / Day</p></span>
              </div>
              <div className="list-item-div">
                <span><p>C/F</p></span>
                <span><p>: {getTimeFromSecond(data?.balance_CF) || '0m'}</p></span>
              </div>
            </>}
        </div>
        {loading !== 'fetch' && !data?.delete &&
          <div className="reg-work-div" id="title3">
            <div className="title">
              <h3>Regular Works</h3>
              <SingleButton classNames={'sm btn-tertiary'} style={{ fontSize: '11px' }}
                name={'New'} stIcon={<HiPlus />}
                onClick={() => openWorkModal('Add New Work')} />
            </div>
            <div className="content-div">
              {!regular?.[0] ? <SpinWithMessage message='No regular works' height={'200px'} icon={<FaListCheck />} spin={false} />
                // eslint-disable-next-line
                : regular?.map((work) => <RegularWorkCard key={work._id} allWork={true} data={work} setData={setRegular}
                  openWorkModal={openWorkModal} admin={true} />)
              }
            </div>

          </div>}

      </div>
      <div className="section-two-div">
        <div className="section-border">
          <div className="sub-menu-div">
            <h4>Sub menus</h4>
            <ul>
              <li onClick={() => scrollTo('title1')}>Personal Info</li>
              <li onClick={() => scrollTo('title2')}>Professional Info</li>
              {loading !== 'fetch' && !data?.delete && <li onClick={() => scrollTo('title3')}>Regular Works</li>}
            </ul>
          </div>
          {loading !== 'fetch' && !data?.delete &&
            <div className="sub-section-two">
              <SingleButton name={'Add regular work'} classNames={'btn-tertiary'} style={{ width: '100%' }} onClick={() => openWorkModal('Add New Work')} />
              <SingleButton name={'Delete profile'} classNames={'btn-danger'} style={{ width: '100%' }}
                onClick={() => setModal({ status: true, title: 'Delete Profile', content: <DeleteStaff deleteId={data?._id} setData={setData} setModal={setModal} /> })} />
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default StaffProfile