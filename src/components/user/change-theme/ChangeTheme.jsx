import React from 'react'
import './change-theme.scss'
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { PiCircleHalfFill } from "react-icons/pi";
import { useDispatch, useSelector } from 'react-redux'
import { changeThemeColor } from '../../../redux/features/user/systemSlice'
import Badge from '../../../components/common/badge/Badge'

function ChangeTheme() {

    const { theme } = useSelector((state) => state.systemInfo)
    const dispatch = useDispatch()

    const handleChangeTheme = (value) => {
        dispatch(changeThemeColor(value))
    }



    return (
        <div className="change-theme-div">
            <div className="input-options">
                <div className={theme === 'os-default' ? "box-input-div active" : "box-input-div"}
                    onClick={() => handleChangeTheme('os-default')}>
                    <PiCircleHalfFill />
                    <p>Default</p>
                </div>
                <div className={theme === 'dark' ? "box-input-div active" : "box-input-div"}
                    onClick={() => handleChangeTheme('dark')}>
                    <MdDarkMode />
                    <p>Dark</p>
                </div>
                <div className={theme === 'light' ? "box-input-div active" : "box-input-div"}
                    onClick={() => handleChangeTheme('light')}>
                    <MdLightMode />
                    <p>Light</p>
                </div>
            </div>
        </div >
    )
}

export default ChangeTheme