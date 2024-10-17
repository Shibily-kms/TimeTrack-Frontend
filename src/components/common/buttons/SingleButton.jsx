import React from 'react'
import './single-button.scss';

const SingleButton = ({
    name, type, bgColor, txColor, classNames,
    stIcon, edIcon, style, loading = false,
    onClick, title
}) => {
    return (
        <div className="single-button-comp-div">
            {loading
                ? <button title={title} className={`${classNames || 'md btn-primary'}`} style={{ ...style }}
                    type={type || 'auto'}><div className="loader">-</div></button>
                : <button title={title} className={`${classNames || 'md btn-primary'}`} style={{ ...style }}
                    type={type || 'auto'} onClick={onClick}>{stIcon}{name}{edIcon}</button>}
        </div>
    )
}

export default SingleButton


