import React, { useEffect } from 'react'
import './alert-bar.scss'
import { FaCheckCircle } from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa";
import { MdOutlineWarning } from "react-icons/md";
import { BiSolidErrorAlt } from "react-icons/bi";
import { IoCloseSharp } from "react-icons/io5";
import { toast } from '../../../redux/features/user/systemSlice'
import { useDispatch } from 'react-redux';

const AlertBar = ({
    id,
    type = 'info',
    icon,
    message,
    doClose = true,
    autoClose = true
}) => {
    const dispatch = useDispatch();
    const iconMap = {
        success: <FaCheckCircle />,
        error: <BiSolidErrorAlt />,
        warning: <MdOutlineWarning />,
        default: <FaLightbulb />,
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (autoClose) {
                dispatch(toast?.pull?.single(id))
            }
        }, 5000); // Toasts disappear after 5 seconds
        return () => clearTimeout(timer);

        // eslint-disable-next-line
    }, [])

    const handleClose = () => {
        if (doClose) {
            dispatch(toast?.pull?.single(id))
        } else {
            console.error(`You can't remove this alert box.`)
        }
    }

    return (
        <div className={`${type} alert-bar-style-div`}>
            <div className="icon-div icon-section">
                {icon || iconMap[type] || iconMap.default}
            </div>
            <div className="content-section">
                <p>{message}</p>
            </div>
            {doClose && <div className="icon-div  close-section">
                <IoCloseSharp onClick={handleClose} />
            </div>}
        </div>
    )
}

export default AlertBar