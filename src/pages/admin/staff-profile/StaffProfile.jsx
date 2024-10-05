import React, { useEffect, useState } from 'react'
import './staff-profile.scss'
import { workerAxios } from '../../../config/axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from '../../../redux/features/user/systemSlice'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import { getTimeFromSecond } from '../../../assets/javascript/date-helper'
import SingleButton from '../../../components/common/buttons/SingleButton'
import { HiPlus } from 'react-icons/hi'
import { FaListCheck } from 'react-icons/fa6'
import RegularWorkCard from '../../../components/user/todo-item/RegularWorkCard'
import AddEditTodo from '../../../components/user/add-edit-todo/AddEditTodo'
import DeleteStaff from '../../../components/admin/models/DeleteStaff'
import Modal from '../../../components/common/modal/Modal'
import Badge from '../../../components/common/badge/Badge'
import { FaCheckCircle } from "react-icons/fa";
import { findAgeFromDate } from '../../../assets/javascript/find-helpers'
import { BiSolidErrorCircle } from 'react-icons/bi'
import { RiVerifiedBadgeFill } from 'react-icons/ri'
import EditStaff from '../../../components/admin/edit-staff/EditStaff'

const StaffProfile = ({ setPageHead }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { staff_id } = useParams()
  const [data, setData] = useState({})
  const [loading, setLoading] = useState('fetch')
  const [modal, setModal] = useState({ status: false })
  const [regular, setRegular] = useState([])
  const { user } = useSelector((state) => state.userAuth)


  const openWorkModal = (title, data) => {
    setModal({
      status: true, content: <AddEditTodo setModal={setModal} updateData={data} admin={true} staff_id={staff_id}
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
    workerAxios.get(`/account/${staff_id}?profession=yes`).then((response) => {
      setData(response.data)
      setPageHead({ title: `${response.data.first_name} ${response.data.last_name}` })
      setLoading('')

      // adminAxios.get(`/regular-work?staff_id=${staff_id}`).then((result) => {
      //   setRegular(result.data)
      // })

    }).catch((error) => {
      dispatch(toast.push.error({ message: error?.message }))
      navigate('/admin/staff-list')
      setLoading('')
    })
    //eslint-disable-next-line
  }, [])

  return (
    <div className="staff-profile-page-div">
      <Modal modal={modal} setModal={setModal} />
      <div className="section-one-div">
        {/* Personal info */}
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
                <span><p>: {new Date(data?.dob).toDateString()} {data?.dob && `(${findAgeFromDate(data?.dob)} age)`}</p></span>
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
                <span><p>: {data?.address?.state}, {data?.address?.country}</p></span>
              </div>
              <div className="list-item-div">
                <span><p>Email ID</p></span>
                <span><p>: {data?.email_address?.mail}</p></span>
              </div>
            </>}
        </div>
        {/* Mobile numbers */}
        <div className="list-details-div" id="title2">
          <h3>Mobile numbers</h3>
          {loading
            ? <SpinWithMessage load={loading === 'fetch'} fullView />
            : <>
              <div className="list-item-div">
                <span><p>Primary number</p></span>
                <span>
                  <p>: {data?.primary_number?.country_code} {data?.primary_number?.number}
                    {data?.primary_number?.verified
                      ? <small className='verify ok'><RiVerifiedBadgeFill /> Verified</small>
                      : <small className='verify not-ok'><BiSolidErrorCircle /> Unverified</small>}  </p>
                </span>
              </div>
              {data?.secondary_number?.number && <div className="list-item-div">
                <span><p>Secondary number</p></span>
                <span>
                  <p>: {data?.secondary_number?.country_code} {data?.secondary_number?.number}
                    {data?.secondary_number?.verified
                      ? <small className='verify ok'><RiVerifiedBadgeFill /> Verified</small>
                      : <small className='verify not-ok'><BiSolidErrorCircle /> Unverified</small>}  </p>
                </span>
              </div>}
              {data?.official_number?.number && <div className="list-item-div">
                <span><p>Official number</p></span>
                <span>
                  <p>: {data?.official_number?.country_code} {data?.official_number?.number}
                    {data?.official_number?.verified
                      ? <small className='verify ok'><RiVerifiedBadgeFill /> Verified</small>
                      : <small className='verify not-ok'><BiSolidErrorCircle /> Unverified</small>}  </p>
                </span>
              </div>}
              {data?.whatsapp_number?.number && <div className="list-item-div">
                <span><p>Whatsapp number</p></span>
                <span>
                  <p>: {data?.whatsapp_number?.country_code} {data?.whatsapp_number?.number}
                    {data?.whatsapp_number?.verified
                      ? <small className='verify ok'><RiVerifiedBadgeFill /> Verified</small>
                      : <small className='verify not-ok'><BiSolidErrorCircle /> Unverified</small>}  </p>
                </span>
              </div>}
            </>}
        </div>
        {/* Professional */}
        <div className="list-details-div" id="title3">
          <div className="title">
            <h3>Professional Info</h3>
          </div>
          {loading
            ? <SpinWithMessage load={loading === 'fetch'} fullView />
            : <>
              <div className="list-item-div">
                <span><p>Current Status</p></span>
                <span>: {data?.delete
                  ? <Badge text={'Resign'} className={'error-fill'} icon={<FaCheckCircle />} />
                  : <Badge text={'Active'} className={'success-fill'} icon={<FaCheckCircle />} />}
                </span>
              </div>
              {data?.delete && <>
                <div className="list-item-div">
                  <span><p>Resign date</p></span>
                  <span><p>: {new Date(data?.resign_date)?.toDateString()}</p></span>
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
                <span><p>Join Date</p></span>
                <span><p>: {new Date(data?.join_date)?.toDateString()}</p></span>
              </div>
              <div className="list-item-div">
                <span><p>Designation</p></span>
                <span><p>: {data?.designation}</p></span>
              </div>
              <div className="list-item-div">
                <span><p>Work mode</p></span>
                <span><p>: {data?.work_mode}</p></span>
              </div>
              <div className="list-item-div">
                <span><p>Employee type</p></span>
                <span><p>: {data?.e_type}</p></span>
              </div>
              <div className="list-item-div">
                <span><p>Salary</p></span>
                <span><p>: ₹{data?.current_salary} / Month</p></span>
              </div>
              <div className="list-item-div">
                <span><p>Working days</p></span>
                <span><p>: {data?.current_working_days} Days / Month</p></span>
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

        {/* Regular work */}
        {loading !== 'fetch' && !data?.delete && user?.allowed_origins?.includes('ttcr_stfAcc_write') &&
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
              <li onClick={() => scrollTo('title2')}>Mobile numbers</li>
              <li onClick={() => scrollTo('title3')}>Professional Info</li>
              {loading !== 'fetch' && !data?.delete && user?.allowed_origins?.includes('ttcr_stfAcc_write') &&
                <li onClick={() => scrollTo('title3')}>Regular Works</li>}
            </ul>
          </div>
          {loading !== 'fetch' && user?.allowed_origins?.includes('ttcr_stfAcc_write') &&
            <div className="sub-section-two">
              <SingleButton name={'Update details'} classNames={'btn-tertiary'} style={{ width: '100%' }} onClick={() => setModal({
                status: true,
                title: 'Update details',
                content: <EditStaff data={data} setData={setData} setModal={setModal} />,
                width: '600px'
              })} />
              {!data?.delete && <SingleButton name={'Add regular work'} classNames={'btn-tertiary'} style={{ width: '100%' }
              } onClick={() => openWorkModal('Add New Work')} />}
              {!data?.delete && <SingleButton name={'Settings'} classNames={'btn-tertiary'} style={{ width: '100%' }}
                onClick={() => navigate(`/admin/staff-list/${staff_id}/settings`)} />}
              {!data?.delete && <SingleButton name={'Delete profile'} classNames={'btn-danger'} style={{ width: '100%' }}
                onClick={() => setModal({
                  status: true, title: 'Delete Profile', content: <DeleteStaff deleteId={data?._id} setData={setData} setModal={setModal} />
                })} />}
            </div>
          }
        </div>
      </div>
    </div >
  )
}

export default StaffProfile