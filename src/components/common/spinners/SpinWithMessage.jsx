import React from 'react'
import './spin-with-message.scss'
import BoatWaveLoad from '../../../assets/images/boat-wave.gif'
import { MdOutlineDataSaverOff } from "react-icons/md";

function SpinWithMessage({ icon, message = '', load = false, fullView = false, bottomContent = null }) {

    return (
        <div className={fullView ? 'spin-with-full-view' : 'spin-with-message'}>
            <div className="spinner-body">
                {load
                    ? <div className="loading-image">
                        <img src={BoatWaveLoad} alt="Loading Icon" />
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
        </div>
    )
}

export default SpinWithMessage