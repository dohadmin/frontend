import { useState } from 'react'
import Sidebar from '../../components/super/Sidebar'
import Header from '../../components/super/Header'
import AuditTrailBranch from '../../components/super/branch/AuditTrailBranch'
import ComboBox from '../../components/ui/ComboBox'
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GridLoader } from "react-spinners";
import Button from '../../components/ui/Button'
import { pdf } from '@react-pdf/renderer'
import LogsTemplate from '../../components/admin/templates/LogsTemplate'

export const convertMonthToNumber = (month) => {
  switch (month) {
    case "January":
      return 1;
    case "February":
      return 2;
    case "March":
      return 3;
    case "April":
      return 4;
    case "May":
      return 5;
    case "June":
      return 6;
    case "July":
      return 7;
    case "August":
      return 8;
    case "September":
      return 9;
    case "October":
      return 10;
    case "November":
      return 11;
    case "December":
      return 12;
    default:
      return 0;
  }
}


const LogsPage = () => {

  const [year, setYear] = useState('2024')
  const [month, setMonth] = useState('November')
  const {data: logs, isLoading } = useQuery({
    queryKey: ['superAuditTrailTableData', year, month],
    queryFn: async () => {
      try {
        const convertedMonth = convertMonthToNumber(month);
        const response = await axios.get('http://localhost:8080/audit/get-audit-trails',{
          params: {
            month: convertedMonth,
            year: year,
          },
        });
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
  
  const handlePrint = async () => {
    const blob = await pdf(<LogsTemplate logs={logs} />).toBlob();
    const newWindow = window.open(URL.createObjectURL(blob), '_blank');
    if (newWindow) {
      newWindow.print();
    }
  };

  return (
    <div className="w-full h-full flex items-start justify-center bg-white font-inter flex-grow-0 overflow-x-hidden">
      <Sidebar />
      
      <div className="w-full h-full flex flex-col overflow-hidden">
        {/* Header */}
        <Header name="Audit Trails" />

        <div className="flex items-center justify-between px-6 h-20 border-b border-stone-200">
          <div className="w-fit flex gap-4 items-center ">
            <ComboBox 
              value={month}
              className="w-40"
              onChange={setMonth}
              options={[
                'None',
                'January', 
                'February', 
                'March', 
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
              ]}
              placeholder="month"
            />
            <ComboBox 
              value={year}
              onChange={setYear}
              options={[
                '2021', 
                '2022', 
                '2023', 
                '2024',
                '2025',
                '2026',
                '2027',
                '2028',
                '2029',
                '2030',
              ]}
              placeholder="year"
              className="w-20"
            />
          </div>
          <Button
            className="px-4"
            onClick={handlePrint}
          >
            Print Logs
          </Button>
   
        </div>

        {/* Table */}
        <div className="flex w-full h-full overflow-hidden">
          <AuditTrailBranch logs={logs} />
        </div>
      </div>
    </div>
  )
}

export default LogsPage