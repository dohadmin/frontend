
import { useState } from "react"
import { useQuery } from "@tanstack/react-query";
import SchedulerHeader from "../scheduler/SchedulerHeader";
import SchedulerGrid from "../scheduler/SchedulerGrid";
import axios from "axios";
import useAccountStore from "../../../stores/trainer/AccountStore";
import Modal from "../../ui/Modal";
import AddNewTrainingForm from "../forms/AddNewTrainingForm";

const CalendarBranch = () => {
  const user = useAccountStore((state) => state.user);
  const [date, setDate] = useState(new Date());
  const [trainings, setTrainings] = useState([]);
  const [isOpen, setOpen] = useState(false);

  const { isLoading } = useQuery({
    queryKey: ["trainerTrainingsTableData"],
    queryFn: async () => {
      try {
        const response = await axios.get(`https://server-np0x.onrender.com/training/get-trainings-by-trainer/${user._id}`);        
        setTrainings(response.data);
        return response.data;
      } catch (error) {
        return [];
      }
    },
    cacheTime: 0,
  });

  

  if (isLoading) return <div>Loading...</div>

  return (
    <article
      className="w-full h-full flex flex-col items-start overflow-hidden"
    >
      <Modal
        isOpen={isOpen}
        setOpen={setOpen}
        title="Add New Training"
      >
        <AddNewTrainingForm setOpen={setOpen} />
      </Modal>
      <SchedulerHeader 
        date={date}
        setDate={setDate}
        setOpen={setOpen}
      />
      <section className="overflow-scroll flex w-full h-full">
        <SchedulerGrid 
          currentDate={date}
          trainings={trainings}
        />
      </section>
    </article>
  )
}

export default CalendarBranch