import React, { useEffect, useRef, useState } from 'react'
import './textInput.scss'
// eslint-disable-next-line
import { FiEdit2 } from 'react-icons/fi'
import { BsTrash3Fill, BsCheckLg } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'
import { adminAxios } from '../../../config/axios'
import { toast } from 'react-toastify'

function EditTextInput({ work, nowEdit, setNowEdit, setWorks }) {
    const textareaRef = useRef(null);
    const [text, setText] = useState(work?.work)

    const adjustTextareaHeight = () => {
        const { current } = textareaRef;

        if (current) {
            current.style.height = 'auto';
            current.style.height = (current?.scrollHeight + 7) + 'px';
        }
    };

    useEffect(() => {
        if (nowEdit === work?._id) {
            adjustTextareaHeight();
        }
        // eslint-disable-next-line
    }, [nowEdit])

    const handleChange = (e) => {
        setText(e.target.value)
        adjustTextareaHeight()
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (text.length >= 3) {
            adminAxios.put('/regular-work', { work_Id: work._id, work: text }).then((response) => {
                setWorks((state) => state.map((value) => {
                    if (value._id === work._id) {
                        return { ...value, work: text }
                    }
                    return value;
                }))
                setNowEdit('')
            }).catch((error) => {
                toast.error(error.response.data.message)
            })
        } else {
            toast.error('Must have 3 letters')
        }
    }

    const handleDelete = () => {
        const confirm = window.confirm('Are you delete this ?')
        if (confirm) {
            adminAxios.delete(`/regular-work/${work._id}`).then(() => {
                setWorks((state) => state.filter((value) => value._id !== work._id))
            })
        }
    }

// eslint-disable-next-line
    const handleEdit = () => {
        setNowEdit(work._id)
    }


    return (
        <div className='edit-text-input'>
            <form action="" onSubmit={handleSubmit}>
                <div>
                    <div className="item-div">
                        {nowEdit === work?._id ?
                            <textarea ref={textareaRef} className='text-input' name="" rows="1" id="" onChange={handleChange}
                                value={text}>
                            </textarea>
                            : <p className='text-input'>{work.work}</p>
                        }
                    </div>
                    <div className="actions">
                        {nowEdit === work?._id ? <>
                            <button type='button' onClick={() => setNowEdit('')} className='close'><IoMdClose /></button>
                            <button type='submit' className='add' ><BsCheckLg /></button>
                        </> : <>
                            {/* <button type='button' className='edit' onClick={handleEdit}><FiEdit2 /></button> */}
                            <button type='button' className='delete' onClick={handleDelete}><BsTrash3Fill /></button>
                        </>}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default EditTextInput