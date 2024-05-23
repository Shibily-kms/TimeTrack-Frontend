import React from 'react'
import './style.scss'
import AlertBar from './AlertBar'
import { useSelector } from 'react-redux'
import { MdCloudSync } from "react-icons/md";


const ToasterB = () => {
  const { alerts } = useSelector((state) => state.systemInfo)


  const iconMap = {
    MdCloudSync: <MdCloudSync />
  };


  return (
    <div className='toaster-b-div'>
      {alerts?.map((alert) => <AlertBar key={alert.id}
        type={alert?.type}
        message={alert?.message}
        id={alert?.id}
        icon={alert?.icon ? iconMap[alert?.icon] : null}
        doClose={alert?.doClose}
        autoClose={alert?.autoClose}
      />)}
    </div>
  )
}

export default ToasterB