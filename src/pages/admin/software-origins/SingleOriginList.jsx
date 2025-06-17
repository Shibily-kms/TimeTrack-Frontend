import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ttCv2Axios } from '../../../config/axios';
import { origins_head_list } from '../../../assets/javascript/const-data'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage';
import { BiMessageSquareError } from 'react-icons/bi';
import TableFilter from '../../../components/common/table-filter/TableFilter';
import SingleButton from '../../../components/common/buttons/SingleButton';
import { GrEdit } from 'react-icons/gr';

const SingleOriginList = ({ setPageHead }) => {
    const params = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState('')
    const [loading, setLoading] = useState('')
    const [data, setData] = useState([])

    const handleEditOrigin = () => {
        
    }

    useEffect(() => {
        setPageHead({ title: `Software Origins / ${params?.origin_id}` })
        setError('')

        const validId = origins_head_list.filter((a) => a.id === params.origin_id)
        if (!validId?.[0] && params.origin_id !== 'dvur') {
            setError('Invalid Origin Id')
            return;
        }

        // fetch
        setLoading('fetch')
        ttCv2Axios.get(`/worker/software-origins/${params.origin_id}/list`).then((response) => {
            setData(response.data)
            setLoading('')
        }).catch((error) => {
            setError(error.message)
            setLoading('')
        })

    }, [])


    return (
        <div className="single-origin-list-page-div">

            {(loading === 'fetch' || error) &&
                <SpinWithMessage load={loading === 'fetch'} height={'400px'} message={error}
                    icon={<BiMessageSquareError />} />}


            {(loading !== 'fetch' && !error) && <>
                <TableFilter>
                    <table>
                        <thead>
                            <tr>
                                <th>Staff name</th>
                                {params.origin_id !== 'dvur' ?
                                    <th>Access in {origins_head_list.filter((a) => a.id === params.origin_id)?.[0]?.sections.length || 0}</th>
                                    : <th>Access</th>}
                                <th>Control</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((staff) => {
                                return <tr key={staff?.staff_id}>
                                    <td>{staff?.full_name}</td>
                                    {params.origin_id !== 'dvur' ?
                                        <td style={{ textAlign: "center" }}>{staff?.allowed_origins?.filter((origin) => origin.slice(0, params.origin_id?.length) === params.origin_id)?.length || 0}</td>
                                        : <td style={{ textAlign: "center" }}>Full</td>}
                                    {params.origin_id !== 'dvur' ?
                                        <td> <div style={{ display: 'flex', justifyContent: 'center' }} >
                                            <SingleButton title='Edit' stIcon={<GrEdit />} classNames={'btn-blue icon-only'}
                                                loading={loading === `deactivate${staff?.acc_id}${origin?.origin}`}
                                                onClick={() => handleEditOrigin()} />
                                        </div></td>
                                        : <td> <div style={{ display: 'flex', justifyContent: 'center' }} >
                                            <SingleButton stIcon={<GrEdit />} classNames={'btn-gray icon-only'} style={{ cursor: 'not-allowed' }} />
                                        </div></td>}
                                </tr>
                            })}

                        </tbody>
                    </table>
                </TableFilter>
            </>}


        </div>
    )
}

export default SingleOriginList