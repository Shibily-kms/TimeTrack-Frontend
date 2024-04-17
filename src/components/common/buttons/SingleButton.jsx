import React from 'react'
import './single-button.scss';

const SingleButton = ({
    name, type, bgColor, txColor, classNames,
    stIcon, edIcon, style, loading = false,
    onClick
}) => {
    return (
        <div className="single-button-comp-div">
            {loading
                ? <button className={`${classNames || 'md btn-primary'}`} style={{ ...style }}
                    type={type || 'button'}><div class="loader">-</div></button>
                : <button className={`${classNames || 'md btn-primary'}`} style={{ ...style }}
                    type={type || 'button'} onClick={onClick}>{stIcon}{name}{edIcon}</button>}
        </div>
    )
}

export default SingleButton


