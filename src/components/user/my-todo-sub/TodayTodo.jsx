import React, { useEffect, useState } from 'react'
import './todo.scss'
import TodoItem from '../todo-item/TodoItem'
import { ttSv2Axios } from '../../../config/axios'
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper'
import SpinWithMessage from '../../common/spinners/SpinWithMessage'
import { TbCheckbox } from 'react-icons/tb'
import SingleButton from '../../common/buttons/SingleButton'
import { FaPlus } from 'react-icons/fa6'
import { todayDataCategories } from '../../../assets/javascript/todo-helpers'


const TodayTodo = ({ inWork, allTodo, setAllTodo, newTaskFn }) => {
    const [loading, setLoading] = useState('fetch')
    const [todoList, setTodoList] = useState([])

    useEffect(() => {
        setLoading('fetch')
        ttSv2Axios.get(`/todo/task?to_date=${YYYYMMDDFormat(new Date())}`).then((response) => {
            ttSv2Axios.get(`/todo/task/completed?from_date=${YYYYMMDDFormat(new Date())}&to_date=${YYYYMMDDFormat(new Date())}`).then((result) => {
                setAllTodo([
                    ...(response?.data?.overdue || []),
                    ...(response?.data?.update || []),
                    ...(result?.data?.completed || []),
                    ...(result?.data?.wontDo || []),
                ])
                setLoading('')
            })
        })
        
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        const todayData = todayDataCategories(allTodo || [])
        setTodoList(todayData)
    }, [allTodo])

    return (
        <div className="todo-list-sub-page-div">
            {loading === 'fetch'
                ? <SpinWithMessage load height={'300px'} />
                : <>
                    {todoList?.overdue?.[0] && allTodo?.[0] && <div className="section-div">
                        <div className="heading">
                            <div className="left">
                                <h4>Overdue</h4>
                            </div>
                            <div className="right">
                                <p>{todoList?.overdue?.length}</p>
                            </div>
                        </div>
                        <div className="list-border-div">
                            {todoList?.overdue?.map((todo) => <TodoItem key={todo._id} data={todo} inWork={inWork} newTaskFn={newTaskFn}
                                setAllTodo={setAllTodo} />)}
                        </div>
                    </div>}
                    {todoList?.update?.[0] && allTodo?.[0] && <div className="section-div">
                        <div className="heading">
                            <div className="left">
                                <h4>Today</h4>
                            </div>
                            <div className="right">
                                <p>{todoList?.update?.length}</p>
                            </div>
                        </div>
                        <div className="list-border-div">
                            {todoList?.update?.map((todo) => <TodoItem key={todo._id} data={todo} inWork={inWork} newTaskFn={newTaskFn}
                                setAllTodo={setAllTodo} />)}
                        </div>
                    </div>}
                    {todoList?.completed?.[0] && allTodo?.[0] && <div className="section-div">
                        <div className="heading">
                            <div className="left">
                                <h4>Completed</h4>
                            </div>
                            <div className="right">
                                <p>{todoList?.completed?.length}</p>
                            </div>
                        </div>
                        <div className="list-border-div">
                            {todoList?.completed?.map((todo) => <TodoItem key={todo._id} data={todo} inWork={inWork} newTaskFn={newTaskFn}
                                setAllTodo={setAllTodo} />)}
                        </div>
                    </div>}
                    {!allTodo?.[0] &&
                        <SpinWithMessage icon={<TbCheckbox />} message='Add your today task using below button' height={'300px'}
                            bottomContent={<div style={{ display: 'flex', justifyContent: 'center' }}>
                                <SingleButton name={'New Task'} classNames={'btn-tertiary'} stIcon={<FaPlus />} onClick={() => newTaskFn()} />
                            </div>} />}
                </>}
        </div>
    )
}

export default TodayTodo