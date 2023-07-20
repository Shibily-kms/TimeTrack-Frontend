import React, { useEffect, useState } from 'react'
import './edit-work-list.scss';
import EditTextInput from '../edit-work-input/EditTextInput';
import AddTextInput from '../add-work-input/AddTextInput';
import SpinWithMessage from '../../common/spinners/SpinWithMessage';
import { adminAxios } from '../../../config/axios'
import { IoTrashBin } from 'react-icons/io5'

function EditWorkList({ setModel, designationId }) {
    const [works, setWorks] = useState([])
    const [nowEdit, setNowEdit] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        adminAxios.get(`/regular-work/${designationId}`).then((response) => {
            setWorks(response.data.works || [])
            setLoading(false)
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
                            <EditTextInput work={obj} nowEdit={nowEdit} setNowEdit={setNowEdit} setWorks={setWorks} />
                        </li>)}
                    </ol> :
                        <div className='no-work'>
                            <SpinWithMessage icon={<IoTrashBin />} message={'No works'} spin={false} />
                        </div>}

                </>}
            </div>
            {/* Section Two */}
            <div className="add-box">
                <AddTextInput setWorks={setWorks} designationId={designationId} />
            </div>
        </div>
    )
}

export default EditWorkList