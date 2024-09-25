import React from 'react'
import { FaAngleDown } from "react-icons/fa6";
import './style.scss'
import Badge from '../../common/badge/Badge';

const D2StaffSettings = ({ data, activeDrop, doActiveDrop, list, setData, setDoSave }) => {

    const handleChange = (e, sectionId) => {

        setDoSave(true)

        if (!e.target.value) {
            setData((state) => ({
                ...state,
                allowed_origins: state.allowed_origins.filter((item) => item?.slice(0, sectionId?.length) !== sectionId)
            }))
        } else if (list.includes(e.target.value)) {
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
            <div className="dropdown">
                <div className={activeDrop === data?.id ? "dropdown-head active-drop-head" : "dropdown-head"}
                    onClick={() => doActiveDrop(data?.id)}>
                    <div className="s1">
                        <div>
                            <p>{data?.title}</p>
                            {list?.filter((access) => access?.slice(0, data?.id?.length) === data?.id).length > 0 &&
                                <Badge text={`${list?.filter((access) => access?.slice(0, data?.id?.length) === data?.id).length} Select`} className={'gray-fill'} />}
                        </div>
                        <small>{data?.description}</small>
                    </div>
                    <div className="s2">
                        <FaAngleDown />
                    </div>
                </div>
                <div className={activeDrop === data?.id ? "dropdown-list active-drop" : "dropdown-list"}>
                    <div className="item-list">
                        {data?.sections?.map((item) => {
                            return <div className="item">
                                <div className="s1">
                                    <p>{item?.title}</p>
                                    <small>{item?.description}</small>
                                </div>
                                <div className="s2">
                                    <select name='punch_type' onChange={(e) => handleChange(e, item.id)} >
                                        <option value={''}>No access</option>
                                        {item?.origins?.map((option) => <option value={option?.key} selected={list?.includes(option?.key)}>{option?.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default D2StaffSettings