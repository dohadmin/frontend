import React, { useRef } from 'react';
import PrintCanvas from './PrintCanvas';
import { Download, X } from 'lucide-react';
import jsPDF from 'jspdf';
import Button from "../ui/Button"

const NoLimitPrintSheet = ({ certificate, setOpen, setSelectedCertificate,  selectedUser, setSelectedUser }) => {


  const stageRef = useRef(null);
  const { firstName, middleInitial, lastName, controlNumber } = selectedUser
  const { layers, template, selectedSize, expiry } = certificate;

  

  const calculateExpiryDate = (dateIssued, expiryTime, expiryTimeUnit) => {
    const issuedDate = new Date(dateIssued);
    switch (expiryTimeUnit) {
      case 'Year':
        issuedDate.setFullYear(issuedDate.getFullYear() + expiryTime);
        break;
      case 'Month':
        issuedDate.setMonth(issuedDate.getMonth() + expiryTime);
        break;
      case 'Week':
        issuedDate.setDate(issuedDate.getDate() + expiryTime * 7);
        break;
      case 'Day':
        issuedDate.setDate(issuedDate.getDate() + expiryTime);
        break;
      default:
        throw new Error('Invalid expiry time unit');
    }
    return issuedDate.toLocaleDateString();
  };



  const fullName = `${firstName} ${middleInitial} ${lastName}`;

  const dateIssued = new Date().toLocaleDateString();
  const expiryDate = calculateExpiryDate(dateIssued, expiry.time, expiry.timeUnit);


  const newLayers = layers.map(layer => {
    const updatedLayer = { ...layer };
  
    if (layer.text === 'Full Name') {
      updatedLayer.nameLabel = fullName;
    }
    if (layer.text === 'Control No.') {
      updatedLayer.nameLabel = controlNumber;
    }
    if (layer.text === 'Issued Date') {
      updatedLayer.nameLabel = dateIssued;
    }
    if (layer.text === 'Expiration Date') {
      updatedLayer.nameLabel = expiryDate;
    }
  
    return updatedLayer;
  });



  const handleDownload = () => {
    if (stageRef.current) {
      // Use Konva's toDataURL method to capture the stage as an image
      const imgData = stageRef.current.toDataURL();
      
      // Create a new jsPDF instance
      const pdf = new jsPDF('landscape', 'pt', certificate.size === 'A4' ? 'a4' : 'a5');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Add the captured image to the PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Save the PDF
      pdf.save(`${certificate.name} - Certificate.pdf`);
    }
  };


  return (
    <div className="z-[900] overflow-x-hidden bg-gray-200 fixed right-0 top-0 w-screen h-screen flex items-center justify-center flex-col">
      <div className="flex items-center justify-between gap-4 py-4 absolute top-0 w-full px-4 z-10 bg-white">
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-amber-500 text-white"
          >
            <Download className="w-5 h-5 stroke-2 stroke-white" />
            Download
          </Button>
        </div>

        <button
          onClick={() => {
            setOpen(false);
            setSelectedCertificate(null);
            setSelectedUser(null);
          }}
          className="rounded-md w-9 h-9 flex items-center justify-center"
        >
          <X className="w-8 h-8 stroke-2 stroke-rose-500" />
        </button>
      </div>
      <div className="ring-1 ring-amber-500 z-[99999]">
        <PrintCanvas layers={newLayers} template={template} selectedSize={selectedSize} ref={stageRef} />
      </div>
    </div>
  );
};

export default NoLimitPrintSheet;
