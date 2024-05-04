import React, { useEffect, useState } from 'react'
import './work-analyze.scss'
import NormalInput from '../../../components/common/inputs/NormalInput'
import SingleButton from '../../../components/common/buttons/SingleButton'
import SelectInput from '../../../components/common/inputs/SelectInput'
import StaffBasie from './StaffBasie'
import DateBasie from './DateBasie'
import { ImSearch } from "react-icons/im";
import { adminAxios } from '../../../config/axios'
import { useSearchParams } from 'react-router-dom'
import { toast } from '../../../redux/features/user/systemSlice'
import { useDispatch } from 'react-redux'
import { analyzeDateHelper, analyzeStaffHelper, analyzeStaffMonthReport } from '../../../assets/javascript/work-helper'

const WorkAnalyze = ({ setPageHead }) => {

  const dispatch = useDispatch()
  const [loading, setLoading] = useState('fetch')
  const [staffs, setStaffs] = useState([])
  const [dateAlzList, setDateAlzList] = useState([])
  const [staffAlzList, setStaffAlzList] = useState([])
  const [monthReport, setMonthReport] = useState({})
  const [selectDay, setSelectDay] = useState({})
  const [searchParams, setSearchParams] = useSearchParams()

  const fetchData = (staffList) => {
    const listOfStaff = staffs?.[0] ? staffs : staffList
    setLoading('fetch')
    adminAxios.get(`/analyze/staff-work-data?from_date=${searchParams.get('month') + '-01'}&to_date=${searchParams.get('month') + '-31'}
    &type=${searchParams.get('staff') === 'all' ? 'date-basie' : 'staff-basie'}&staff_id=${searchParams.get('staff') !== 'all' ? searchParams.get('staff') : ''}`)
      .then(async (response) => {

        if (searchParams.get('staff') === 'all' || !searchParams.get('staff')) {
          // Date basie
          const analyzedData = analyzeDateHelper(
            response?.data,
            listOfStaff,
            new Date(searchParams.get('month') + '-01'),
            new Date(new Date(searchParams.get('month') + '-01').getFullYear(), new Date(searchParams.get('month') + '-01').getMonth() + 1, 0, 23)
          )
          setDateAlzList(analyzedData)
          setStaffAlzList([])
          setSelectDay({
            date: analyzedData[0]?.date,
            month: analyzedData[0]?.month,
            year: analyzedData[0]?.year,
            count: analyzedData[0]?.attendanceCount
          })
          setLoading('')

        } else {

          // Staff Basie
          // Check this month report or not
          const thisMonth = new Date(searchParams.get('month') + '-01')?.getFullYear() === new Date().getFullYear()
            && new Date(searchParams.get('month') + '-01')?.getMonth() === new Date().getMonth()

          // If not this month then collect generated salary report
          let staffMSR = null
          if (!thisMonth) {
            try {
              await adminAxios.get(`/analyze/work-report/single?month=${searchParams.get('month')}&staff_id=${searchParams.get('staff')}`).then((result) => {
                staffMSR = result?.data || null
              })
            } catch (error) {
              
            }
          }

          // Data convert to table system
          const thisStaff = listOfStaff.filter((staff) => staff._id === searchParams.get('staff'))
          const analyzeData = analyzeStaffHelper(
            response?.data,
            thisStaff?.[0],
            new Date(searchParams.get('month') + '-01'),
            new Date(new Date(searchParams.get('month') + '-01').getFullYear(), new Date(searchParams.get('month') + '-01').getMonth() + 1, 0)
          )

          const monthAttendanceReport = analyzeStaffMonthReport(thisMonth, thisStaff?.[0] || {}, staffMSR, analyzeData)
          setMonthReport(monthAttendanceReport)

          setDateAlzList([])
          setStaffAlzList(analyzeData)
          setLoading('')

        }
      }).catch((error) => {
        setLoading('')
        dispatch(toast.push.error(error?.message || 'Error found, Try again!'))
      })
  }

  const handleChange = (e) => {
    setSearchParams({
      month: searchParams.get('month'),
      staff: searchParams.get('staff'),
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData()
  }

  useEffect(() => {
    setPageHead({ title: 'Work Analyze' })

    adminAxios.get('/staff/all-list?all=yes').then((response) => {
      const list = response.data?.map((person) => ({
        ...person,
        option: `${person?.full_name} ${person?.delete ? '(Removed)' : ''}`,
        value: person._id,
        selected: person._id === searchParams.get('staff')
      }))
      setStaffs(list)
      fetchData(list)
    })

  }, [])


  return (
    <div className="work-analyze-page-div">
      <div className="find-form-div">
        <form action="" onSubmit={handleSubmit}>
          <NormalInput label='Month' name='month' value={searchParams.get('month')} type='month' min={'2023-08'} onChangeFun={handleChange}
            max={`${new Date().getFullYear()}-${('0' + (new Date().getMonth() + 1)).slice(-2)}`} />
          <SelectInput label='Staff' name='staff' firstOption={{ option: 'All', value: 'all' }}
            values={staffs} onChangeFun={handleChange} />
          <SingleButton name={'Find'} classNames={'xl btn-tertiary'} stIcon={<ImSearch />} style={{ width: '100%' }}
            loading={loading === 'fetch'} />
        </form>
      </div>
      <div className="analyze-content-div">
        {loading ? <>loading</>
          : dateAlzList?.[0]
            ? <DateBasie dateAlzList={dateAlzList} selectDay={selectDay} setSelectDay={setSelectDay} />
            : <StaffBasie staffAlzList={staffAlzList} monthReport={monthReport} />
        }

      </div>
    </div>
  )
}

export default WorkAnalyze  