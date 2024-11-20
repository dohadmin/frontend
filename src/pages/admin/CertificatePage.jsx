import { useState } from 'react'
import Sidebar from '../../components/admin/Sidebar'
import Header from '../../components/admin/Header'
import Button from '../../components/ui/Button'
import CertificateBranch from '../../components/admin/branch/CertificateBranch'
import EditorBranch from '../../components/admin/branch/EditorBranch'
import UpdateEditorBranch from '../../components/admin/branch/UpdateEditorBranch'
import { ChevronLeft } from 'lucide-react'
import AddNewCertificateForm from '../../components/admin/forms/AddNewCertificateForm'
import UpdateCertificateForm from '../../components/admin/forms/UpdateCertificateForm'
import Modal from '../../components/ui/Modal'

const CertificatePage = () => {

  const [ isOpen, setOpen ] = useState(false);
  const [ isEditOpen, setEditOpen ] = useState(false);
  const [ activeBranch, setActiveBranch ] = useState('certificate');
  const [ selectedSize, setSelectedSize ] = useState('A4');
  const [ selectedTemplate, setSelectedTemplate ] = useState(null);
  const [ layers, setLayers] = useState([
    { type: 'text', text: 'Full Name', x: 50, y: 50, size: 40, status: "static", visible: true, },
    { type: 'text', text: 'Issued Date', x: 50, y: 100, size: 40, status: "static", visible: true, },
    { type: 'text', text: 'Control No.', x: 50, y: 150, size: 40, status: "static", visible: true, },
    { type: 'text', text: 'Expiration Date', x: 50, y: 200, size: 40, status: "static", visible: true, },
  ]);
  // forupdating
  const [ selectedCertificate, setSelectedCertificate ] = useState(null);
  const [ editSize, setEditSize ] = useState(selectedCertificate?.size ?? "A4");
  const [ editLayers, setEditLayers ] = useState(selectedCertificate?.layers ?? []);
  const [ editTemplate, setEditTemplate ] = useState(selectedCertificate?.template ?? null);




  return (
    <div className="w-full h-full flex items-start justify-center bg-white font-inter flex-grow-0 overflow-x-hidden">
      <Sidebar />
      
      <div className="w-full h-full flex flex-col overflow-hidden">
        {/* Header */}
        <Header name="Certificates" />

        <div className="flex items-center justify-between h-20 border-b border-stone-200">
          <div className="flex items-center">
            {activeBranch !== "certificate" ? (
              <div className="flex items-center justify-center w-fit gap-4">
                <button 
                  onClick={() => setActiveBranch("certificate")}
                  className="h-full flex items-center justify-center ml-4"
                >
                  <ChevronLeft />
                </button>
                <h1 className="text-lg font-medium text-gray-700">Template Editor</h1>
              </div>
            ) : (
              <button 
                className={`h-full flex items-center w-32 justify-center p-1 text-base
                  ${activeBranch === "certificate" ? "text-amber-500 font-semibold" : " text-gray-500 "}
                `}
                onClick={() => setActiveBranch("certificate")}
              >
                Certificates
              </button>
              )}
          </div>
          <div className="flex items-center justify-center gap-4">
            {activeBranch !== "editor" && activeBranch !== "update" ? (
              <Button 
                onClick={() => setActiveBranch('editor')}
                className="w-fit px-4 flex items-center justify-center mr-4 text-sm"
              
              >
                Add New Certificate
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  if (activeBranch === "editor") {
                    setOpen(true);
                  } else {
                    setEditOpen(true);
                  }
                }}
                className="w-fit px-4 flex items-center justify-center mr-4 text-sm"
              >
                Save Template
              </Button>
            )
          }
          </div>
        </div>
        {/* Table */}
        <div className="flex w-full h-full overflow-hidden">
          {activeBranch === "certificate" && 
          <CertificateBranch 
            setActiveBranch={setActiveBranch} 
            setSelectedCertificate={setSelectedCertificate} 
            setEditSelectedSize={setEditSize}
            setEditLayers={setEditLayers}
          />
          }
          {activeBranch === "editor" && 
            <EditorBranch 
              selectedSize={selectedSize} 
              setSelectedSize={setSelectedSize} 
              layers={layers} 
              setLayers={setLayers} 
              setSelectedTemplate={setSelectedTemplate}
          />
          }
          {activeBranch === "update" && 
            <UpdateEditorBranch
              selectedSize={editSize}
              setEditSize={setEditSize}
              layers={editLayers}
              setLayers={setEditLayers}
              selectedCertificate={selectedCertificate}
              setEditTemplate={setEditTemplate}
            />
          }
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        setOpen={setOpen}
        title={"Create a Certificate Template"}
      >
        <AddNewCertificateForm setOpen={setOpen} layers={layers} size={selectedSize} setActiveBranch={setActiveBranch} template={selectedTemplate}/>
      </Modal>
      <Modal
        isOpen={isEditOpen}
        setOpen={setEditOpen}
        title={"Create a Certificate Template"}
      >
        <UpdateCertificateForm setOpen={setEditOpen} layers={editLayers} size={editSize} setActiveBranch={setActiveBranch} selectedCertificate={selectedCertificate} template={editTemplate}/>
      </Modal>
    </div>
  )
}

export default CertificatePage