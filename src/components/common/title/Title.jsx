import React from 'react'
import './title.scss'

function Title(props) {
    return (
        <div className="title-div">
            {Object.values(props).map((value) => {
                return <h5>{value}</h5>
            })}
        </div>
    )
}

export default Title

