import React from 'react'
import AlertBar from './AlertBar'
import { useSelector } from 'react-redux'
import './style.scss'


const ToasterB = () => {
  const { alerts } = useSelector((state) => state.systemInfo)




  return (
    <div className='toaster-b-div'>
      {alerts?.map((alert) => <AlertBar key={alert.id}
        type={alert.type}
        message={alert.message}
        id={alert.id}
        icon={alert.icon}
        doClose={alert.doClose}
        autoClose={alert.autoClose}
      />)}
    </div>
  )
}

export default ToasterB