import { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Sidebar from "../../components/super/Sidebar";
import Header from '../../components/super/Header';
import AddNewAdminForm from '../../components/super/forms/AddNewAdminForm';
import AdminBranch from '../../components/super/branch/AdminBranch';

const AdminPage = () => {

  const [ isOpen, setOpen ] = useState(false);


  return (
    <div className="w-full h-full flex items-start justify-center bg-white font-inter flex-grow-0 overflow-x-hidden">
      <Sidebar />
      
      <Modal
        isOpen={isOpen}
        setOpen={setOpen}
        title="Add New Admin"
      >
        <AddNewAdminForm setOpen={setOpen} />
      </Modal>
      <div className="w-full h-full flex flex-col overflow-x-hidden">
        {/* Header */}
        <Header name="Admins" />

        <div className="flex items-center justify-between h-20 border-b border-stone-200">
          <div className="flex items-center">

          </div>
          <div className="flex items-center justify-center gap-4">
            <Button 
              onClick={() => setOpen(true)}
              className="w-fit px-4 flex items-center justify-center mr-4 text-sm"
            
            >
              Add New Admin
            </Button>
          </div>
        </div>


        <div className="flex w-full h-full overflow-hidden">
          <AdminBranch />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;