import React, { useEffect, useState } from 'react'
import './edit-work-list.scss';
import WorkText from '../work-text/WorkText';
import AddTextInput from '../add-work-input/AddTextInput';
import SpinWithMessage from '../../common/spinners/SpinWithMessage';
import { adminAxios } from '../../../config/axios'
import { IoTrashBin } from 'react-icons/io5'
import { toast } from 'react-hot-toast'

function EditWorkList({ setModel, staffId }) {
    const [works, setWorks] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        adminAxios.get(`/regular-work?staffId=${staffId}`).then((response) => {
            setWorks(response.data.data || [])
            setLoading(false)
        }).catch((error) => {
            toast.error(error.response.data.message)
        })
        // eslint-disable-next-line
    }, [])


    return (
        <div className='edit-works-list'>
            {/* Sections One */}
            <div className="list-div">
                {loading ? <>
                    <div className='no-work'>
                        <SpinWithMessage message={'Loading...'} />
                    </div>
                </> : <>
                    {works?.[0] ? <ol>
                        {works.map((obj, index) => <li key={index}>
                            <WorkText work={obj} setWorks={setWorks} />
                        </li>)}
                    </ol> :
                        <div className='no-work'>
                            <SpinWithMessage icon={<IoTrashBin />} message={'No works'} spin={false} />
                        </div>}

                </>}
            </div>
            {/* Section Two */}
            <div className="add-box">
                <AddTextInput setWorks={setWorks} staffId={staffId} />
            </div>
        </div>
    )
}

export default EditWorkList