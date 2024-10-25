import React, { useEffect, useState } from 'react'
import './work-analyze.scss'
import NormalInput from '../../../components/common/inputs/NormalInput'
import SelectInput from '../../../components/common/inputs/SelectInput'
import StaffBasie from './StaffBasie'
import DateBasie from './DateBasie'
import { ttCv2Axios } from '../../../config/axios'
import { useSearchParams } from 'react-router-dom'
import { setAdminActivePage, toast } from '../../../redux/features/user/systemSlice'
import { useDispatch } from 'react-redux'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'

const WorkAnalyze = ({ setPageHead }) => {

  const dispatch = useDispatch()
  const [loading, setLoading] = useState('fetch')
  const [staffs, setStaffs] = useState([])
  const [data, setData] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [leaveData, setLeaveData] = useState({})

  const fetchData = () => {

    setLoading('fetch')

    // queries
    const formDate = searchParams.get('month') + '-01'
    const endDate = searchParams.get('month') + '-31'
    const searchType = searchParams.get('staff') === 'all' ? 'date-basie' : 'staff-basie'
    const singleStaffId = searchParams.get('staff') !== 'all' ? searchParams.get('staff') : ''

    Promise.all([
      ttCv2Axios.get(`/work/report/punch?from_date=${formDate}&to_date=${endDate}&type=${searchType}&staff_id=${singleStaffId}`),
      ttCv2Axios.get(`/L2/report/daily-leaves?from_date=${formDate}&to_date=${endDate}&tracker=Yes`)
    ]).then(([workRes, leaveRes]) => {
      setData(workRes?.data || [])
      setLeaveData(leaveRes?.data || {})
      setLoading('')

    }).catch(() => {
      setLoading('')
      dispatch(toast.push.error('Unknown error, Try again!'))
    })

  }

  const handleChange = (e) => {
    setSearchParams({
      month: searchParams.get('month'),
      staff: searchParams.get('staff'),
      [e.target.name]: e.target.value
    });
  }


  useEffect(() => {
    fetchData()
    // eslint-disable-next-line
  }, [searchParams])



  useEffect(() => {
    setPageHead({ title: 'Work Analyze' })
    dispatch(setAdminActivePage('work-analyze'))

    ttCv2Axios.get('/worker/account/list?all=yes').then((response) => {
      const list = response.data?.map((person) => ({
        ...person,
        option: `${person?.full_name} ${person?.delete ? '(Removed)' : ''}`,
        value: person._id,
        selected: person._id === searchParams.get('staff')
      }))
      setStaffs(list)
      fetchData()
    })

    // eslint-disable-next-line
  }, [])


  return (
    <div className="work-analyze-page-div">
      <div className="find-form-div">
        <form action="" >
          <NormalInput label='Month' name='month' value={searchParams.get('month')} type='month' min={'2023-08'} onChangeFun={handleChange}
            max={`${new Date().getFullYear()}-${('0' + (new Date().getMonth() + 1)).slice(-2)}`} />
          <SelectInput label='Staff' name='staff' firstOption={{ option: 'All', value: 'all' }}
            values={staffs} onChangeFun={handleChange} />
        </form>
      </div>
      <div className="analyze-content-div">
        {loading ? <SpinWithMessage load height={'400px'} />
          : searchParams.get('staff') === 'all'
            ? <DateBasie dateBaseList={data} leaveList={leaveData} staffs={staffs} />
            : <StaffBasie staffBaseList={data?.[0]} leaveList={leaveData}
              aboutStaff={staffs.filter((staff) => staff._id === searchParams.get('staff'))?.[0] || {}} />
        }

      </div>
    </div>
  )
}

export default WorkAnalyze  