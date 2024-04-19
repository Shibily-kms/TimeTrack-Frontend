import React from 'react'
import './spin-with-message.scss'
import BoatWaveLoad from '../../../assets/images/boat-wave.gif'
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

            {message && <div className="message">
                <p>{message}</p>
            </div>
            }

            <div className="bottom-div">
                {bottomContent}
            </div>
        </div>
    )
}

export default SpinWithMessage