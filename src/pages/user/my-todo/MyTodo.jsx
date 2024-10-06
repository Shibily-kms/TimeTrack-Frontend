import React, { useState } from 'react'
import './my-todo.scss'
import { ttv2Axios } from '../../../config/axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from '../../../redux/features/user/systemSlice'
import SingleButton from '../../../components/common/buttons/SingleButton'
import TodayTodo from '../../../components/user/my-todo-sub/TodayTodo'
import { FaPlus } from 'react-icons/fa6'
import Modal from '../../../components/common/modal/Modal'
import AddEditTodo from '../../../components/user/add-edit-todo/AddEditTodo'
import SevenDays from '../../../components/user/my-todo-sub/SevenDays'
import AllTodo from '../../../components/user/my-todo-sub/AllTodo'
import { AiOutlineClear } from 'react-icons/ai'
import TrashTodo from '../../../components/user/my-todo-sub/TrashTodo'


function Work_details({ setPageHead }) {
  const { workDetails } = useSelector((state) => state.workData)
  const { user } = useSelector((state) => state.userAuth)
  const [inWork, setInWork] = useState(false)
  const [activeTab, setActiveTab] = useState('today')
  const [allTodo, setAllTodo] = useState([])
  const [modal, setModal] = useState({ state: false })
  const dispatch = useDispatch()
  const { internet } = useSelector((state) => state.systemInfo)

  useEffect(() => {
    setPageHead({ title: 'My Todo' })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const lastPunchData = workDetails?.punch_list?.[workDetails?.punch_list.length - 1] || {}
    if (lastPunchData?.in && !lastPunchData?.out) {
      setInWork(true)
    }

    // eslint-disable-next-line
  }, [workDetails])

  const openNewTaskModal = (updateData) => {
    setModal({
      status: true,
      title: updateData ? 'Task' : 'New Task',
      content: <AddEditTodo setModal={setModal} staff_id={user?.acc_id} setData={setAllTodo}
        updateData={updateData} withData={updateData ? true : false} inWork={inWork} />
    })
  }

  const handleErase = () => {

    const ask = window.confirm('Are you delete permanently ?')
    if (ask) {
      if (internet) {
        ttv2Axios.delete(`/todo/task/erase`).then(() => {
          setAllTodo([])
        }).catch((error) => {
          dispatch(toast.push.error({ message: error.message }))
        })
      } else {
        dispatch(toast.push.error({ message: 'Network is low' }))
      }
    }

  }


  return (
    <div className='my-todo-page-div'>
      <Modal modal={modal} setModal={setModal} />
      <div className="sub-menu-div">
        <SingleButton name={'Today'} classNames={activeTab === 'today' ? 'sm btn-tertiary' : 'sm btn-primary'}
          onClick={() => setActiveTab('today')} />
        <SingleButton name={'Next 7 Days'} classNames={activeTab === 'nextSeven' ? 'sm btn-tertiary' : 'sm btn-primary'}
          onClick={() => setActiveTab('nextSeven')} />
        <SingleButton name={'All ToDo'} classNames={activeTab === 'all' ? 'sm btn-tertiary' : 'sm btn-primary'}
          onClick={() => setActiveTab('all')} />
        <SingleButton name={'Trash'} classNames={activeTab === 'trash' ? 'sm btn-danger' : 'sm btn-gray'}
          onClick={() => setActiveTab('trash')} />
      </div>


      <div className="sub-components-div">
        {activeTab === 'today' && <TodayTodo inWork={inWork} allTodo={allTodo} setAllTodo={setAllTodo} newTaskFn={openNewTaskModal} />}
        {activeTab === 'nextSeven' && <SevenDays inWork={inWork} allTodo={allTodo} setAllTodo={setAllTodo} newTaskFn={openNewTaskModal} />}
        {activeTab === 'all' && <AllTodo inWork={inWork} allTodo={allTodo} setAllTodo={setAllTodo} newTaskFn={openNewTaskModal} />}
        {activeTab === 'trash' && <TrashTodo inWork={inWork} allTodo={allTodo} setAllTodo={setAllTodo} newTaskFn={openNewTaskModal} />}
      </div>

      {allTodo?.[0] && <div className="app-icon-div">
        {activeTab !== 'trash' && <SingleButton title={'Add to todo'} stIcon={<FaPlus />} classNames={'icon-only btn-tertiary'}
          style={{ padding: '15px', fontSize: '25px', borderRadius: '100px' }} onClick={() => openNewTaskModal()} />}
        {activeTab === 'trash' && <SingleButton title={'Permanently delete'} stIcon={<AiOutlineClear />} classNames={'icon-only btn-danger'}
          style={{ padding: '15px', fontSize: '25px', borderRadius: '100px' }} onClick={handleErase} />}
      </div>}
    </div>
  )
}

export default Work_details