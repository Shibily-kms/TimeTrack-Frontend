import React, { useEffect, useState } from 'react'
import Header from '../../../components/admin/header/Header'
import './all-staffs.scss'
import { adminAxios } from '../../../config/axios'
import { BsTrash3Fill } from 'react-icons/bs'
import { toast } from 'react-toastify'

function AllStaffs() {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])

    useEffect(() => {
        setLoading(true)
        adminAxios.get('/all-staff').then((response) => {
            setData(response.data.staffs)
            setLoading(false)
        })
        setLoading(false)
    }, [])

    const handleDelete = (id) => {
        const confirm = window.confirm('Are you delete this staff ?')
        if (confirm) {
            adminAxios.delete(`/staff/${id}`).then(() => {
                setData(data.filter((obj) => obj._id !== id))
            }).catch((error) => {
                toast.error(error.response.data.message)
            })
        }
    }




    return (
        <div className='all-staffs'>
            <div className="header-div">
                <Header />
            </div>
            <div className="container">
                <div className="table-div">
                    <table id="list">
                        {data?.[0] ? <>
                            <tr>
                                <th>Sl no</th>
                                <th>User name</th>
                                <th>Designation</th>
                                <th>Mobile</th>
                                <th>Control</th>
                            </tr>
                            {data.map((value, index) => {
                                return <tr key={value._id}>
                                    <td>{++index}</td>
                                    <td>{value.user_name}</td>
                                    <td>{value.designation.designation}</td>
                                    <td>{value.contact}</td>
                                    <td>
                                        <div className='buttons'>
                                            <button title='Remove' onClick={() => handleDelete(value._id)} className='button-small-icon delete'><BsTrash3Fill /></button>
                                        </div>
                                    </td>
                                </tr>
                            })}
                        </>
                            : <>
                                <tr>
                                    <td style={{ textAlign: 'center' }}>{loading ? 'loading...' : 'No staffs'}</td>
                                </tr>
                            </>}
                    </table>

                </div>
            </div>
        </div >
    )
}

export default AllStaffs