import React from 'react'
import './style.scss'

const D2StaffSettings = ({ originList, userOrigins, setData, setDoSave }) => {

    const handleChange = (e, sectionId) => {

        setDoSave(true)

        if (!e.target.value) {
            setData((state) => ({
                ...state,
                allowed_origins: state.allowed_origins.filter((item) => item?.slice(0, sectionId?.length) !== sectionId)
            }))
        } else if (userOrigins?.includes(e.target.value)) {
            setData((state) => ({
                ...state,
                allowed_origins: state.allowed_origins.filter((item) => item !== e.target.value)
            }))
        } else {
            setData((state) => ({
                ...state,
                allowed_origins: [...state.allowed_origins.filter((item) => item?.slice(0, sectionId?.length) !== sectionId), e.target.value]
            }))
        }
    }

    return (
        <div className="dropdown-staff-settings-sub-div">
            <div className="item-list">
                {originList?.map((item) => {
                    return <div className="item">
                        <div className="s1">
                            <p>{item?.title}</p>
                            <small>{item?.description}</small>
                        </div>
                        <div className="s2">
                            <select name='punch_type' onChange={(e) => handleChange(e, item.id)} >
                                <option value={''}>No access</option>
                                {item?.origins?.map((option) => <option value={option?.key} selected={userOrigins?.includes(option?.key)}>{option?.name}</option>)}
                            </select>
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}

export default D2StaffSettings