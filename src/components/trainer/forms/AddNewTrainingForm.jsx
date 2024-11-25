import { Edit, Scroll, User, Users2, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GridLoader, ScaleLoader } from "react-spinners";
import SelectTraineeInput from "../../../components/admin/ui/SelectTraineeInput";
import NewTrainingSchema from "../../../schemas/NewTrainingSchema";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../ui/Input";
import TextArea from "../../ui/TextArea";
import { useCallback, useState, useEffect } from "react";
import { debounce } from "../../../utils/Debounce.js";
import { getColorForInitial } from "../../../utils/NameColor.js";
import { useQueryClient } from "@tanstack/react-query";
import Button from "../../ui/Button.jsx";
import { toast } from "react-toastify";
import SelectCertificateInput from "../../../components/admin/ui/SelectCertificateInput.jsx";
import useAccountStore from "../../../stores/trainer/AccountStore.js";

const AddNewTrainingForm = ({ setOpen }) => {
  const user = useAccountStore((state) => state.user);
  const [ isLoading , setLoading ] = useState(false)
  const queryClient = useQueryClient();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [trainees, setTrainees] = useState([]);
  const [selected, setSelected] = useState([]);
  const [scores, setScores] = useState({}); // New state for managing scores


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
    resolver: zodResolver(NewTrainingSchema),
    defaultValues: {
      trainerId: user._id,
      title: "",
      description: "",
      date: "",
      trainees: [],
      certificates: [],
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
      return response.data;
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

  if (isLoadingTrainers|| isLoadingCertificates)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <GridLoader color="orange" size={15} />
      </div>
    );

  if (isErrorTrainers || isErrorCertificates) return <div>Error fetching data</div>;
  


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
    setSelected([...selected, trainee]);
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


  const handleClose = () => {
    reset()
    setOpen(false)
  }



  const onSubmit = async (data) => {
    console.log(data)
    setLoading(true)
    try {
      const res = await axios.post('https://server-np0x.onrender.com/training/create-training', data)
      console.log(res.data)
      queryClient.invalidateQueries({queryKey: ['trainerTrainingsTableData']})
      toast.success(res.data.message)
      setOpen(false)
      reset()
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }


  const formCertificates = watch("certificates");



  const filteredTrainees = trainees.filter((trainee) => !selected.some((t) => t._id === trainee._id));
  const trainingDate = watch("date")
  const isTrainingDay = new Date(trainingDate).getDate() === new Date().getDate();



  return (
    <form className="p-6 flex flex-col items-start gap-4 " onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
          <Edit className="w-5 h-5 stroke-2 stroke-gray-500" />
        </div>
        <h1 className="text-lg font-medium text-gray-700">Training Information</h1>
      </div>
      <div className="flex flex-col items-start gap-2 w-full">
        <label className="text-sm uppercase text-neutral-700 font-medium">Date</label>
        <Controller
          name="date"
          control={control}
          render={({ field: { value, onChange } }) => (
            <input
              min={new Date().toISOString().split("T")[0]} // Set minimum date to today
              type="date"
              className={`w-full ring-1 rounded-md h-10 px-4 outline-none
                ${
                  errors.date
                    ? " ring-rose-500 text-rose-500 "
                    : " ring-gray-200 placeholder:text-sm text-smplaceholder:text-gray-500 text-gray-700 focus:outline-none focus:ring-2 "
                }  
              `}
              onChange={(e) => onChange(e.target.value)}
              value={formatDate(value)}
            />
          )}
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <label className="text-sm uppercase text-neutral-700 font-medium">Title</label>
        <Controller
          name="title"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Input
              value={value}
              placeholder="eg. First Aid Training"
              onChange={(e) => onChange(e.target.value)}
              didError={!!errors.title}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <label className="text-sm uppercase text-neutral-700 font-medium">Description</label>
        <Controller
          name="description"
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextArea
              value={value}
              placeholder="A brief description of the training"
              onChange={(e) => onChange(e.target.value)}
              didError={!!errors.description}
            />
          )}
        />
      </div>
      <hr className="border-t border-gray-200 w-full mt-4" />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
          <Scroll className="w-5 h-5 stroke-2 stroke-gray-500" />
        </div>
        <h1 className="text-lg font-medium text-gray-700">Add Multiple Certificates</h1>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <div className="w-full flex flex-col items-start justify-center gap-4">
          <label className="text-sm uppercase text-neutral-700 font-medium">Certificates</label>
          <Controller
          name="certificates"
          control={control}
          render={() => (
            <SelectCertificateInput
              certificates={certificates}
              value={searchQuery}
              className="w-full"
              onChange={(e, certificate) => {
                e.stopPropagation();
                const currentCertificates = getValues("certificates") || [];
                const isAlreadySelected = currentCertificates.some((c) => c.id === certificate._id);
                if (isAlreadySelected) return;
                const updatedCertificates = [...currentCertificates, { id: certificate._id }];
                setValue("certificates", updatedCertificates);
                const updatedTrainees = getValues("trainees").map((t) => ({
                  ...t,
                  rubrics: [...t.rubrics, { certificateId: certificate._id, rubrics: [] }],
                }));
                setValue("trainees", updatedTrainees);
                setSearchQuery("");            
                clearErrors("certificates");

              }}
              selected={formCertificates}
              didError={!!errors.certificates}
            />
          )}
        />
        {formCertificates.length > 0 && (
          <div className="flex flex-col mt-2 gap-4 w-full">
            {formCertificates.map((certificate, index) => {
              const cert = certificates.find((c) => c._id === certificate.id);
              return (
                <div key={index} className="w-full h-fit rounded-md items-center justify-start gap-4 flex flex-col ring-1 p-4 ring-gray-200 ">
                  <div className="w-full flex items-center justify-between ">
                    <div className="w-full flex items-center justify-start gap-2 ">
                      <Scroll className="w-6 h-6 stroke-2 stroke-gray-500" />
                      <span className="text-gray-700 text-sm font-medium">{cert.name}</span>
                    </div>
                    <button type="button" onClick={() => {
                      const updatedCertificates = formCertificates.filter((c) => c.id !== certificate.id);
                      setValue("certificates", updatedCertificates);
                      const cleanedRubrics = getValues("trainees").map((t) => ({
                        ...t,
                        rubrics: t.rubrics.filter((r) => r.certificateId !== certificate.id),
                      }))

                      setValue("trainees", cleanedRubrics);

                    }}>
                      <X className="w-6 h-6 stroke-2 stroke-rose-500" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        </div>
      </div>
      {isTrainingDay && (
        <>
          <hr className="border-t border-gray-200 w-full mt-4" />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
              <Users2 className="w-5 h-5 stroke-2 stroke-gray-500" />
            </div>
            <h1 className="text-lg font-medium text-gray-700">Add Multiple Trainees</h1>
          </div>


          <div className="flex flex-col gap-2 w-full">
            <div className="w-full flex items-center justify-between">
              <label className="text-sm uppercase text-neutral-700 font-medium">Trainees</label>
              {selected.length > 0 && (
                <button 
                  type='button'
                  className="text-amber-500 text-sm hover:text-amber-400 active:text-amber-600 transition-all duration-300 ease-in-out outline-none"
                  onClick={handleMaxAllScores}
                >
                  Max All Scores
                </button>
              )}
            </div>
            <Controller
              name="trainees"
              control={control}
              render={() => (
                <SelectTraineeInput
                  trainees={filteredTrainees}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    clearErrors("trainees");
                  }}
                  placeholder="Search trainees"
                  handleSelect={handleSelect}
                  didError={!!errors.trainees}
                />
              )}
            />
            {selected.length > 0 ? (
              <div className="flex flex-col mt-2 gap-4">
                {selected.map((trainee, index) => {
                  const initials = trainee.firstName[0] + trainee.lastName[0];
                  const bgColor = getColorForInitial(initials ? initials[0] : "");

                  return (
                    <div
                      key={index}
                      className="w-full h-fit rounded-md items-center justify-start gap-4 flex flex-col ring-1 p-4 ring-gray-200 "
                    >
                      <div className="w-full flex items-center justify-between ">
                        <div className="w-full flex items-center justify-start gap-2 ">
                          <div>
                            {trainee.avatar ? (
                              <img src={trainee.avatar} alt="trainee" className="bg-black w-9 h-9 flex-shrink-0 rounded-full" />
                            ) : (
                              <div className={`w-9 h-9 rounded-full ${bgColor} text-white flex items-center justify-center flex-shrink-0`}>
                                {initials}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col justify-start">
                            <div className="flex items-start justify-start gap-2">
                              <span className="text-gray-700 font-medium">
                                {trainee.firstName} {trainee.middleInitial} {trainee.lastName}
                              </span>
                            </div>
                            <span className="text-gray-500 text-sm">{trainee.email}</span>
                          </div>
                        </div>
                        <button type="button" onClick={() => {
                          const updatedTrainees = selected.filter((t) => t._id !== trainee._id);
                          setSelected(updatedTrainees);
                          setValue("trainees", updatedTrainees.map((t) => ({
                            id: t._id,
                            status: t.status === "verified" ? "trainees" : "requests",
                            score: scores[t._id] || 0,
                          })));
                          setScores(prevScores => {
                            const newScores = { ...prevScores };
                            delete newScores[trainee._id];
                            return newScores;
                          });

                          setValue("certificates", [])


                          
                        }}>
                          <X className="w-6 h-6 stroke-2 stroke-rose-500" />
                        </button>
                      </div>
                      <div className="w-full flex flex-col gap-4">
                        <label className="text-sm uppercase text-neutral-700 font-medium">Score</label>
                        <input 
                          type="range" 
                          max={100}
                          min={0}
                          step={1}
                          className="appearance-none w-full bg-transparent 
                            [&::-webkit-slider-runnable-track]:bg-gray-200 
                            [&::-webkit-slider-runnable-track]:rounded-full
                            [&::-webkit-slider-runnable-track]:ring-1
                            [&::-webkit-slider-runnable-track]:ring-gray-200
                            [&::-webkit-slider-runnable-track]:h-1
                            [&::-webkit-slider-thumb]:appearance-none
                            [&::-webkit-slider-thumb]:w-4
                            [&::-webkit-slider-thumb]:h-4
                            [&::-webkit-slider-thumb]:bg-white
                            [&::-webkit-slider-thumb]:ring-[4px]
                            [&::-webkit-slider-thumb]:ring-amber-500
                            [&::-webkit-slider-thumb]:rounded-full
                            [&::-webkit-slider-thumb]:transform translate-y-[-40%]
                          "
                          value={scores[trainee._id] || 0}
                          onChange={(e) => {
                            const newScore = parseInt(e.target.value, 10);
                            setScores((prevScores) => ({ ...prevScores, [trainee._id]: newScore }));            
                            const updatedTrainees = getValues("trainees").map((t) =>
                              t.id === trainee._id ? { ...t, score: newScore } : t
                            );
                            setValue("trainees", updatedTrainees);
                          }}
                        />
                        <span className="text-sm text-gray-500">{scores[trainee._id] || 0}%</span>
                      </div>
                      <div className="flex flex-col w-full gap-4 h-full">
                        {formCertificates.map((certificate, certIndex) => {
                          const cert = certificates.find((c) => c._id === certificate.id);
                          const certRubrics = cert ? cert.rubrics : [];

                          return (
                            <div key={certIndex} className="w-full flex flex-col">
                              {/* Certificate Header */}
                              <h2 className="text-lg font-semibold text-gray-700">
                                {cert?.name || "Unknown Certificate"}
                              </h2>

                              {/* Rubrics for This Certificate */}
                              {certRubrics.length > 0 ? (
                                <div className="flex flex-col mt-2 gap-2 ">
                                  {certRubrics.map((rubric, rubricIndex) => (
                                    <div
                                      key={rubricIndex}
                                      className="w-full h-fit rounded-md items-center justify-start gap-4 flex "
                                    >
                                      <input
                                        type="checkbox"
                                        onChange={(e) => {
                                          const isChecked = e.target.checked;
                                          const updatedTrainees = getValues("trainees").map((t) => {
                                            if (t.id === trainee._id) {
                                              const updatedRubrics = t.rubrics.map((r) => {
                                                if (r.certificateId === certificate.id) {
                                                  if (isChecked) {
                                                    return { ...r, rubrics: [...r.rubrics, rubric] };
                                                  } else {
                                                    return { ...r, rubrics: r.rubrics.filter((rr) => rr !== rubric) };
                                                  }
                                                }
                                                return r;
                                              });
                                              return { ...t, rubrics: updatedRubrics };
                                            }
                                            return t;
                                          });
                                          setValue("trainees", updatedTrainees);
                                        }}
                                        checked={watch("trainees").some((t) => {
                                          if (t.id === trainee._id) {
                                            const rubricData = t.rubrics.find((r) => r.certificateId === certificate.id);
                                            return rubricData?.rubrics.includes(rubric);
                                          }
                                          return false;
                                        })}
                                        className="w-4 h-4 rounded-md flex-shrink-0"
                                      />

                                      <span className="text-sm font-medium text-gray-500">{rubric}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-500 text-sm">No rubrics available for this certificate.</p>
                              )}
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  );
                })}
              </div>
            ): (
              <div className="w-full rounded-md ring-1 ring-gray-200 h-40 mt-2 flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
                  <User className="w-6 h-6 stroke-2 stroke-gray-500" />
                </div>
                <span className="text-gray-500 text-sm px-12 text-center">
                  No trainees selected. Please use the search box above to find and select trainees.
                </span>          
              </div>
            )}
          </div>
        </>
      )}
      <div className="w-full flex items-center justify-end gap-4 mt-6">
        <button type="button" className="w-24" onClick={handleClose}>Cancel</button>
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
          Save
        </Button>
      </div>
    </form>
  );
};

export default AddNewTrainingForm;
