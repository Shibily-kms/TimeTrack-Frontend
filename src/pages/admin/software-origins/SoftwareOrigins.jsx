import React, { useEffect } from 'react'
import './software-origins.scss'
import { origins_head_list } from '../../../assets/javascript/const-data'
import NullApp from '../../../assets/images/app-icons/Null.jpg'
import { useNavigate } from 'react-router-dom'


const SoftwareOrigins = ({ setPageHead }) => {
    const navigate = useNavigate()

    useEffect(() => {
        setPageHead({ title: 'Software Origins' })
    }, [])

    return (
        <div className="software-origins-page-div">
            <div className="section-content">
                <div className="box-header">
                    {origins_head_list?.map((oh) => {
                        return <div className="box" onClick={() => navigate(`/admin/software-origins/${oh?.id}`)}>
                            <div className="icon-div">
                                <img alt='icon' src={oh.icon || NullApp} />
                            </div>
                            <div className="content">
                                <h3>{oh?.title}</h3>
                                <p>{oh?.description || 'Click to view'}</p>
                            </div>
                        </div>
                    })}

                    <div className="box" onClick={() => navigate(`/admin/software-origins/dvur`)}>
                        <div className="icon-div">
                            <img alt='icon' src={NullApp} />
                        </div>
                        <div className="content">
                            <h3>{'Developer App'}</h3>
                            <p>{'Access the developer mode'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SoftwareOrigins