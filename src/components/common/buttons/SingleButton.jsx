import React from 'react'
import './single-button.scss';

const SingleButton = ({ name, type, bgColor, txColor, classNames, stIcon, edIcon, style }) => {
    return (
        <div className="single-button-comp-div">
            <button className={`${classNames || 'md btn-primary'}`} style={{ ...style }}
                type={type || 'button'}>{stIcon}{name || 'Single Button'}{edIcon}</button>
        </div>
    )
}

export default SingleButton