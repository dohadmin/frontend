import { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Sidebar from "../../components/admin/Sidebar";
import Header from '../../components/admin/Header';
import TrainingBranch from '../../components/admin/branch/TrainingBranch';
import AddNewTrainingForm from '../../components/admin/forms/AddNewTrainingForm';


const TrainingPage = () => {

  const [ activeBranch, setActiveBranch ] = useState("trainings");
  const [ isOpen, setOpen ] = useState(false);
  const [ selectedTraining, setSelectedTraining ] = useState(null);





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
          {activeBranch === "trainings" && <TrainingBranch setActiveBranch={setActiveBranch} setData={setSelectedTraining}/>}
          
        </div>
      </div>
    </div>
  );
};

export default TrainingPage;