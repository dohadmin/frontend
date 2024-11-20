import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Sidebar from "../../components/trainer/Sidebar";
import Header from '../../components/trainer/Header';
import AddNewTrainingForm from '../../components/trainer/forms/AddNewTrainingForm';
import TrainingBranch from '../../components/trainer/branch/TrainingBranch';


const TrainerTrainingPage = () => {

  const [ isOpen, setOpen ] = useState(false);





  return (
    <div className="w-full h-full flex items-start justify-center bg-white font-inter flex-grow-0">
      <Sidebar />
      
      <Modal
        isOpen={isOpen}
        setOpen={setOpen}
        title="Add New Training"
      >
        <AddNewTrainingForm setOpen={setOpen} />
      </Modal>
      <div className="w-full h-full flex flex-col overflow-hidden">
        {/* Header */}
        <Header name="Trainings" />

        <div className="flex items-center justify-between h-20 border-b border-stone-200">
          <div>

          </div>
          <Button 
            onClick={() => setOpen(true)}
            className="w-fit px-4 flex items-center justify-center mr-4 text-sm"
          
          >
            Add New Training
          </Button>
        </div>


        {/* Table */}
        <div className="w-full h-full flex flex-col overflow-hidden">
          <TrainingBranch />
        </div>
      </div>
    </div>
  );
};

export default TrainerTrainingPage;

