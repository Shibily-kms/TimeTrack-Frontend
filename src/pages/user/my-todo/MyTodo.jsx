import React, { useState } from 'react'
import './my-todo.scss'
import { userAxios } from '../../../config/axios'
import Work from '../../../components/user/my-todo-sub/Work'
import WorkDetails from '../../../components/user/semi-work-details/WorkDetails'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPunchDetails } from '../../../redux/features/user/workdataSlice'
import { setRegularWork } from '../../../redux/features/user/dayWorksSlice'
import { toast } from '../../../redux/features/user/systemSlice'
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper'
import SingleButton from '../../../components/common/buttons/SingleButton'
import TodayTodo from '../../../components/user/my-todo-sub/TodayTodo'
import { FaPlus } from 'react-icons/fa6'
import { GoTrash } from 'react-icons/go'


function Work_details({ setPageHead }) {
  const { workDetails } = useSelector((state) => state.workData)
  const [inWork, setInWork] = useState(false)
  const [activeTab, setActiveTab] = useState('today')
  const [allTodo, setAllTodo] = useState([])
  const [todoNumber, setTodoNumber] = useState(0)

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

  useEffect(() => {
    const totalLength = Object.values(allTodo).reduce((acc, arr) => acc + arr.length, 0);
    setTodoNumber(totalLength)
  }, [allTodo])

  const openNewTaskModal = () => {
    
  }


  return (
    <div className='my-todo-page-div'>
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
        {activeTab === 'today' && <TodayTodo inWork={inWork} allTodo={allTodo} setAllTodo={setAllTodo} />}
      </div>

      {todoNumber > 0 && <div className="app-icon-div">
        {activeTab !== 'trash' && <SingleButton title={'Add to todo'} stIcon={<FaPlus />} classNames={'icon-only btn-tertiary'}
          style={{ padding: '15px', fontSize: '25px', borderRadius: '100px' }} onClick={openNewTaskModal} />}
        {activeTab === 'trash' && <SingleButton title={'Permanently delete'} stIcon={<GoTrash />} classNames={'icon-only btn-danger'}
          style={{ padding: '15px', fontSize: '25px', borderRadius: '100px' }} />}
      </div>}
    </div>
  )
}

export default Work_details