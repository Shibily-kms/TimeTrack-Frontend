import React, { useEffect, useRef, useState } from 'react'
import './dashboard.scss'
import { setAdminActivePage } from '../../../redux/features/user/systemSlice'
import { adminAxios } from '../../../config/axios'
import { useDispatch } from 'react-redux'
import { FaInfoCircle, FaUsers, FaUsersSlash } from "react-icons/fa";
import { LuQrCode } from "react-icons/lu";
import { RiFileList3Fill } from 'react-icons/ri'
import { IoPricetagsSharp } from "react-icons/io5";
import { MdOutlineFingerprint } from "react-icons/md";
import SingleButton from '../../../components/common/buttons/SingleButton';
import ProfileCard from '../../../components/admin/dashboard/ProfileCard';
import Modal from '../../../components/common/modal/Modal'
import AllStaffModal from '../../../components/admin/dashboard/AllStaffModal';
import CanvasJSReact from '@canvasjs/react-charts';
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import Badge from '../../../components/common/badge/Badge'
import { getTimeFromSecond } from '../../../assets/javascript/date-helper'

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Dashboard = ({ setPageHead }) => {
    const dispatch = useDispatch()
    const [modal, setModal] = useState({ status: false })
    const chartRef = useRef(null);
    const [loading, setLoading] = useState({ summery: true, current: true, best: true, graph: false })
    const [summery, setSummery] = useState({ loading: true, data: {} })
    const [currentList, setCurrentList] = useState({ loading: true, data: [] })
    const [bestList, setBestList] = useState({ loading: true, data: [] })
    const [chart, setChart] = useState({ loading: true })
    const [chartDataType, setChartDataType] = useState('Days')
    const [chartData, setChartData] = useState([{
        type: "spline",
        name: "Worked Time",
        showInLegend: true,
        yValueFormatString: "#,##0.## Hours",
        dataPoints: [
        ]
    },
    {
        type: "spline",
        name: "Workers",
        axisYType: "secondary",
        showInLegend: true,
        dataPoints: [

        ]
    }])

    const toggleDataSeries = (e) => {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        chartRef.current.render();
    };

    const options = {
        animationEnabled: true,
        backgroundColor: "transparent",
        axisX: {
            title: "",
            labelFontColor: '#787878',
            titleFontColor: "#787878",
        },
        axisY: {
            tickLength: 0, // Hide Y-axis ticks
            lineThickness: 0, // Hide Y-axis line
            labelFontSize: 0 // Hide Y-axis labels
        },
        axisY2: {
            tickLength: 0, // Hide Y-axis ticks
            lineThickness: 0, // Hide Y-axis line
            labelFontSize: 0 // Hide Y-axis labels
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries,
            fontColor: "#787878", // Legend font color
            itemStyle: {
                color: "#787878", // Change the legend text color
            },
        },
        data: chartData
    };

    const handleChangeChartType = (e) => {
        setChartDataType(e.target.value)
    }

    const fetchChartData = () => {
        setChart({ ...chart, loading: true, })
        adminAxios.get(`/report/chart-attendance-report?type=${chartDataType || 'Days'}`).then((response) => {
            setChart({ loading: false })
            let Y1 = response?.data?.map((obj) => ({ x: chartDataType === 'Weeks' ? obj?._id : new Date(obj?._id), y: ((obj?.punch_duration / 60) / 60) }))
            let Y2 = response?.data?.map((obj) => ({ x: chartDataType === 'Weeks' ? obj?._id : new Date(obj?._id), y: obj?.total_staff }))
            setChartData([
                {
                    ...chartData?.[0],
                    dataPoints: Y1
                },
                {
                    ...chartData?.[1],
                    dataPoints: Y2
                }
            ])
        })
    }

    useEffect(() => {
        dispatch(setAdminActivePage('dashboard'))
        setPageHead({ title: 'Dashboard' })

        // Summery 
        adminAxios.get('/report/summery').then((response) => {
            setSummery({ loading: false, data: response.data })
        })

        // Current 
        adminAxios.get('/report/staff-current-status?last_action=3').then((response) => {
            setCurrentList({ loading: false, data: response.data })
        })

        // Best
        adminAxios.get('/report/best-five-staff').then((response) => {
            setBestList({ loading: false, data: response.data })
        })

        fetchChartData()

        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        fetchChartData()

        // eslint-disable-next-line
    }, [chartDataType])

    return (
        <div className='dashboard-page-div'>
            <div className="color-temp-div">
                <div className="box-one"></div>
                <div className="box-two"></div>
                <div className="box-three"></div>
                <div className="box-four"></div>
            </div>
            <Modal modal={modal} setModal={setModal} />
            <div className="content-div">
                {/* Summery */}
                <div className="sub-box-div sub-one">
                    <div className="head-div">
                        <div className="left">
                            <h3>Summery</h3>
                            <p>Mini report of staff app</p>
                        </div>
                        <div className="right">
                        </div>
                    </div>
                    {summery?.loading
                        ? <SpinWithMessage load height={'150px'} />
                        : <div className="sub-content-div">
                            {summery?.data?.today_leaves ? <div className="summery-item-div">
                                <RiFileList3Fill />
                                <div className="number-div">
                                    <h3>{(summery?.data?.today_leaves)?.toString().padStart(2, '0')}</h3>
                                </div>
                                <div className="desi-div">
                                    <p>Today Leaves</p>
                                </div>
                            </div> : ''}
                            <div className="summery-item-div">
                                <FaUsers />
                                <div className="number-div">
                                    <h3>{(summery?.data?.active_staff_count)?.toString().padStart(2, '0')}</h3>
                                    <p>/{(summery?.data?.staff_count)?.toString().padStart(2, '0')}</p>
                                </div>
                                <div className="desi-div">
                                    <p>Active Staffs</p>
                                </div>
                            </div>
                            <div className="summery-item-div">
                                <IoPricetagsSharp />
                                <div className="number-div">
                                    <h3>{(summery?.data?.designation_count)?.toString().padStart(2, '0')}</h3>
                                </div>
                                <div className="desi-div">
                                    <p>Designations</p>
                                </div>
                            </div>
                            <div className="summery-item-div">
                                <RiFileList3Fill />
                                <div className="number-div">
                                    <h3>{(summery?.data?.pending_l2)?.toString().padStart(2, '0')}</h3>
                                </div>
                                <div className="desi-div">
                                    <p>L2  Pending</p>
                                </div>
                            </div>
                            {!summery?.data?.today_leaves && <div className="summery-item-div">
                                <LuQrCode />
                                <div className="number-div">
                                    <h3>{(summery?.data?.active_qr_count)?.toString().padStart(2, '0')}</h3>
                                </div>
                                <div className="desi-div">
                                    <p>Active QR</p>
                                </div>
                            </div>}
                        </div>
                    }
                </div>

                {/* Box Two */}
                <div className="sub-box-div sub-two">
                    <div className="head-div">
                        <div className="left">
                            <h3>Current Status</h3>
                            <p>Last 3 work action and see more</p>
                        </div>
                        <div className="right">
                            <SingleButton name={'See More'} classNames={'sm btn-secondary'}
                                onClick={() => setModal({ status: true, title: 'All Staff Current Status', content: <AllStaffModal /> })} />
                        </div>
                    </div>
                    {currentList?.loading || !currentList?.data?.[0]
                        ? <SpinWithMessage load={currentList?.loading} height={'150px'} icon={<MdOutlineFingerprint />} message='All are no-punches' />
                        : <div className="sub-content-div">
                            {currentList?.data?.map((staff, index) => {
                                return <ProfileCard
                                    key={index}
                                    full_name={`${staff?.first_name} ${staff?.last_name}`}
                                    description={staff?.designation}
                                    rightContent={<Badge text={staff?.status} className={
                                        staff?.status === 'IN'
                                            ? 'success-fill'
                                            : staff?.status === 'OUT'
                                                ? 'error-fill'
                                                : 'warning-fill'
                                    } />}
                                />
                            })}
                        </div>}
                </div>

                {/* Box Three */}
                <div className="sub-box-div sub-three">
                    <div className="head-div">
                        <div className="left">
                            <h3>Best 5 Staff</h3>
                            <p>The best staffs of this month (Efficiency)</p>
                        </div>
                        <div className="right">
                        </div>
                    </div>
                    {bestList?.loading || !bestList?.data?.[0]
                        ? <SpinWithMessage load={bestList?.loading} height={'240px'} icon={<FaUsersSlash />} message='Data not available' />
                        : <div className="sub-content-div">
                            {bestList?.data?.map((staff, index) => {
                                return <ProfileCard
                                    key={index}
                                    full_name={staff?.full_name}
                                    description={staff?.designation}
                                    rightContent={<p className='p-time-view'
                                        style={{ fontSize: '14px', fontWeight: '600' }}
                                    >{staff?.efficiency}%</p>}
                                />
                            })}
                        </div>}
                </div>

                {/* Box Four */}
                <div className="sub-box-div sub-four">
                    <div className="head-div">
                        <div className="left">
                            <h3>Attendance Report ({chartDataType})</h3>
                            <p>10 time period of attendance report</p>
                        </div>
                        <div className="right">
                            <select className='type-of-report' name='chartDataType' onChange={handleChangeChartType}>
                                <option value={'Days'}>Daily</option>
                                <option value={'Weeks'}>Weekly</option>
                                <option value={'Months'}>Monthly</option>
                                <option value={'Years'}>Yearly</option>
                            </select>
                        </div>
                    </div>
                    {chart?.loading
                        ? <SpinWithMessage load height={'240px'} />
                        : <div className="sub-content-div">
                            <CanvasJSChart
                                options={options}
                                onRef={chart => chartRef.current = chart}
                                containerProps={{ width: "100%", height: "220px" }}
                            />
                        </div>}
                </div>

            </div>
        </div>
    )
}

export default Dashboard