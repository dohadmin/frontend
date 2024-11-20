import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ScaleLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import PasswordInput from '../../ui/PasswordInput.jsx';
import NewCertificateSchema from '../../../schemas/NewCertificateSchema.js';
import Button from '../../ui/Button.jsx';
import useAccountStore from '../../../stores/admin/AccountStore.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../../ui/Input.jsx';
import ComboBox from '../../ui/ComboBox.jsx';
import TextArea from '../../ui/TextArea.jsx';
import { Star, X } from 'lucide-react';

const UpdateCertificateForm = ({ setOpen, layers, size, setActiveBranch, selectedCertificate, template}) => {
  const user = useAccountStore(state => state.user);
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const [isLoading, setLoading] = useState(false);


  const { control, handleSubmit, formState: { errors }, reset, setError, getValues, watch } = useForm({
    resolver: zodResolver(NewCertificateSchema),
    defaultValues: {
      template: template ? template : selectedCertificate.template,
      _id: selectedCertificate._id,
      name: selectedCertificate.name,
      description: selectedCertificate.description,
      course: selectedCertificate.course,
      status: selectedCertificate.status,
      expiry: {
        time: selectedCertificate.expiry.time,
        timeUnit: selectedCertificate.expiry.timeUnit,
      },
      layers: layers,
      size: size,
      rubrics: selectedCertificate.rubrics,
    }
  });

  const rubrics = watch('rubrics');


  const onSubmit = async (data) => {
    setLoading(true);
    let newData;
    
    if (typeof data.template === "string") {
      newData = data;
    } else if (data.template === null || data.template === undefined) {
      newData = { ...data, template: null };
    } else {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'template' && value instanceof File) {
          formData.append('certificate_template', value);
        } else if (key === 'expiry' || key === 'layers') {
          // Stringify the expiry and layers fields
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      newData = formData;
    }
    
    try {
      const res = await axios.put('https://server-np0x.onrender.com/certificate/update-certificate', newData);
      queryClient.invalidateQueries({ queryKey: ['adminCertificateTableData'] });
      toast.success(res.data.message);
      setOpen(false);
      setLoading(false);
      reset();
      setActiveBranch("certificate");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  return (
    <form className=" flex flex-col items-start gap-4 h-full " onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 w-full h-full p-6">
        <div className=" flex flex-col gap-2 w-full">        
          <label className="text-sm uppercase text-neutral-700 font-medium mt-2">Certificate Name</label>
          <Controller
            name="name"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                 placeholder="eg. Basic Life Support Certificate"
                className="w-full"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                didError={!!errors.name}         
              />
            )}
          />    
        </div>
        <div className=" flex flex-col gap-2 w-full  ">        
          <label className="text-sm uppercase text-neutral-700 font-medium mt-2">Course</label>
          <Controller
            name="course"
            control={control}
            render={({ field: { value, onChange } }) => (
              <ComboBox
                value={value}
                options={[
                  "Orientation on the Universal Health Care Law",
                  "Basic Life Support",
                  "Infection Control",
                  "Fire Safety",
                  "First Aid",
                  "Basic Occupational Safety and Health",
                ]}
                className="w-full"
                placeholder="Select a course"
                didError={!!errors.course}
                onChange={(newValue) => {
                  onChange(newValue)
                }}
              />
            )}
          />
        </div>
        <div className=" flex flex-col gap-2 w-full  ">       
          <label className="text-sm uppercase text-neutral-700 font-medium mt-2">Status</label> 
          <Controller
            name="status"
            control={control}
            render={({ field: { value, onChange } }) => (
              <ComboBox
                value={value}
                options={[
                  "Active",
                  "Revoked",
                  "Expired",
                ]}
                className="w-full"
                placeholder="Select a status"
                didError={!!errors.status}
                onChange={(newValue) => {
                  onChange(newValue)
                }}
              />
            )}
          />
        </div>
        <div className=" flex flex-col gap-2 w-full  ">        
          <label className="text-sm uppercase text-neutral-700 font-medium mt-2">Expiration</label>
          <div className="flex items-center justify-center gap-4 ">
            <Controller
              name="expiry.time"
              control={control}
              render={({ field: { value, onChange } }) => (
                <ComboBox
                  value={value}
                  options={[
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 
                    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
                  ]}
                  className="w-full"
                  placeholder="Select a time"
                  didError={!!errors?.expiry?.time}
                  onChange={(newValue) => {
                    onChange(newValue)
                  }}
                />
              )}
            />
            <Controller
              name="expiry.timeUnit"
              control={control}
              render={({ field: { value, onChange } }) => (
                <ComboBox
                  value={value}
                  options={[
                    "Year",
                    "Month",
                    "Week",
                    "Day",
                  ]}
                  className="w-full"
                  placeholder="Select a expiry time unit"
                  didError={!!errors?.expiry?.timeUnit}
                  onChange={(newValue) => {
                    onChange(newValue)
                  }}
                />
              )}
            />
          </div>
        </div>

        <div className=" flex flex-col gap-2 w-full ">        
          <label className="text-sm uppercase text-neutral-700 font-medium mt-2">Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextArea
                value={value}
                placeholder="A brief description of the certificate"
                onChange={(e) => onChange(e.target.value)}
                didError={!!errors.description}
              />
            )}
          />    
        </div>
        
        <div className=" flex flex-col gap-4 w-full h-full ">
          <div className="flex items-center justify-between">
            <label className="text-sm uppercase text-neutral-700 font-medium mt-2">Rubrics</label>
            <button className="text-sm text-amber-500 font-medium" type="button" onClick={() => {
              const rubrics = getValues().rubrics
              rubrics.push("")
              reset({ ...getValues(), rubrics })
            }}>Add Rubric</button>
          </div>
          {rubrics.length > 0 ? rubrics.map((rubric, index) => (
            <div
             className=" flex flex-col gap-4 w-full"
              key={index}
            >        
              <div className="w-full items-center flex gap-4">
                <Controller
                  name={`rubrics[${index}]`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Input
                      placeholder="eg. Professionalism"
                      className="w-full"
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      didError={!!errors.rubrics?.[index]}
                    />
                  )}
                />    
                <button className="text-sm text-red-500 font-medium" type="button" onClick={() => {
                  const rubrics = getValues().rubrics
                  rubrics.splice(index, 1)
                  reset({ ...getValues(), rubrics })
                } }>
                  <X className="w-5 h-5 stroke-2 stroke-red-500" />
                </button>
              </div>
            </div>
          )) : (
            <div className="w-full rounded-md ring-1 ring-gray-200 h-40 mt-2 flex flex-col items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
                <Star className="w-6 h-6 stroke-2 stroke-gray-500" />
              </div>
              <span className="text-gray-500 text-sm px-12 text-center">
                No trainees selected. Please use the search box above to find and select trainees.
              </span>          
            </div>
          )}
        </div>

        <div className=" flex justify-end items-center gap-2 w-full p-6">        
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
            
      </div>

    </form>
  );
};

export default UpdateCertificateForm;