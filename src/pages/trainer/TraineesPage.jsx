import { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Sidebar from "../../components/trainer/Sidebar";
import Header from '../../components/trainer/Header';
import RequestNewTraineeForm from '../../components/trainer/forms/RequestNewTraineeForm';
import RequestBranch from '../../components/trainer/branch/RequestBranch';
import TraineeBranch from '../../components/trainer/branch/TraineeBranch';
import ViewTraineeBranch from '../../components/trainer/branch/ViewTraineeBranch';


const TraineesPage = () => {
  const [ selectedTrainee, setSelectedTrainee ] = useState(null);

  const [ activeBranch, setActiveBranch ] = useState("active");
  const [ isOpen, setOpen ] = useState(false);


  return (
    <div className="w-screen h-screen flex items-start justify-center bg-white font-inter flex-grow-0">
      <Sidebar />
      <Modal
        isOpen={isOpen}
        setOpen={setOpen}
        title="Request New Trainee"
      >
        <RequestNewTraineeForm setOpen={setOpen} />
      </Modal>
      <div className="w-full h-full flex flex-col overflow-hidden">
        {/* Header */}
        <Header name="Trainees" />

        <div className="flex items-center justify-between h-20 border-b border-stone-200">
          <div className="flex items-center">
            <div className="flex items-center">
              <button 
                className={`h-full flex items-center w-24 justify-center p-1 text-base
                  ${activeBranch === "active" ? "text-amber-500 font-semibold" : " text-gray-500 "}
                `}
                onClick={() => setActiveBranch("active")}
              >
                Active
              </button>
              <button 
                className={`h-full flex items-center w-24 justify-center p-1 text-base
                  ${activeBranch === "requests" ? "text-amber-500 font-semibold" : " text-gray-500 "}
                `}
                onClick={() => setActiveBranch("requests")}
              >
                Requests
              </button>
            </div>
          </div>
          <Button 
            onClick={() => setOpen(true)}
            className="w-fit px-4 flex items-center justify-center mr-4 text-sm"
          
          >
            Request New Trainee
          </Button>
        </div>
        <div className="w-full h-full flex flex-col overflow-hidden">
          {activeBranch === "active" && <TraineeBranch  setActiveBranch={setActiveBranch} setData={setSelectedTrainee} />}
          {activeBranch === "requests" && <RequestBranch />}
          {activeBranch === "viewTrainee" && <ViewTraineeBranch setActiveBranch={setActiveBranch} selectedTrainee={selectedTrainee} setData={setSelectedTrainee} />}

        </div>
      </div>
    </div>
  );
};

export default TraineesPage;