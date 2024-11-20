import React from 'react'
import { useFocusTrap } from '@mantine/hooks'
import { X } from 'lucide-react'

const Modal = ({
  isOpen,
  setOpen,
  title,
  children
}) => {

  const ref = useFocusTrap()

  return (
    isOpen && (      
      <div 
        ref={ref}
        className="fixed top-0 right-0 z-[999] h-screen w-screen bg-stone-950/40 flex items-center justify-center"
      >
        <div 
          className="w-[70rem] h-[48rem] rounded-xl bg-white flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
          
        >
          <div className="w-full 0 rounde-t-3xl flex items-center justify-between p-4">
            <h1 className="text-xl font-semibold ">{title}</h1>
            <button 
              className=""
              onClick={() => setOpen(false)}
            >
              <X className="w-7 h-7 stroke-rose-500" />
            </button>
          </div>
          <div className="flex flex-col w-full h-full overflow-y-scroll">
            {children}
          </div>
        </div>
      </div>
    )
  )
}

export default Modal