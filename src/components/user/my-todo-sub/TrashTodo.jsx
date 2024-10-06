import React, { useEffect, useState } from 'react'
import './todo.scss'
import TodoItem from '../todo-item/TodoItem'
import { ttv2Axios } from '../../../config/axios'
import SpinWithMessage from '../../common/spinners/SpinWithMessage'
import { removedTodoCategories } from '../../../assets/javascript/todo-helpers'
import { FcEmptyTrash } from 'react-icons/fc'


const TrashTodo = ({ inWork, allTodo, setAllTodo, newTaskFn }) => {
    const [loading, setLoading] = useState('fetch')
    const [todoList, setTodoList] = useState([])

    useEffect(() => {
        setLoading('fetch')
        ttv2Axios.get(`/todo/task/removed`).then((response) => {
            setAllTodo(response?.data)
            setLoading('')
        })
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        setTodoList(removedTodoCategories(allTodo))
    }, [allTodo])

    return (
        <div className="todo-list-sub-page-div">
            {loading === 'fetch'
                ? <SpinWithMessage load height={'400px'} />
                : <>
                    {todoList?.[0] && allTodo?.[0] && <div className="section-div">
                        <div className="heading">
                            <div className="left">
                                <h4>Trash</h4>
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
                        <SpinWithMessage icon={<FcEmptyTrash />} message='Trash can is tidy' height={'300px'} />}
                </>}
        </div>
    )
}

export default TrashTodo