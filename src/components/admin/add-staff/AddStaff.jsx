import React, { useEffect, useState } from 'react'
import './add-staff.scss'
import { adminAxios } from '../../../config/axios'
import { toast } from 'react-hot-toast'
import { RxEyeClosed, RxEyeOpen } from 'react-icons/rx';
import { BiLoaderAlt } from 'react-icons/bi'
import { FaInfo } from 'react-icons/fa'

function AddStaff({ closeModel, setData, password, setPassword }) {
    const [form, setFrom] = useState({
        first_name: null, last_name: null, email_id: null, contact: null,
        designation: null, dob: null, place: null, pin_code: null
    })
    const [designations, setDesignations] = useState([])
    const [loading, setLoading] = useState('')
    const [show, setShow] = useState(false)
    const [text, setText] = useState('Copy Now')


    const handleChange = (e) => {
        setFrom({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading('submit')
        if (form.first_name[0] === ' ' || form.last_name[0] === ' ' || form.place[0] === ' ') {
            toast.error('Space is not accepted as the first character')
            setLoading('')
            return
        }
        adminAxios.post('/staff', form).then((response) => {
            toast.success('Success, Now copy password ')
            setData((state) => [...state, response.data.data])
            setPassword((state) => ({ ...state, text: response.data.data.password }))
            setLoading('')
        }).catch((error) => {
            toast.error(error.response.data.message)
            setLoading('')
        })
    }

    const handleCopy = () => {
        if (password) {
            navigator.clipboard.writeText(password)
                .then(() => {
                    setText('Copied!');
                    setPassword((state) => ({ ...state, copied: true }))
                    setTimeout(() => setText('Copy'), 5000);
                })
                .catch(() => toast.error('Try now !'));
        }
    }

    useEffect(() => {
        setLoading('getDesignation')
        adminAxios.get('/designations').then((response) => {
            setLoading('')
            setDesignations(response.data?.data || [])
        }).catch((error) => {
            toast.error(error.response.data.message)
        })
        // eslint-disable-next-line
    }, [])

    return (
        <div className='add-staff-div'>
            <div className="boarder">
                {password ?
                    <div className="copy-div">
                        <div>
                            <div className="sections">
                                <div className='info'>
                                    <p><FaInfo /> Save the password to a notepad</p>
                                </div>
                                <div className="text-input-div">
                                    <input type={show ? 'text' : 'password'} id='password' value={password} required />
                                    <label htmlFor="password">Password</label>
                                    <div className="icon" onClick={() => setShow(!show)}>
                                        {show ? <RxEyeOpen /> : <RxEyeClosed />}
                                    </div>
                                </div>
                            </div>
                            <div className="actions">
                                <button type='button' onClick={handleCopy}>{text}</button>
                                <button type='button' onClick={() => closeModel()}>Close</button>
                            </div>
                        </div>
                    </div>
                    : <form action="" onSubmit={handleSubmit}>
                        <div className="sections">
                            <div className="text-input-div">
                                <input type="text" id='first_name' name='first_name' value={form?.first_name} required onChange={handleChange} />
                                <label htmlFor="first_name">First name</label>
                            </div>
                            <div className="text-input-div">
                                <input type="text" id='last_name' name='last_name' value={form?.last_name} required onChange={handleChange} />
                                <label htmlFor="last_name">Last name</label>
                            </div>
                            <div className="text-input-div">
                                <input type="email" id='email_id' name='email_id' value={form?.email_id} required onChange={handleChange} />
                                <label htmlFor="email_id">Email Address</label>
                            </div>
                            <div className="text-input-div">
                                <input type="number" id='contact' name='contact' value={form?.contact} required onChange={handleChange} />
                                <label htmlFor="contact">Mobile no</label>
                            </div>
                            <div className="text-input-div">
                                <select id="designation" name="designation" required onChange={handleChange}>
                                    <option value={''}>{designations?.[0] ? "Choose" : 'Loading...'}</option>
                                    {designations.map((option, index) => {
                                        return <option key={index} value={option._id} >{option.designation}</option>
                                    })}

                                </select>
                                <label htmlFor="designation">Designation</label>
                            </div>
                            <div className="text-input-div">
                                <input type="date" id='dob' name='dob' max={`${new Date().getFullYear() - 18}-12-31`} value={form?.dob} required onChange={handleChange} />
                                <label htmlFor="dob">Date of Birth</label>
                            </div>
                            <div className="text-input-div">
                                <input type="text" id='place' name='place' value={form?.place} required onChange={handleChange} />
                                <label htmlFor="place">Place</label>
                            </div>
                            <div className="text-input-div">
                                <input type="number" id='pin_code' name='pin_code' value={form?.pin_code} required onChange={handleChange} />
                                <label htmlFor="pin_code">Pin code</label>
                            </div>
                        </div>
                        <div className="actions">
                            <button type={loading === 'submit' ? 'button' : 'submit'} >
                                {loading === 'submit' ? <span className='loading-icon'><BiLoaderAlt /></span> : 'Submit'}</button>
                        </div>
                    </form>}
            </div>
        </div>
    )
}

export default AddStaff