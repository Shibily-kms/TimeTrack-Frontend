import React, { useEffect, useState } from 'react'
import Header from '../../../components/admin/header/Header'
import './all-staffs.scss'
import { adminAxios } from '../../../config/axios'
import { BsTrash3 } from 'react-icons/bs'
import { toast } from 'react-hot-toast'
import IconWithMessage from '../../../components/common/spinners/SpinWithMessage'
import { IoTrashBin } from 'react-icons/io5'
import { BiLoaderAlt } from 'react-icons/bi'

function AllStaffs() {
    const [loading, setLoading] = useState('')
    const [data, setData] = useState([])

    useEffect(() => {
        setLoading('initialData')
        adminAxios.get('/staff/all-list').then((response) => {
            setData(response.data.data)
            setLoading('')
        })
    }, [])

    const handleDelete = (id) => {
        const confirm = window.confirm('Are you delete this staff ?')
        if (confirm) {
            setLoading(id)
            adminAxios.delete(`/staff?id=${id}`).then(() => {
                setData(data.filter((obj) => obj._id !== id))
                setLoading('')
            }).catch((error) => {
                toast.error(error.response.data.message)
                setLoading('')
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
                    {data?.[0] ? <>
                        <table id="list">
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
                                            <button title='Remove' onClick={() => handleDelete(value._id)}
                                                className={loading === value._id ? 'button-small-icon delete loading-icon' : 'button-small-icon delete'}>
                                                {loading === value._id ? <BiLoaderAlt /> : <BsTrash3 />}</button>
                                        </div>
                                    </td>
                                </tr>
                            })}
                        </table>
                    </>
                        :
                        <div className='no-data'>
                            <IconWithMessage icon={loading !== 'initialData' && <IoTrashBin />} message={loading === 'initialData' ? 'Loading...' : 'No Staffs'} spin={loading === 'initialData' ? true : false} />
                        </div>
                    }

                </div>
            </div>
        </div >
    )
}

export default AllStaffs