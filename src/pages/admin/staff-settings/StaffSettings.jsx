import React, { useEffect, useState } from 'react'
import './staff-settings.scss'
import { ttCv2Axios } from '../../../config/axios'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from '../../../redux/features/user/systemSlice'
import SingleButton from '../../../components/common/buttons/SingleButton'
import { FiSave } from "react-icons/fi";
import D2StaffSettings from '../../../components/admin/dropdown/D2StaffSettings'
import { origins_head_list } from '../../../assets/javascript/const-data'

const StaffSettings = ({ setPageHead }) => {
    const [data, setData] = useState({})
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { staff_id } = useParams()
    const [activeDrop, setActiveDrop] = useState('')
    const [doSave, setDoSave] = useState(false)
    const { user } = useSelector((state) => state.userAuth)
    const punch_types = ['software', 'scanner', 'firstInScanner']



    const handleChange = (e) => {
        setDoSave(true)
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const doActiveDrop = (dropId) => {
        if (dropId === activeDrop) {
            setActiveDrop('')
        } else {
            setActiveDrop(dropId)
        }
    }

    const handleSave = () => {
        setDoSave(false)

        // Validation
        if (!data?.punch_type) {
            dispatch(toast.push.error({ message: "Choose punch type" }))
            return
        }
        if (data?.punch_type !== 'scanner' && !data?.auto_punch_out) {
            dispatch(toast.push.error({ message: "Select auto punch out time" }))
            return
        }

        // Save

        ttCv2Axios.put(`/worker/account/${staff_id}/settings`, data).then(() => {
            dispatch(toast.push.success({ message: 'Saved' }))
        }).catch((error) => {
            dispatch(toast.push.error({ message: error?.message }))
        })
    }

    useEffect(() => {
        ttCv2Axios.get(`/worker/initial-info?accId=${staff_id}`).then((response) => {

            setData({
                acc_id: response.data.acc_id,
                punch_type: response.data.punch_type,
                auto_punch_out: response.data.auto_punch_out,
                allowed_origins: response.data.allowed_origins,
            })
            setPageHead({ title: `${response.data.first_name} ${response.data.last_name} / Settings` })

        }).catch((error) => {
            dispatch(toast.push.error({ message: error?.message }))
            navigate('/admin/staff-list')
        })
        //eslint-disable-next-line
    }, [])

    return (
        <div className="staff-settings-page-div">
            <div className="boarder">
                {/* Section one */}
                <div className="section-div">
                    <div className="section-head">
                        <h3>About punching</h3>
                    </div>
                    <div className="section-content listing-row">
                        <div className="listing-items">
                            <div className="item">
                                <div className="label">
                                    <p className='title'>Punch type</p>
                                </div>
                                <div className="input">
                                    <select name='punch_type' onChange={handleChange}>
                                        <option value={''}>Select...</option>
                                        {punch_types?.map((item) => <option value={item} selected={data?.punch_type === item}>{item}</option>)}
                                    </select>
                                </div>
                            </div>
                            {data?.punch_type !== 'scanner' && <div className="item">
                                <div className="label">
                                    <p className='title'>Auto punch out time</p>
                                </div>
                                <div className="input">
                                    <input type="time" name="auto_punch_out" value={data?.auto_punch_out} onChange={handleChange} />
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>

                {/* Section two */}
                {(!data?.allowed_origins?.includes('dvur_backup_read') ||
                    (data?.allowed_origins?.includes('dvur_backup_read') && data?.acc_id === user.acc_id))
                    && <div className="section-div">
                        <div className="section-head">
                            <h3>Software origin permissions</h3>
                        </div>
                        <div className="section-content">
                            <div className="dropdowns">
                                {origins_head_list?.map((oh) => {
                                    return <D2StaffSettings key={oh?.id} doActiveDrop={doActiveDrop} activeDrop={activeDrop} data={oh}
                                        list={data?.allowed_origins} setData={setData} setDoSave={setDoSave} />
                                })}
                            </div>
                        </div>
                    </div>}
                {/* Fixed content */}
                <div className="fixed-div">
                    {doSave && <div className="fixed-border">
                        <p className='smallTD1'>Only take your changes after save</p>
                        <SingleButton stIcon={<FiSave />} name={'Save Changes'} onClick={handleSave} />
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default StaffSettings