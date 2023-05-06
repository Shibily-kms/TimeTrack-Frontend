import React, { useEffect, useState } from 'react'
import './add-designation.scss';
import { adminAxios } from '../../../config/axios';
import { useNavigate } from 'react-router-dom';


function Select_designation({ setModel }) {
    const [designations, setDesignations] = useState([])
    const [selected, setSelected] = useState({})
    const navigate = useNavigate()
    const handleChange = (e) => {
        setSelected(designations.filter((value) => value._id === e.target.value)[0])
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(selected?.name){
            navigate('/admin/add-work', { state: selected })
            setModel(null)
        }
    }

    useEffect(() => {
        adminAxios.get('/designations').then((response) => {
            setDesignations(response.data.designations)
        })
    }, [])
    return (
        <div className='add-design'>
            <div className="inputs">
                <form onSubmit={handleSubmit}>
                    <div className="input-div">
                        <label htmlFor="designation">Designations</label>
                        <select name='designation' id='designation' onChange={handleChange} >
                            <option>Select...</option>
                            {designations.map((value, index) => {
                                return <option key={index} value={value._id}>{value.designation}</option>
                            })}

                        </select>
                    </div>
                    <div className="button-div">
                        <button type='submit'>Select</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Select_designation