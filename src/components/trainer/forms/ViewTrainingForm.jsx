import { Calendar, Check, CheckCircle, Scroll, Users2 } from "lucide-react";
import { getColorForInitial } from "../../../utils/NameColor.js";
import NoLimitPrintSheet from "../../print/NoLimitPrintSheet.jsx";
import useAccountStore from "../../../stores/trainer/AccountStore.js";
import { useState } from "react";

const ViewTrainingForm = ({ selectedTraining }) => {
  const [showPrint, setShowPrint] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const initilaista = selectedTraining.trainerId.firstName[0] + selectedTraining.trainerId.lastName[0];
  const background = getColorForInitial(initilaista ? initilaista[0] : "");


  const getStatusColor = (status) => {
    switch (status) {
      case 'on hold':
        return {
          bg: 'bg-orange-50',
          text: 'text-orange-500',
          ring: 'ring-orange-500',
          label: "On Hold"
        };
      case 'released':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-500',
          ring: 'ring-emerald-500',
          label: "Released"
        };
      case 'declined':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-500',
          ring: 'ring-rose-500',
          label: "Declined"
        };
      default:
        return {
          bg: '',
          text: ''
        };
    }
  };


  const printPDF = (c, u) => {
    
    setShowPrint(true);
    setSelectedCertificate(c);
    setSelectedUser(u);
  };

  const { bg, text, ring, label } = getStatusColor(selectedTraining.status);
  return (
    <div className="p-6 flex flex-col items-start gap-4">
      {showPrint && 
        <NoLimitPrintSheet 
          certificate={selectedCertificate} 
          setOpen={setShowPrint} 
          setSelectedCertificate={setSelectedCertificate} 
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      }
      <div className="flex items-center gap-2 w-full">
        <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
          <Calendar className="w-5 h-5 stroke-2 stroke-gray-500" />
        </div>
        <div className="w-full flex items-center justify-between">
          <h1 className="text-lg font-medium text-gray-700">Training Information</h1>
          <span className={`px-2 py-1 rounded-md ring-1 text-xs uppercase ${text} ${bg} ${ring}`}>
            {label}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <label className="text-sm uppercase text-neutral-700 font-medium">Trainer</label>
        <div className="w-full flex items-center justify-start gap-2 p-4 ring-1 ring-gray-200 rounded-md">
          <div>
            {selectedTraining.trainerId.avatar ? (
              <img src={selectedTraining.trainerId.avatar} alt="trainer" className="bg-black w-9 h-9 flex-shrink-0 rounded-full" />
            ) : (
              <div className={`w-9 h-9 rounded-full ${background} text-white flex items-center justify-center flex-shrink-0`}>
                {initilaista}
              </div>
            )}
          </div>
          <div className="flex flex-col justify-start">
            <div className="flex items-start justify-start gap-2">
              <span className="text-gray-700 font-medium">
                {selectedTraining.trainerId.firstName} {selectedTraining.trainerId.middleInitial} {selectedTraining.trainerId.lastName}
              </span>
            </div>
            <span className="text-gray-500 text-sm">{selectedTraining.trainerId.email}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start gap-2 w-full">
        <label className="text-sm uppercase text-neutral-700 font-medium">Date</label>
        <label className="text-sm h-7 w-full text-gray-700">
          {formatDate(selectedTraining.date)}
        </label>
      </div>

      <div className="flex flex-col items-start gap-2 w-full">
        <label className="text-sm uppercase text-neutral-700 font-medium">Title</label>
        <label className="text-sm h-7 w-full text-gray-700">
          {selectedTraining.title}
        </label>
      </div>
      <div className="flex flex-col items-start gap-2 w-full">
        <label className="text-sm uppercase text-neutral-700 font-medium">Description</label>
        <label className="text-sm h-7 w-full text-gray-700 break-words">
          {selectedTraining.description}
        </label>
      </div>

      <div className="flex items-center gap-2 mt-8">
        <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
          <Scroll className="w-5 h-5 stroke-2 stroke-gray-500" />
        </div>
        <h1 className="text-lg font-medium text-gray-700">Certificates</h1>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-col mt-2 gap-4">
          {selectedTraining.certificates.map((certificate, index) => {
            return (
              <div key={index} className="w-full h-fit rounded-md items-center justify-between gap-4 flex ring-1 p-4 ring-gray-200 relative overflow-hidden">
                <div className="w-full flex items-center justify-start gap-2">
                  <Scroll className="w-6 h-6 stroke-2 stroke-gray-500" />
                  <span className="text-gray-700 text-sm font-medium">{certificate.details.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-8">
        <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
          <Users2 className="w-5 h-5 stroke-2 stroke-gray-500" />
        </div>
        <h1 className="text-lg font-medium text-gray-700">Trainees</h1>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-col mt-2 gap-4">
          {selectedTraining.trainees.map((trainee, index) => {
            const initials = trainee.id.firstName[0] + trainee.id.lastName[0];
            const bgColor = getColorForInitial(initials ? initials[0] : "");

            const selectedTrainee = selectedTraining.trainees.find((t) => t.id === trainee.id);
            


            return (
              <div
                key={index}
                className="w-full h-fit rounded-md items-center justify-start gap-4 flex flex-col ring-1 p-4 ring-gray-200"
              >
                <div className="w-full flex items-center justify-between">
                  <div className="w-full flex items-center justify-start gap-2">
                    <div>
                      {trainee.id.avatar ? (
                        <img src={trainee.id.avatar} alt="trainee" className="bg-black w-9 h-9 flex-shrink-0 rounded-full" />
                      ) : (
                        <div className={`w-9 h-9 rounded-full ${bgColor} text-white flex items-center justify-center flex-shrink-0`}>
                          {initials}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-start">
                      <div className="flex items-start justify-start gap-2">
                        <span className="text-gray-700 font-medium">
                          {trainee.id.firstName} {trainee.id.middleInitial} {trainee.id.lastName}
                        </span>
                      </div>
                      <span className="text-gray-500 text-sm">{trainee.id.email}</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 flex items-center justify-center pr-4">
                    <span
                      className={`text-xs ring-1 px-2 py-1 rounded-md ${
                        trainee.score >= 75
                          ? "text-green-500 bg-green-50 ring-green-500"
                          : trainee.score >= 50
                          ? "text-yellow-500 bg-yellow-50 ring-yellow-500"
                          : "text-red-500 bg-red-50 ring-red-500"
                      }`}
                    >
                      {trainee.score}%
                    </span>
                  </div>
                </div>
                <div className="w-full flex flex-col h-full">
                  {selectedTraining.certificates.map((certificate, certIndex) => {
                    const traineeIndex = selectedTraining.trainees.findIndex((t) => t.id === trainee.id);
                    const rubicsForCertificate = selectedTraining.trainees[traineeIndex].rubrics.find((r) => r.certificateId === certificate.id);


                    return (
                      <div key={certIndex} className=" w-full rounded-md flex-col flex relative overflow-hidden">
                        <div className="w-full flex items-center justify-between mt-4">
                          <div className="w-full flex items-center justify-start gap-2">
                            <span className="text-gray-700 text-lg font-medium">{certificate.details.name}</span>
                          </div>
                          {rubicsForCertificate.score === 100 && (
                            <button
                              onClick={() => printPDF(certificate.details, selectedTrainee.id)}
                              className="flex-shrink-0 flex items-start justify-center rounded-md uppercase text-orange-500 text-sm"
                            >
                              View
                            </button>
                          )}
                        </div>
                        <div className="flex flex-col w-full gap-2 h-fit mt-2">
                          {rubicsForCertificate.rubrics.map((rubric, rubricIndex) => (
                            <div key={rubricIndex} className="w-full flex items-center justify-start gap-2">
                              <Check className="flex-shrink-0 w-5 h-5 stroke-2 stroke-green-500" />
                              <span className="text-gray-500 text-sm ">{rubric}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ViewTrainingForm;