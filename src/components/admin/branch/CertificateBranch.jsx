import { Pencil} from 'lucide-react';
import useAccountStore from '../../../stores/admin/AccountStore';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { GridLoader } from 'react-spinners';

const CertificateBranch = ({ setActiveBranch, setSelectedCertificate, setEditSelectedSize, setEditLayers }) => {

  const certificates = useAccountStore((state) => state.certificates);
  const setCertificates = useAccountStore((state) => state.setCertificates);


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };



  const { isLoading, isError } = useQuery({
    queryKey: ['adminCertificateTableData'],
    queryFn: async () => {
      try {
        const response = await axios.get('https://server-np0x.onrender.com/certificate/get-certificates');
        setCertificates(response.data);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <GridLoader color="orange" size={15} />
      </div>
    );
  }  
  if (isError) return <div>Error fetching data</div>;


  const handleOpenEditModal = (e, certificate) => {
    e.stopPropagation();
    setActiveBranch("update")
    setSelectedCertificate(certificate);
    setEditSelectedSize(certificate.size);
    setEditLayers(certificate.layers);
  }


  const convertToPlural = (time, timeUnit) => {
    const pluralUnits = {
      Year: 'Years',
      Day: 'Days',
      Month: 'Months',
      Week: 'Weeks'
    };
  
    if (time === 1) {
      return `${time} ${timeUnit}`;
    } else {
      return `${time} ${pluralUnits[timeUnit]}`;
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Revoked':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-500',
          ring: 'ring-rose-500'
        };
      case 'Expired':
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-500',
          ring: 'ring-gray-500'
        };
      case 'Active':
        return {
          bg: 'bg-green-50',
          text: 'text-green-500',
          ring: 'ring-green-500'
        };
      default:
        return {
          bg: '',
          text: ''
        };
    }
  };
  
  return (
    <div className="w-full h-full flex flex-col overflow-x-hidden">
        
      {/*  */}
      <div 
        className="h-16 grid grid-cols-6 border-b border-stone-200 text-sm text-stone-950 font-medium overflow-y-scroll "
        style={{gridTemplateColumns: '20% 20% 15% 10% 15% 12% 8%'}}
        >
        {[  "Certificate Name", "Description", "Expiry", "Size", "Status", "created at", ""].map((header, index) => (
          <div key={index} className="uppercase px-4 h-full flex items-center justify-start">
            {header}
          </div>
        ))}
      </div>
      <div className="flex flex-col h-full overflow-y-scroll ">
        {certificates.map((certificate, index) => {

          const { bg, text, ring } = getStatusColor(certificate.status);
          return (
            <div
              key={index}
              className="h-16 grid grid-flow-col text-sm text-stone-900 font-medium border-b border-stone-200 decoration-amber-500"
              style={{gridTemplateColumns: '20% 20% 15% 10% 15% 12% 8%'}}
            >
              <div className="px-4 h-full flex items-center justify-start gap-2  border-stone-200" >
                <span className="truncate max-w-full overflow-hidden">
                  {certificate.name}
                </span>
              </div>
              <div className="px-4 h-full flex items-center justify-start gap-2  border-stone-200" >
                <span className="truncate max-w-full overflow-hidden">
                  {certificate.description}
                </span>
              </div>
              <div className="px-4 h-full flex items-center justify-start gap-2  border-stone-200">
                {convertToPlural(certificate.expiry.time, certificate.expiry.timeUnit)}
              </div>
              <div className="px-4 h-full flex items-center justify-start  border-stone-200">
                {certificate.size}
              </div>
              <div className="px-4 h-full flex items-center justify-start  border-stone-200">
                <span className={`px-2 py-1  flex items-center justify-center rounded-md text-xs uppercase ring-1 ${bg} ${text} ${ring} `}>
                  {certificate.status}
                </span>
              </div>
              <div className="px-4 h-full flex items-center justify-start gap-2  border-stone-200">
                {formatDate(certificate.createdAt)}
              </div>
              <div className="px-4 h-full flex items-center justify-center gap-2 border-stone-200 ">
                <button
                  className="w-10 h-10 flex-shrink-0 flex items-center justify-center"
                  type="button"
                  onClick={(e) => handleOpenEditModal(e, certificate)}
                >
                  <Pencil className="w-4 h-4 stroke-gray-500" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CertificateBranch;