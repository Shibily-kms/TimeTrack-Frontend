import React, { useEffect, useState } from 'react'
import './add-pro-account.scss'
import SelectInput from '../../common/inputs/SelectInput'
import SpinWithMessage from '../../common/spinners/SpinWithMessage'
import AlertBox from '../../common/alert/AlertBox'
import { ttCv2Axios } from '../../../config/axios'
import { FaCircleCheck } from "react-icons/fa6";

const AddProAccount = ({ setData }) => {
    const [loading, setLoading] = useState('fetch')
    const [list, setList] = useState([])
    const [verification, setVerification] = useState({})
    const [error, setError] = useState('')
    const [created, setCreated] = useState(false)

    useEffect(() => {
        ttCv2Axios.get('/worker/account/list?nameOnly=Yes').then((response) => {
            setLoading('')
            setList(response?.data?.filter((a) => !a?.pro_account)?.map((b) => ({ option: b?.full_name, value: b?._id })))
        })
    }, [])

    const handleChooseStaff = (e) => {
        if (e.target.value) {
            setLoading('fetch')
            ttCv2Axios.post('/worker/pro-account', { worker_id: e.target.value }).then((response) => {
                setVerification(response?.data)
                setLoading('')

                const theStaff = list?.filter((a) => a.value === e.target.value)?.[0]

                if (response?.data?.primary_number === 'ok' && response?.data?.whatsapp_number === 'ok' &&
                    response?.data?.s_write_access === 'ok' && response?.data?.e_type === 'ok') {
                    setData((state) => [
                        ...state,
                        {
                            pro_account: [
                                {
                                    origin: 'ttcr',
                                    assign_date: new Date()
                                }
                            ],
                            acc_id: theStaff?.value,
                            full_name: theStaff?.option
                        }
                    ])
                    setCreated(true)
                }

            }).catch((error) => {
                setLoading('')
                setError(error?.message)
            })
        }
    }

    return (
        <div className="add-pro-accounts-div">
            {loading === 'fetch'
                ? <SpinWithMessage load height={'100px'} />
                : error
                    ? <>
                        <p className='error-text'>{error}</p>
                    </>
                    : <>
                        {verification?.primary_number
                            ? <>
                                <div className='listing'>
                                    <div className="item-div">
                                        <p>Primary number</p>
                                        {verification?.primary_number === 'ok'
                                            ? <FaCircleCheck />
                                            : <span>{verification?.primary_number}</span>}
                                    </div>
                                    <div className="item-div">
                                        <p>Whatsapp number</p>
                                        {verification?.whatsapp_number === 'ok'
                                            ? <FaCircleCheck />
                                            : <span>{verification?.whatsapp_number}</span>}
                                    </div>
                                    <div className="item-div">
                                        <p>Staff write access</p>
                                        {verification?.s_write_access === 'ok'
                                            ? <FaCircleCheck />
                                            : <span>{verification?.s_write_access}</span>}
                                    </div>
                                    <div className="item-div">
                                        <p>Employee type</p>
                                        {verification?.e_type === 'ok'
                                            ? <FaCircleCheck />
                                            : <span>{verification?.e_type}</span>}
                                    </div>
                                </div>
                                {created
                                    ? <AlertBox classNames={'alt-success'} messages={'This account convert to Pro account.'} />
                                    : <AlertBox classNames={'alt-warning'} messages={'The account not eligible for pro account.'} />}
                            </>
                            : <form>
                                <SelectInput label='Worker name' name='worker_id' values={list}
                                    firstOption={{ option: 'Select...', value: '' }} onChangeFun={handleChooseStaff} />
                            </form>}

                    </>}
        </div>
    )
}

export default AddProAccount