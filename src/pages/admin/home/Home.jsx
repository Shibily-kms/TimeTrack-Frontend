import React from 'react'
import Header from '../../../components/admin/header/Header'
import First_page from '../../../components/admin/first-page/First_page'

function Home() {
  return (
    <div>
      <div className="header-div">
        <Header />
      </div>
      <div className="first-page-div">
        <First_page />
      </div>
    </div>
  )
}

export default Home