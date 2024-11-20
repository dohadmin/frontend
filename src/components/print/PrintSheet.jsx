import React, { useRef, useState } from 'react';
import PrintCanvas from './PrintCanvas';
import useAccountStore from '../../stores/trainee/AccountStore';
import { Download, X } from 'lucide-react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import jsPDF from 'jspdf';
import axios from 'axios';
import { GridLoader } from 'react-spinners';
import Button from "../ui/Button"

const PrintSheet = ({ certificate, setOpen, setSelectedCertificate, userId, trainingId }) => {
  const queryClient = useQueryClient();
  const stageRef = useRef(null);
  const { firstName, middleInitial, lastName, controlNumber } = useAccountStore(state => state.user);
  const { layers, template, selectedSize, expiry } = certificate;
  const [count, setCount] = useState(0);
  
  console.log(count)

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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["downloadCount", userId, trainingId],
    queryFn: async () => {
      try {
        const response = await axios.get(`http://localhost:8080/download/get-downloads`, {
          params: {
            userId: userId,
            trainingId: trainingId,
            certificateId: certificate._id
          }
        });
        setCount(response.data.remaining);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleDownload = async () => {
    if (count >= 3) {
      return;
    }
    const data = {
      userId: userId,
      trainingId: trainingId,
      certificateId: certificate._id
    };
    try {
      const res = await axios.put('http://localhost:8080/download/update-downloads', data);
      queryClient.refetchQueries(["downloadCount", userId, trainingId]);
      console.log(res);
    } catch (error) {
      console.log(error);
    }

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

  if (isLoading) {
    return (
      <div className="fixed top-0 right-0 w-screen h-screen bg-white z-[9999] flex items-center justify-center">
        <GridLoader color="orange" size={15} />
      </div>
    );
  }  if (isError) return <div>Error</div>;

  const totalAllowedDownloads = 3;
  const remainingDownloads = totalAllowedDownloads - (count || 0);
  const isDisabled = remainingDownloads <= 0;


  const handleRequestAgain = async () => {
    // const alreadyRequested = await axios.get(`http://localhost:8080/notifications/get-requests-download/${userId}`)

    // console.log(alreadyRequested)
    // if (alreadyRequested.lenght > 0) {

    //   return
    // }
    
    try {      
      const res = await axios.post("http://localhost:8080/notification/request-again", {
        traineeId: userId,
        message: `has requested another download for the certificate ${certificate.name}`
      })
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div className="z-[900] overflow-x-hidden bg-gray-200 fixed right-0 top-0 w-screen h-screen flex items-center justify-center flex-col">
      <div className="flex items-center justify-between gap-4 py-4 absolute top-0 w-full px-4 z-10 bg-white">
        <div className="flex items-center justify-center gap-4">
          {
            isDisabled ? (
              <Button
                onClick={handleRequestAgain}
                className="px-4"
              >
                Request Again
              </Button>    
            ) : (
              <Button
                isDisabled={isDisabled}
                onClick={handleDownload}
                className={` ${isDisabled ? " bg-gray-500 cursor-not-allowed " : " bg-amber-500 cursor-pointer "} flex items-center justify-center gap-2 px-4 py-2 rounded-md  text-white`}
              >
                <Download className="w-5 h-5 stroke-2 stroke-white" />
                Download
              </Button>    
            )
          }


          {isDisabled ? (
            <p className="text-rose-500 text-lg font-medium">You have reached the maximum download limit</p>
          ) : (
            <p>Remaining Downloads
              <span className={` ${isDisabled ? " text-rose-500 " : " text-amber-500"} font-medium ml-1 text-lg`}>{remainingDownloads}</span>
            </p>          
          )}


        </div>


        <button
          onClick={() => {
            setOpen(false);
            setSelectedCertificate(null);
            queryClient.removeQueries({queryKey: ["downloadCount", userId, trainingId]});
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

export default PrintSheet;