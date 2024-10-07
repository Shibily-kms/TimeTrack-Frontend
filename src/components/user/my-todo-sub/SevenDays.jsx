import React, { useEffect, useState } from 'react'
import './todo.scss'
import TodoItem from '../todo-item/TodoItem'
import { ttSv2Axios } from '../../../config/axios'
import { formateDateToDayText, YYYYMMDDFormat } from '../../../assets/javascript/date-helper'
import SpinWithMessage from '../../common/spinners/SpinWithMessage'
import { TbCheckbox } from 'react-icons/tb'
import SingleButton from '../../common/buttons/SingleButton'
import { FaPlus } from 'react-icons/fa6'
import { nextSevenDayDataCategories } from '../../../assets/javascript/todo-helpers'


const SevenDays = ({ inWork, allTodo, setAllTodo, newTaskFn }) => {
    const [loading, setLoading] = useState('fetch')
    const [todoList, setTodoList] = useState([])

    useEffect(() => {
        setLoading('fetch')
        const after7DaysDate = new Date(new Date().setDate(new Date().getDate() + 6))
       
        ttSv2Axios.get(`/todo/task?to_date=${YYYYMMDDFormat(after7DaysDate)}`).then((response) => {
            ttSv2Axios.get(`/todo/task/completed?from_date=${YYYYMMDDFormat(new Date())}&to_date=${YYYYMMDDFormat(after7DaysDate)}`).then((result) => {
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
        const dataCategory = nextSevenDayDataCategories(allTodo || [])
        setTodoList(dataCategory)
    }, [allTodo])

    return (
        <div className="todo-list-sub-page-div">
            {loading === 'fetch'
                ? <SpinWithMessage load height={'400px'} />
                : <>
                    {[...Array(7)].map((_, dayOffset) => {
                        const currentDate = new Date();
                        const futureDate = new Date(currentDate.setDate(currentDate.getDate() + dayOffset));
                        const formattedDate = YYYYMMDDFormat(futureDate);
                        const todoForDate = todoList?.[formattedDate];

                        if (!todoForDate?.length || !allTodo?.[0]) return null;

                        return (
                            <div className="section-div" key={formattedDate}>
                                <div className="heading">
                                    <div className="left">
                                        <h4>{formateDateToDayText(new Date(formattedDate))}</h4>
                                    </div>
                                    <div className="right">
                                        <p>{todoForDate.length}</p>
                                    </div>
                                </div>
                                <div className="list-border-div">
                                    {todoForDate.map((todo) => (
                                        <TodoItem
                                            key={todo._id}
                                            data={todo}
                                            inWork={inWork}
                                            newTaskFn={newTaskFn}
                                            setAllTodo={setAllTodo}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                    {/* {todoList?.[YYYYMMDDFormat(new Date())]?.[0] && allTodo?.[0] && <div className="section-div">
                        <div className="heading">
                            <div className="left">
                                <h4>{YYYYMMDDFormat(new Date())}</h4>
                            </div>
                            <div className="right">
                                <p>{todoList?.[YYYYMMDDFormat(new Date())]?.length}</p>
                            </div>
                        </div>
                        <div className="list-border-div">
                            {todoList?.[YYYYMMDDFormat(new Date())]?.map((todo) => <TodoItem key={todo._id} data={todo} inWork={inWork} newTaskFn={newTaskFn}
                                setAllTodo={setAllTodo} />)}
                        </div>
                    </div>} */}


                    {/* Completed */}
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

export default SevenDays