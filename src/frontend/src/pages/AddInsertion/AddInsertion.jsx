import React from 'react'
import CreateInsertionForm from "../../elements/CreateInsertionForm/CreateInsertionForm"
import Navbar from '../../elements/navbar/navbar'
import "./AddInsertion.scss"

const AddInsertion = () => {
  return (
    <div className='AddInsertion-wrapper'>
        <div className='Navbar-wrapper'>
            <Navbar/>   
        </div>
        <div className='CreateInsertion-wrapper'>
            <CreateInsertionForm/>
        </div>
        

    </div>
  )
}

export default AddInsertion