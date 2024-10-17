import React from 'react'
import './spin-with-message.scss'
import { MdOutlineDataSaverOff } from "react-icons/md";

function SpinWithMessage({ icon, message = '', load = false, fullView = false, bottomContent = null, height }) {

    return (
        <div className={fullView ? 'spin-with-full-view' : 'spin-with-message'} style={{ height: height }}>
            {load
                ? <div className="loading-image">
                    <div className="loader"></div>
                </div>
                : <div className={"load-div"}>
                    {icon || <MdOutlineDataSaverOff />}
                </div>
            }

            {message && !load && <div className="message">
                <p>{message}</p>
            </div>
            }

            {bottomContent && !load && <div className="bottom-div">
                {bottomContent}
            </div>}
        </div>
    )
}

export default SpinWithMessage