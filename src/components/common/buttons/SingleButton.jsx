import React from 'react'
import './single-button.scss';

const SingleButton = ({ name, type, bgColor, txColor, classNames, stIcon, edIcon, style, loading = false }) => {
    return (
        <div className="single-button-comp-div">
            {loading
                ? <button className={`${classNames || 'md btn-primary'}`} style={{ ...style }}
                    type={type || 'button'}><div class="loader">-</div></button>
                : <button className={`${classNames || 'md btn-primary'}`} style={{ ...style }}
                    type={type || 'button'}>{stIcon}{name || 'Single Button'}{edIcon}</button>}
        </div>
    )
}

export default SingleButton


