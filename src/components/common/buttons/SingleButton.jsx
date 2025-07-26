import React from 'react'
import './single-button.scss';

const SingleButton = ({
    name, type, bgColor, txColor, classNames,
    stIcon, edIcon, style, loading = false,
    onClick, title, disabled = false
}) => {
    return (
        <div className="single-button-comp-div">
            {loading
                ? <button title={title} className={`${classNames || 'md btn-primary'}`} style={{ ...style }}
                    type={type || 'auto'}><div className="loader">-</div></button>
                : <button title={title} className={`${classNames || 'md btn-primary'}`} style={{ ...style }}
                    type={type || 'auto'} onClick={onClick} disabled={disabled}>{stIcon}{name}{edIcon}</button>}
        </div>
    )
}

export default SingleButton


