import React, { useEffect, useState } from 'react'
import { adminAxios } from '../../../config/axios'
import SpinWithMessage from '../../common/spinners/SpinWithMessage'
import { MdOutlineFingerprint } from 'react-icons/md'
import ProfileCard from './ProfileCard'
import Badge from '../../common/badge/Badge'

const AllStaffModal = ({ setModal }) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  useEffect(() => {
    adminAxios.get('/report/staff-current-status').then((response) => {
      setData(response?.data)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
      setModal({ status: false })
    })
  }, [])

  return (
    <div className="all-staff-modal-div" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {loading || !data?.[0]
        ? <SpinWithMessage load={loading} height={'200px'} icon={<MdOutlineFingerprint />} message='All are no-punches' />
        : <>
          {data?.map((staff, index) => {
            return <ProfileCard
              key={index}
              full_name={`${staff?.first_name} ${staff?.last_name}`}
              description={staff?.designation}
              rightContent={<Badge text={staff?.status} className={
                staff?.status === 'IN'
                  ? 'success-fill'
                  : (staff?.status === 'OUT' || staff?.status === 'LEAVE')
                    ? 'error-fill'
                    : 'warning-fill'
              } />}
            />
          })}
        </>}
    </div>
  )
}

export default AllStaffModal