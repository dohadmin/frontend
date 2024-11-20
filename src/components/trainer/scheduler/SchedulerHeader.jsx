import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../ui/Button';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const SchedulerHeader = ({
  date,
  setDate,
  setOpen
}) => {



  const handlePreviousDate = () => {
    const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
    setDate(newDate);
  }

  const handleNextDate = () => {
    const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    setDate(newDate);
  }




  return (
    <article className="sticky top-0 h-20 z-5 w-full flex items-center justify-between gap-2 p-6 bg-white border-b border-ring-200">

      <section className="w-fit flex items-center justify-between gap-4 ">
        <button className="text-gray-950 ring-1 rounded-md ring-gray-200 p-1" onClick={handlePreviousDate}>
          <ChevronLeft className="stroke-2 stroke-gray-500 "/>
        </button>
        <input
          type="date"
          className="w-full ring-1 rounded-md h-10 px-4 outline-none ring-gray-200 placeholder:text-sm text-smplaceholder:text-gray-500 text-gray-700 focus:outline-none focus:ring-2"
          onChange={(e) => setDate(new Date(e.target.value))}
          value={formatDate(date)}
        />
        <button className="text-gray-950 ring-1 rounded-md ring-gray-300 p-1" onClick={handleNextDate}>
          <ChevronRight className="stroke-2 stroke-gray-500 "/>
        </button>
      </section>

      <section className="w-fit flex items-center justify-end gap-4 ">
        <Button  
          className="px-4"
          onClick={() => setOpen(true)}
        >
          Create Training
        </Button>
      </section>
      
    </article>
  )
}

export default SchedulerHeader