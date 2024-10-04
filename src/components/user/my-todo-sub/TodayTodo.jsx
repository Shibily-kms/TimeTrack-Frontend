import React, { useEffect, useState } from 'react'
import './todo.scss'
import TodoItem from '../todo-item/TodoItem'
import { ttv2Axios } from '../../../config/axios'
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper'
import SpinWithMessage from '../../common/spinners/SpinWithMessage'
import { TbCheckbox } from 'react-icons/tb'
import SingleButton from '../../common/buttons/SingleButton'
import { FaPlus } from 'react-icons/fa6'


const TodayTodo = ({ inWork, allTodo, setAllTodo }) => {
    const [loading, setLoading] = useState('fetch')

    useEffect(() => {
        setLoading('fetch')
        ttv2Axios.get(`/todo/task?to_date=${YYYYMMDDFormat(new Date())}`).then((response) => {
            setAllTodo({
                overdue: response?.data?.overdue || [],
                update: response.data?.update || [],
                completed: []
            })
            setLoading('')
        })
    }, [])

    return (
        <div className="todo-list-sub-page-div">
            {loading === 'fetch'
                ? <SpinWithMessage load height={'400px'} />
                : <>
                    {allTodo?.overdue?.[0] && <div className="section-div">
                        <div className="heading">
                            <div className="left">
                                <h4>Overdue</h4>
                            </div>
                            <div className="right">
                                <p>{allTodo?.overdue?.length}</p>
                            </div>
                        </div>
                        <div className="list-border-div">
                            {allTodo?.overdue?.map((todo) => <TodoItem key={todo._id} data={todo} inWork={inWork} />)}
                        </div>
                    </div>}
                    {allTodo?.update?.[0] && <div className="section-div">
                        <div className="heading">
                            <div className="left">
                                <h4>Today</h4>
                            </div>
                            <div className="right">
                                <p>{allTodo?.update?.length}</p>
                            </div>
                        </div>
                        <div className="list-border-div">
                            {allTodo?.update?.map((todo) => <TodoItem key={todo._id} data={todo} inWork={inWork} />)}
                        </div>
                    </div>}
                    {allTodo?.completed?.[0] && <div className="section-div">
                        <div className="heading">
                            <div className="left">
                                <h4>Completed</h4>
                            </div>
                            <div className="right">
                                <p>{allTodo?.completed?.length}</p>
                            </div>
                        </div>
                        <div className="list-border-div">
                            {allTodo?.completed?.map((todo) => <TodoItem key={todo._id} data={todo} inWork={inWork} />)}
                        </div>
                    </div>}
                    {(allTodo?.overdue?.length + allTodo?.update?.length + allTodo?.completed?.length) < 1 &&
                        <SpinWithMessage icon={<TbCheckbox />} message='Add your today task using below button' height={'300px'}
                            bottomContent={<div style={{ display: 'flex', justifyContent: 'center' }}>
                                <SingleButton name={'New Task'} classNames={'btn-tertiary'} stIcon={<FaPlus />} />
                            </div>} />}
                </>}
        </div>
    )
}

export default TodayTodo