import React from 'react'
import Sidebar from '../../components/trainer/Sidebar'
import Header from '../../components/trainer/Header'
import CalendarBranch from '../../components/trainer/branch/CalendarBranch'

const CalendarPage = () => {
  return (
    <div className="w-screen h-screen flex items-start justify-center bg-white font-inter flex-grow-0">
      <Sidebar />
      {/* <Modal
        isOpen={isOpen}
        setOpen={setOpen}
        title="Request New Trainee"
      >
        <RequestNewTraineeForm setOpen={setOpen} />
      </Modal> */}
      <div className="w-full h-full flex flex-col overflow-hidden">
        {/* Header */}
        <Header name="Calendar" />
        <CalendarBranch />
      </div>
    </div>
  )
}

export default CalendarPage