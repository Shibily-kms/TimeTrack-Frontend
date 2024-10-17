import React, { useEffect, useState } from 'react'
import './todo.scss'
import TodoItem from '../todo-item/TodoItem'
import { ttSv2Axios } from '../../../config/axios'
import SpinWithMessage from '../../common/spinners/SpinWithMessage'
import { TbCheckbox } from 'react-icons/tb'
import SingleButton from '../../common/buttons/SingleButton'
import { FaPlus } from 'react-icons/fa6'
import { allTodoCategories } from '../../../assets/javascript/todo-helpers'


const AllTodo = ({ inWork, allTodo, setAllTodo, newTaskFn }) => {
    const [loading, setLoading] = useState('fetch')
    const [todoList, setTodoList] = useState([])

    useEffect(() => {
        setLoading('fetch')
        ttSv2Axios.get(`/todo/task`).then((response) => {
            setAllTodo([
                ...(response?.data?.overdue || []),
                ...(response?.data?.update || [])
            ])
            setLoading('')
        })

        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        setTodoList(allTodoCategories(allTodo))
    }, [allTodo])

    return (
        <div className="todo-list-sub-page-div">
            {loading === 'fetch'
                ? <SpinWithMessage load height={'300px'} />
                : <>
                    {todoList?.[0] && allTodo?.[0] && <div className="section-div">
                        <div className="heading">
                            <div className="left">
                                <h4>All Todo</h4>
                            </div>
                            <div className="right">
                                <p>{todoList?.length}</p>
                            </div>
                        </div>
                        <div className="list-border-div">
                            {todoList?.map((todo) => <TodoItem key={todo._id} data={todo} inWork={inWork} newTaskFn={newTaskFn}
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

export default AllTodo