import { Calendar, Scroll, Users2, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GridLoader, ScaleLoader } from "react-spinners";
import UpdateTrainingSchema from "../../../schemas/UpdateTrainingSchema";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState, useEffect } from "react";
import { debounce } from "../../../utils/Debounce.js";
import { useQueryClient } from "@tanstack/react-query";
import Button from "../../ui/Button.jsx";
import { getColorForInitial } from "../../../utils/NameColor.js";

const EditNewTrainingForm = ({ selectedTraining, setOpen }) => {
  
  const [searchQuery, setSearchQuery] = useState("");
  const [trainees, setTrainees] = useState([]);
  const [selected, setSelected] = useState([]);
  const [scores, setScores] = useState({}); // New state for managing scores
  const [showPrint, setShowPrint] = useState(false);

  const [ isLoading , setLoading ] = useState(false)
  const queryClient = useQueryClient();

  const superCleanedCertificates = (certificates) => {
    const cleanedCertificates = certificates.map(cert => {
      return { id: cert.details._id }
    });
    return cleanedCertificates
  }
  

  const superCleanerData = (trainingData) => {
    const trainees = [];
    const validTrainees = trainingData.trainees.filter(subTrainee => 
      subTrainee.status === "trainees" || subTrainee.status === "requests"
    );

    if (validTrainees.length > 0) {
      console.log("in")
      validTrainees.forEach(subTrainee => {
        trainees.push({
          _id: subTrainee.id._id,
          status: subTrainee.status,
          score: subTrainee.score,
          firstName: subTrainee.id.firstName,
          middleInitial: subTrainee.id.middleInitial,
          lastName: subTrainee.id.lastName,
          email: subTrainee.id.email,
          avatar: subTrainee.id.avatar,
          rubrics: subTrainee.rubrics,
        });
      });
    }

    const result = {
      _id: trainingData._id,
      createdAt: trainingData.createdAt,
      description: trainingData.description,
      title: trainingData.title,
      date: trainingData.date,
      trainerId: trainingData.trainerId,
      certificates: trainingData.certificates,
      trainees: trainees,
    };

    return result;
  };
  
  const cleanedData = superCleanerData(selectedTraining)



  useEffect(() => {
    if (cleanedData.trainees.length === 0) return;
    const updatedScores = cleanedData.trainees.reduce((acc, trainee) => {
      acc[trainee._id] = trainee.score;
      return acc;
    }, {});
    setScores(updatedScores);

    const updatedTrainees = selectedTraining.trainees.map((t) => {
      const status = t.status === "trainees" ? "trainees" : "requests";
      return { 
        id: t.id._id, 
        score: t.score, 
        status: status,
        rubrics: t.rubrics.map((r) => ({
          certificateId: r.certificateId,
          rubrics: r.rubrics,
        })),

       };
    }); // Corrected map function

    setValue("trainees", updatedTrainees);
    setSelected(cleanedData.trainees);
  }, []); 


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleClose = () => {
    setOpen(false);
  }

  
  const handleDecline = async () => {
    try {
      const res = await axios.put(`https://server-np0x.onrender.com/training/decline-training/${selectedTraining._id}`)
      queryClient.refetchQueries({queryKey: ['adminTrainingsTableData']})
      queryClient.refetchQueries({queryKey: ['trainerTrainingsTableData']})
      queryClient.refetchQueries({queryKey: ['traineeTrainingsTableData']})
      toast.success(res.data.message)
    
    } catch (error) {
      console.log(error)
    } finally {
      setOpen(false)
      setLoading(false)

    }

  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch,
    clearErrors,
  } = useForm({
    resolver: zodResolver(UpdateTrainingSchema),
    defaultValues: {
      id: selectedTraining._id,
      trainerId: cleanedData.trainerId._id,
      title: cleanedData.title,
      description: cleanedData.description,
      date: cleanedData.date,
      certificates: superCleanedCertificates(selectedTraining.certificates),
    },
  });


  const { data: trainers, isLoading: isLoadingTrainers, isError: isErrorTrainers } = useQuery({
    queryKey: ["adminTrainersSelection"],
    queryFn: async () => {
      try {
        const response = await axios.get("https://server-np0x.onrender.com/account/get-trainers");
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    cacheTime: 0,
  });

  const { data: certificates, isLoading: isLoadingCertificates, isError: isErrorCertificates } = useQuery({
    queryKey: ["adminCertificateSelection"],
    queryFn: async () => {
      try {
        const response = await axios.get(`https://server-np0x.onrender.com/certificate/get-valid-certificates`)
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    cacheTime: 0,
  });

  const fetchTrainees = async (query) => {
    try {
      const response = await axios.get(`https://server-np0x.onrender.com/account/search-trainees`, {
        params: {
          search: query,
        },
      });
      setTrainees(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedFetchTrainees = useCallback(
    debounce((query) => {
      fetchTrainees(query);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedFetchTrainees(searchQuery);
  }, [searchQuery, debouncedFetchTrainees]);


  const handleSelect = (e, trainee) => {
    e.stopPropagation();

    const currentTrainees = getValues("trainees") || [];
    const isAlreadySelected = currentTrainees.some((t) => t.id === trainee._id);
    if (isAlreadySelected) return;
  
    const status = trainee.status === "verified" ? "trainees" : "requests";
  
    const updatedTrainees = [
      ...currentTrainees,
      {
        id: trainee._id,
        score: scores[trainee._id] || 0,
        status: status,
        rubrics: [
          ...formCertificates.map((c) => ({ certificateId: c.id, rubrics: [] }))
        ],
      },
    ];
  
    setValue("trainees", updatedTrainees);

    const cleanedTrainee = {
      _id: trainee._id,
      status: status,
      score: scores[trainee._id] || 0,
      firstName: trainee.firstName,
      middleInitial: trainee.middleInitial,
      lastName: trainee.lastName,
      email: trainee.email,
      avatar: trainee.avatar,
    };
  
    setSelected([...selected, cleanedTrainee]);
    setScores((prevScores) => ({ ...prevScores, [trainee._id]: 0 })); // Initialize score for new trainee
    setSearchQuery("");
    setTrainees([]);
  };

  const handleMaxAllScores = () => {
    const updatedScores = selected.reduce((acc, trainee) => {
      acc[trainee._id] = 100;
      return acc;
    }, {});
    setScores(updatedScores);
    const updatedTrainees = getValues("trainees").map((t) => ({
      ...t,
      score: 100,
    }));
    setValue("trainees", updatedTrainees);
  };

  const printPDF = (c, u) => {
    
    setShowPrint(true);
    setSelectedCertificate(c);
    setSelectedUser(u);
  };


  const formCertificates = watch("certificates");


  
  if (isLoadingTrainers || isLoadingCertificates)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <GridLoader color="orange" size={15} />
      </div>
    );

  if (isErrorTrainers || isErrorCertificates) return <div>Error fetching data</div>;



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
  const initilaista = selectedTraining.trainerId.firstName[0] + selectedTraining.trainerId.lastName[0];
  const background = getColorForInitial(initilaista ? initilaista[0] : "");
  const { bg, text, ring, label } = getStatusColor(selectedTraining.status);

  console.log(selectedTraining)

  return (
    <div className="p-6 flex flex-col items-start gap-4">
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
    {selectedTraining.trainees && (
      <div className="flex items-center gap-2 mt-8">
        <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
          <Users2 className="w-5 h-5 stroke-2 stroke-gray-500" />
        </div>
        <h1 className="text-lg font-medium text-gray-700">Trainees</h1>
      </div>
    )}

    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col mt-2 gap-4">
        {selectedTraining?.trainees > 0 && selectedTraining.trainees.map((trainee, index) => {
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
                          <Fragment>
                            <button onClick={() => resetDownloads(certificate, selectedTrainee.id._id, selectedTraining._id)} className="flex-shrink-0 flex items-start justify-center rounded-md uppercase text-orange-500 text-sm">
                              Reset
                            </button>
                            <button onClick={() => printPDF(certificate.details, selectedTrainee.id)} className="flex-shrink-0 flex items-start justify-center rounded-md uppercase text-orange-500 text-sm">
                              View
                            </button>
                          </Fragment>
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
    <div className="w-full flex items-center justify-end gap-4 mt-6">
        <button type="button" className="w-24" onClick={handleClose}>Cancel</button>
        <button type="button" className="w-24 ring-1 rounded-md ring-rose-500 text-rose-500 px-2 h-9" onClick={handleDecline}>Decline</button>
        <Button 
          className="w-32 flex items-center justify-center gap-2"
          isDisabled={isLoading}
        >
          {isLoading &&(
            <ScaleLoader 
              cssOverride={{
                height: "35px",
                width: "40px",
                transform: 'scale(0.5)', 
              }}
              color="white"
            />          
          )}
          Release
        </Button>
      </div>
  </div>
  );
};

export default EditNewTrainingForm;
