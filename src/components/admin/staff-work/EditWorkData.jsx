import React, { useState, useEffect } from 'react'
import './edit-work-data.scss'
import { ttCv2Axios } from '../../../config/axios'
import { toast } from '../../../redux/features/user/systemSlice'
import SingleButton from '../../common/buttons/SingleButton'
import { useDispatch } from 'react-redux'
import { GoTrash } from 'react-icons/go'
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper'

function EditWorkData({ data, setModal }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState([])

    const handleChange = (e, index) => {
        if (e.target.name === 'in') {
            setForm((state) => state.map((punch, idx) => {
                if (idx === index) {
                    return {
                        ...punch,
                        in: e.target.value,
                        in_by: punch?.in_by || 'software'
                    }
                }
                return punch
            }));
        } else {
            setForm((state) => state.map((punch, idx) => {
                if (idx === index) {
                    return {
                        ...punch,
                        out: e.target.value,
                        out_by: (!punch?.out_by || punch?.out_by === 'Auto') ? 'software' : punch?.out_by,
                        auto: false
                    }
                }
                return punch
            }));
        }
    }

    const handelSubmit = (e) => {
        e.preventDefault();
        const ask = window.confirm('Are you sure you want to update this work?')
        if (ask) {
            setLoading(true)
            ttCv2Axios.put('/work/punch', { punch_list: form, date: YYYYMMDDFormat(data?.date), staff_id: data.staff_id }).then(() => {
                dispatch(toast.push.success({ message: 'Updated. Refresh now!' }))
                setModal({ status: false })
                setLoading(false)
            }).catch((error) => {
                setLoading(false)
                dispatch(toast.push.error({ message: error.message }))
            })
        }
    }

    useEffect(() => {
        setForm(data?.punch_list || [])
    }, [data])

    return (
        <div className='edit-work-data'>
            <form action="" onSubmit={handelSubmit}>
                <div className="list-days">
                    <div className="list" >
                        <p>Punch In</p>
                        <p>Punch Out</p>
                    </div>
                </div>
                {form?.map((day, index) => <div className="list-days">
                    <div className="list" >
                        <input name='in' type='time' value={day?.in?.slice(0, 5)} onChange={(e) => handleChange(e, index)} />
                        <input name='out' type='time' value={day?.out?.slice(0, 5)} min={day?.in?.slice(0, 5)} onChange={(e) => handleChange(e, index)} />
                        {!form?.[0] && <div className="icon reject" > <GoTrash /></div>}
                    </div>
                </div>)}

                <SingleButton name={'Update'} type={loading === 'submit' ? 'button' : 'submit'}
                    loading={loading === 'submit'} style={{ width: '100%' }} classNames={'lg btn-tertiary'} />
            </form>
            <p className='smallTD1' style={{ marginTop: '15px' }}>Changes to reports from months other than the current one will not impact the salary report.</p>
        </div>
    )
}

export default EditWorkData