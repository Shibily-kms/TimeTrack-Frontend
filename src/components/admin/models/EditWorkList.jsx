import React, { useEffect, useState } from 'react'
import './edit-work-list.scss';
import EditTextInput from '../edit-work-input/EditTextInput';
import AddTextInput from '../add-work-input/AddTextInput';
import { adminAxios } from '../../../config/axios'


function EditWorkList({ setModel, designationId }) {
    const [works, setWorks] = useState([])
    const [nowEdit, setNowEdit] = useState('')

    useEffect(() => {
        adminAxios.get(`/regular-work/${designationId}`).then((response) => {
            setWorks(response.data.works || [])
        })
    }, [])


    return (
        <div className='edit-works-list'>
            {/* Sections One */}
            <div className="list-div">
                <ol>
                    {works?.[0] ?
                        works.map((obj, index) => <li key={index}>
                            <EditTextInput work={obj} nowEdit={nowEdit} setNowEdit={setNowEdit} setWorks={setWorks} />
                        </li>) :
                        <p className='no-work'>No Works</p>}
                </ol>
            </div>
            {/* Section Two */}
            <div className="add-box">
                <AddTextInput setWorks={setWorks} designationId={designationId} />
            </div>
        </div>
    )
}

export default EditWorkList