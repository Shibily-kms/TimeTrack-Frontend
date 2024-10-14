import React, { useEffect, useState } from 'react'
import './work-report.scss'
import WorkReportTable from '../../../components/admin/work-report/WorkReportTable'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import SCReport from '../../../components/admin/work-report/SCReport'
import { ttCv2Axios } from '../../../config/axios'
import { workReportHelper, salaryReportYearBaseHelper } from '../../../assets/javascript/work-helper'
import { BsDatabaseFillExclamation } from 'react-icons/bs'
import { setAdminActivePage, toast } from '../../../redux/features/user/systemSlice'
import NormalInput from '../../../components/common/inputs/NormalInput'
import SelectInput from '../../../components/common/inputs/SelectInput'
import { useDispatch } from 'react-redux'

function WorkReport({ setPageHead }) {
    const [data, setData] = useState([])
    const [form, setForm] = useState({
        year: `${new Date().getFullYear()}`,
        staff_id: '',
        date: `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`
    })
    const [thisMonth, setThisMonth] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();
    const [staffList, setStaffList] = useState([])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        setPageHead({ title: "Salary Reports" })
        dispatch(setAdminActivePage('salary-reports'))

        // eslint-disable-next-line
    }, [])

    useEffect(() => {

        // all staff list
        let allStaffs = []

        if (!staffList?.[0]) {
            ttCv2Axios.get('/worker/account/list?all=yes').then((response) => {
                setStaffList(response.data)
                allStaffs = response.data
            })
        }

        if (form?.staff_id && form?.year?.length === 4 && (form?.year < 2023 || form?.year > new Date().getFullYear())) {
            dispatch(toast.push.error({ message: 'Choose valid year' }))
            return
        }

        // Year base
        if (form?.staff_id && form?.year?.length === 4) {
            setLoading(true)
            ttCv2Axios.get(`/work/report/salary?year=${form?.year}&staff_id=${form?.staff_id}`).then((response) => {
                const report = salaryReportYearBaseHelper(response.data, form?.year)
                setData(report)
                setLoading(false)

            }).catch((error) => {
                dispatch(toast.push.error({ message: error.message }))
                setLoading(false)
            })
        }

        // Staff base
        if (!form?.staff_id) {
            setLoading(true)
            ttCv2Axios.get(`/work/report/salary?date=${form?.date}`).then((response) => {
                const report = workReportHelper(response.data, staffList || allStaffs, form?.date)
                setData(report)
                setLoading(false)
            }).catch((error) => {
                dispatch(toast.push.error({ message: error.message }))
                setLoading(false)
            })

        }

        if (`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}` === form?.date && !form?.staff_id) {
            setThisMonth(true)
        } else {
            setThisMonth(false)
        }

        // eslint-disable-next-line
    }, [form])


    return (
        <div className="work-report-page-div">
            <div className='main'>
                <div className='top-bar '>
                    <div className="left">
                        {!form?.staff_id && <NormalInput label='Month' type='month' name='date' value={form?.date} onChangeFun={handleChange}
                            max={`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`} min={'2023-08'} />
                        }
                        {form?.staff_id && <NormalInput label='Year' type='number' name='year' value={form?.year} onChangeFun={handleChange}
                            min="2023" max="2099" />}

                        <SelectInput label='Staff' name='staff_id' firstOption={{ option: 'All', value: '' }} onChangeFun={handleChange}
                            values={staffList?.map((staff) => ({ option: `${staff?.full_name} ${staff?.delete ? '(Removed)' : ''}`, value: staff._id }))} />
                    </div>
                    <div className="right">
                        {/* Buttons */}
                        {data[0] && !thisMonth &&
                            <div>
                                <p>Download files</p>
                                <div><SCReport report={data} thisMonth={thisMonth} date={form?.date} staffBase={form?.staff_id}
                                    staff={staffList?.filter((staff) => staff._id === form.staff_id)?.[0]} /></div>
                            </div>
                        }
                    </div>
                </div>
                <div className="content">
                    {loading
                        ? <SpinWithMessage message='Generate report' height={'400px'} load={loading} />
                        : <>
                            {data?.[0]
                                ? <WorkReportTable report={data} setData={setData} thisMonth={thisMonth} staffBase={form?.staff_id} />
                                : <SpinWithMessage icon={<BsDatabaseFillExclamation />} height={'400px'} message='Salary report not available' spin={false} />
                            }
                        </>}
                </div>
            </div>
        </div>
    )
}

export default WorkReport