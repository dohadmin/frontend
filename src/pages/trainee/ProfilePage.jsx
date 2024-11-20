import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import Sidebar from "../../components/trainee/Sidebar";
import Header from '../../components/trainee/Header';
import ProfileBranch from '../../components/trainee/branch/ProfileBranch';

const ProfilePage = () => {
  const [ selectedTrainee, setSelectedTrainee ] = useState(null);

  const [ activeBranch, setActiveBranch ] = useState("profile");


  return (
    <div className="w-screen h-screen flex items-start justify-center bg-white font-inter flex-grow-0">
      <Sidebar />

      <div className="w-full h-full flex flex-col overflow-hidden">
        {/* Header */}
        <Header name="Profile" />


        <div className="w-full h-full flex flex-col overflow-hidden">
          {activeBranch === "profile" && <ProfileBranch setActiveBranch={setActiveBranch} setData={setSelectedTrainee} />}

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;