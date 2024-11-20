import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Sidebar from "../../components/admin/Sidebar";
import Header from '../../components/admin/Header';
import TrainerBranch from '../../components/admin/branch/TrainerBranch';
import RequestBranch from '../../components/admin/branch/RequestBranch';
import AddNewTrainerForm from '../../components/admin/forms/AddNewTrainerForm';
import axios from 'axios'
import TraineeBranch from '../../components/admin/branch/TraineeBranch';
import ViewTraineeBranch from '../../components/admin/branch/ViewTraineeBranch';
import ViewTrainerBranch from '../../components/admin/branch/ViewTrainerBranch';
import { GridLoader } from 'react-spinners';

const AccountPage = () => {

  const [ activeBranch, setActiveBranch ] = useState("Trainers");
  const [ selectedTrainee, setSelectedTrainee ] = useState(null);
  const [ selectedTrainer, setSelectedTrainer ] = useState(null);
  const [ isOpen, setOpen ] = useState(false);

  const { isLoading, isError, data } = useQuery({
    queryKey: ['adminRequestCountData'],
    queryFn: async () => {
      try {
        const response = await axios.get('https://server-np0x.onrender.com/account/get-trainee-requests-count');
        return response.data 
      } catch (error) {
        console.log(error)
      }
    },
  });

  if (isLoading) return (
    <div className="w-screen h-screen flex justify-center items-center ">
      <GridLoader color="orange" size={15} />
    </div>
  )
  if (isError) return <div>Error fetching data</div>

  console.log(activeBranch)

  return (
    <div className="w-full h-full flex items-start justify-center bg-white font-inter flex-grow-0 overflow-x-hidden">
      <Sidebar />
      
      <Modal
        isOpen={isOpen}
        setOpen={setOpen}
        title="Add New Trainer"
      >
        <AddNewTrainerForm setOpen={setOpen} />
      </Modal>
      <div className="w-full h-full flex flex-col overflow-x-hidden">
        {/* Header */}
        <Header name="Accounts" />

        <div className="flex items-center justify-between h-20 border-b border-stone-200">
          <div className="flex items-center">
            <button 
              className={`h-full flex items-center w-24 justify-center p-1 text-base
                ${activeBranch === "Trainers" ? "text-amber-500 font-semibold" : " text-gray-500 "}
              `}
              onClick={() => setActiveBranch("Trainers")}
            >
              Trainers
            </button>
            <button 
              className={`h-full flex items-center w-24 justify-center p-1 text-base
                ${activeBranch === "Trainees" ? "text-amber-500 font-semibold" : " text-gray-500 "}
              `}
              onClick={() => setActiveBranch("Trainees")}
            >
              Trainees
            </button>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button 
              className={` z-0 relative h-10 flex items-center w-24 justify-center p-1 text-base ring-1 ring-amber-500 text-amber-500 rounded-md text-sm
              `}
              onClick={() => setActiveBranch("Requests")}
            >
              Requests
              {data && data.count > 0 && (
                <span className=" absolute -top-2 -right-2 bg-rose-500 text-white rounded-full text-xs flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  {data.count}
                </span>
              )}
            </button>
            <Button 
              onClick={() => setOpen(true)}
              className="w-fit px-4 flex items-center justify-center mr-4 text-sm"
            
            >
              Add New Trainer
            </Button>
          </div>
        </div>


        {/* Table */}
        <div className="flex w-full h-full overflow-hidden">
          {activeBranch === "Requests" && <RequestBranch />}
          {activeBranch === "Trainers" && <TrainerBranch setActiveBranch={setActiveBranch} setData={setSelectedTrainer}  />}
          {activeBranch === "Trainees" && <TraineeBranch setActiveBranch={setActiveBranch} setData={setSelectedTrainee} />}
          {activeBranch === "ViewTrainee" && <ViewTraineeBranch setActiveBranch={setActiveBranch} selectedTrainee={selectedTrainee} setData={setSelectedTrainee}  />}
          {activeBranch === "ViewTrainer" && <ViewTrainerBranch setActiveBranch={setActiveBranch} selectedTrainer={selectedTrainer} setData={setSelectedTrainer}  />}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;