import { useState } from "react";
import DeleteModal from "../../ui/DeleteModal";
import Modal from "../../ui/Modal";
import EditTrainingForm from "../forms/EditTrainingForm";
import ViewTrainingForm from "../forms/ViewTrainingForm";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const isToday = (date) => {
  const currentDate = new Date();
  const createdAtDate = new Date(date);
  return currentDate.toDateString() === createdAtDate.toDateString();
}
const generateDates = (currentDate) => {
  const date = currentDate ? new Date(currentDate) : new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Find the Monday that starts the week of the first day of the month
  const startDay = firstDayOfMonth.getDay(); // Get the day of the week (0 = Sunday, 6 = Saturday)
  const adjustment = startDay === 0 ? -6 : 1 - startDay; // Adjust to get the previous Monday
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() + adjustment);

  // Find the Sunday that ends the week of the last day of the month
  const endDay = lastDayOfMonth.getDay(); // Get the day of the week (0 = Sunday, 6 = Saturday)
  const endAdjustment = endDay === 0 ? 0 : 7 - endDay; // Adjust to get the next Sunday
  const endDate = new Date(lastDayOfMonth);
  endDate.setDate(endDate.getDate() + endAdjustment);

  // Generate dates
  const dates = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    d.setHours(0, 0, 0, 0); // Set time to 00:00:00
    dates.push(new Date(d));
  }

  // Split dates into weeks
  const weeks = [];
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }

  return weeks.flat();
};
const generateWeekDates = (currentDate)=> {
  const startOfWeek = new Date(currentDate);
  const day = startOfWeek.getDay(); // Get the day of the week (0 - Sunday, 6 - Saturday)
  
  // Adjust to start from Monday
  const diff = day === 0 ? -6 : 1 - day; // If Sunday (0), move back 6 days; otherwise, calculate from Monday
  startOfWeek.setDate(startOfWeek.getDate() + diff);
  
  const weekDates = [];
  
  // Populate the array with dates from Monday to Sunday
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDates.push(date);
  }
  
  return weekDates;
};



const SchedulerGrid = ({
  currentDate,
  trainings,
}) => {

  const queryClient = useQueryClient();
  const [ selectedTraining, setSelectedTraining ] = useState(null);
  const [ isEditOpen, setEditOpen ] = useState(false);
  const [ isViewOpen, setViewOpen ] = useState(false);
  const [ isDeleteOpen, setDeleteOpen ] = useState(false);

  const allDates = generateDates(currentDate);
  const dates = generateWeekDates(currentDate);


  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`https://server-np0x.onrender.com/training/delete-training/${selectedTraining._id}`);
      queryClient.invalidateQueries({ queryKey: ["trainerTrainingsTableData"] });
      toast.success(`${selectedTraining.title} has been deleted`);
      setDeleteOpen(false);
    } catch (error) {
      console.log(error);
    }
  };





  return (
    <article className="flex flex-col h-fit relative">
      {selectedTraining && (
        <Modal
          isOpen={isEditOpen}
          setOpen={setEditOpen}
          title={"Update " + selectedTraining.title}
        >
          <EditTrainingForm selectedTraining={selectedTraining}  setOpen={setEditOpen} />
        </Modal>
      )} 
      {selectedTraining && (
        <Modal
          isOpen={isViewOpen}
          setOpen={setViewOpen}
          title={"View " + selectedTraining.title}
        >
          <ViewTrainingForm selectedTraining={selectedTraining} />
        </Modal>
      )}
      {selectedTraining && (
        <DeleteModal
          isOpen={isDeleteOpen}
          setOpen={setDeleteOpen}
          title={"Delete Training"}
          subtitle={"Are you sure you want to delete " + selectedTraining.title + "'s account? This action cannot be undone."}
          onDelete={handleConfirmDelete}
        />
      )}
      <section 
        style={{gridTemplateColumns: `repeat(7, 16rem)`}}
        className="h-16 grid grid-flow-col sticky top-0 flex-shrink-0 z-50 bg-white"
        >
        {dates.map((date, index) => {
          const today = isToday(date)

          return (
            <div 
              key={index} 
              className={`
                w-full h-full border-r border-b border-gray-200 flex items-center justify-center
              `}
            >
              <span className={`ml-1 text-sm font-medium  uppercase 
                ${today ? "  text-amber-500 font-medium " : " text-gray-500 "}  
              `}>
                {date.toLocaleDateString('en-US', { weekday: 'short' })}                    
              </span>

            </div>
          )}
          )
        }
      </section>


      <section 
        className={`w-fit h-fit grid `}
        style={{ gridTemplateColumns: `repeat(7, 1fr)` }}
      >
        {allDates.map((date, day) => {
          const isIncludedInCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isToday = date.toDateString() === new Date().toDateString();

          
          const trainingsForDay = trainings.filter((training) => {
            const trainingDate = new Date(training.date);
            return trainingDate.toDateString() === date.toDateString();
          })


          return (
            trainingsForDay.length > 0 ? (
              <div 
                className="flex items-center justify-center h-full gap-2 border-r border-b p-4"
                key={day} 

              >
                {trainingsForDay.map((training) => (
                  <button
                    key={training._id}
                    className={`ring-1 rounded-lg p-4 w-full  h-full flex flex-col justify-between relative
                      ${training.status === 'on hold' ? 'ring-amber-200 bg-amber-50' :
                        training.status === 'released' ? 'ring-green-200 bg-green-50' :
                        training.status === 'declined' ? 'ring-rose-200 bg-rose-50' :
                        'ring-red-200'
                      }
                      `}
                    onClick={() => {
                      (training.status === 'released' || training.status === 'declined') ? setViewOpen(true) : setEditOpen(true)
                      setSelectedTraining(training)
                    }}
                  >
                    <div className="flex flex-col">
                      {/* Title */}
                      <h3 className="text-lg font-semibold text-gray-800 w-full text-start">{training.title}</h3>
                      
                      {/* Description */}
                      <p className="text-sm text-gray-600 mt-1 w-full text-start">{training.description}</p>
            
                      {/* Date */}
                      <p className="text-xs text-gray-500 mt-2 w-full text-start">
                        {new Date(training.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </p>
            
                      {/* Status */}
                      <span
                        className={`text-xs font-semibold rounded-full mt-20 uppercase w-fit
                        ${training.status === 'on hold' ? 'bg-amber-50 text-amber-500' : 
                          training.status === 'released' ? 'bg-green-50 text-green-500' :
                          training.status === 'declined' ? 'bg-rose-50 text-rose-500' :
                          'bg-red-200 text-red-800'}
                        `}
                      >
                        {training.status}
                      </span>
                    </div>
                    
                  </button>
                ))}
              </div>
            ) : (
              <div
                key={day}
                className={`border-r border-b relative border-gray-200 p-2 w-[16rem] h-60 text-center flex-shrink-0  overflow-hidden
                  ${!isIncludedInCurrentMonth ? "bg-gray-100" : "bg-white"}
                `}
              >
   
                
                <div className="flex flex-col justify-end h-full items-end gap-2">
                  <span 
                    className={`text-base font-medium absolute bottom-2 right-2 rounded-full p-1 w-7 h-7 flex items-center justify-center
                      ${!isIncludedInCurrentMonth ? "text-gray-500" : "text-gray-700"}
                      ${isToday && " bg-amber-500 rounded-full text-white  "}
                    `}
                  >
                    {date.getDate()}
                  </span>
                </div>
              </div>
            )
          );
        })}
      </section>
    </article>
  );

};

export default SchedulerGrid
