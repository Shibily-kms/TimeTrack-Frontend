import React from 'react'
import './spin-with-message.scss'
import { BiLoaderAlt } from 'react-icons/bi'

function SpinWithMessage({ icon, message = '', spin = true }) {

    return (
        <div className='spin-with-message'>
            <div className="spinner-body">
                <div className={spin ? "load-div spin-div" : "load-div"}>
                    {icon ? icon : <BiLoaderAlt />}
                </div>
                {message && <div className="message">
                    <p>{message}</p>
                </div>
                }
            </div>
        </div>
    )
}

export default SpinWithMessage