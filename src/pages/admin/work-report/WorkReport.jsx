import React, { useEffect, useState } from 'react'
import './work-report.scss'
import Header from '../../../components/admin/header/Header'
import WorkReportTable from '../../../components/admin/work-report/WorkReportTable'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import SCReport from '../../../components/admin/work-report/SCReport'
import { adminAxios } from '../../../config/axios'
import { workReportHelper } from '../../../assets/javascript/work-helper'
import { BsDatabaseFillExclamation } from 'react-icons/bs'
import { toast } from '../../../redux/features/user/systemSlice'
import NormalInput from '../../../components/common/inputs/NormalInput'
import { useDispatch } from 'react-redux'

function WorkReport({ setPageHead }) {
    const [dateForm, setDateForm] = useState(`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`)
    const [data, setData] = useState([])
    const [thisMonth, setThisMonth] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();

    const handleDate = (e) => {
        setDateForm(e.target.value)
    }

    useEffect(() => {
        setPageHead({ title: "Salary Reports" })
    }, [])

    useEffect(() => {
        setLoading(true)
        adminAxios.get(`/analyze/work-report?date=${dateForm}`).then((response) => {
            adminAxios.get('/staff/all-list?all=yes').then((result) => {
                const report = workReportHelper(response.data, result.data, dateForm)
                setData(report)
                setLoading(false)
            })
        }).catch((error) => {
            dispatch(toast.push.error({ message: error.message }))
            setLoading(false)
        })

        if (`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}` === dateForm) {
            setThisMonth(true)
        } else {
            setThisMonth(false)
        }

    }, [dateForm])



    return (
        <div className="work-report-page-div">
            <div className='main'>
                <div className='top-bar '>
                    <div className="left">
                        <NormalInput label='Month' type='month' value={dateForm} onChangeFun={handleDate}
                            max={`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`} min={'2023-08'} />
                    </div>
                    <div className="right">
                        {/* Buttons */}
                        {data[0] && !thisMonth &&
                            <div>
                                <p>Download files</p>
                                <div><SCReport report={data} thisMonth={thisMonth} date={dateForm} /></div>
                            </div>
                        }
                    </div>
                </div>
                <div className="content">
                    {loading
                        ? <SpinWithMessage message='Generate report' height={'400px'} load={loading} />
                        : <>
                            {data?.[0]
                                ? <WorkReportTable report={data} setData={setData} thisMonth={thisMonth} />
                                : <SpinWithMessage icon={<BsDatabaseFillExclamation />} height={'400px'} message='No reports' spin={false} />
                            }
                        </>}
                </div>
            </div>
        </div>
    )
}

export default WorkReport