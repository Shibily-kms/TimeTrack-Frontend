import React, { useEffect, useState } from 'react'
import Header from '../../../components/admin/header/Header'
import './access-sales.scss'
import { adminAxios } from '../../../config/axios'

function AccessSales() {
    const [data, setData] = useState([])
    useEffect(() => {
        adminAxios.get('/designations').then((response) => {
            setData(response.data.designations)
        })
    })

    const handleAllow = (id, status) => {
        adminAxios.post('/allow-sales-web', { id, status }).then((response) => {
            setData((prev) => prev.map((obj) => {
                if (id === obj._id) {
                    return {
                        ...prev,
                        allow_sales: !status
                    }
                }
                return obj
            })
            )
        })
    }

    return (
        <div>
            <div className="header-div">
                <Header />
            </div>
            <div className="container">
                <div className="table-div">
                    <table id="list">
                        {data?.[0] ? <>
                            <tr>
                                <th>Sl no</th>
                                <th>Designation</th>
                                <th>Control Allow</th>
                            </tr>
                            {data.map((value, index) => {
                                return <tr >
                                    <td>{++index}</td>
                                    <td>{value.designation}</td>
                                    <td>
                                        <div>
                                            {value.allow_sales ?
                                                <button onClick={() => handleAllow(value._id, true)} className='button dont'>Don't</button>
                                                :
                                                <button onClick={() => handleAllow(value._id, false)} className='button allow'>Allow</button>
                                            }
                                        </div>
                                    </td>
                                </tr>
                            })}
                        </>
                            : <>
                                <tr>
                                    <td style={{ textAlign: 'center' }}>no data</td>
                                </tr>
                            </>}
                    </table>

                </div>
            </div>
        </div>
    )
}

export default AccessSales