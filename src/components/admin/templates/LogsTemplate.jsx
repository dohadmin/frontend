import { Document, Page, Text, View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";

const formatDate = () => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date().toLocaleDateString(undefined, options);
}

// https://react-pdf-repl.vercel.app/
const LogsTemplate = ({ logs }) => {
  const tw = createTw({
    theme: {
      fontFamily: {
        sans: ['Helvetica', 'sans-serif'], 
      },
    },
  });
  

  return (
    <Document>
      <Page size="A4" style={tw('p-12 font-sans')} wrap>
        <View style={tw('h-24 border-b border-gray-200 flex flex-row items-center justify-between mb-6 w-full')} fixed>
        <Text style={tw('text-md text-amber-500 uppercase tracking-tighter text-center font-bold')}>
          Department of HEALTH
        </Text>
        <Text style={tw('text-md text-gray-500 uppercase tracking-tighter text-center font-bold')}>
          {formatDate(new Date().toISOString())}
        </Text>
        </View>        
        <View style={tw('mb-6 w-full ')}>
          <Text style={tw('text-md text-gray-950 uppercase tracking-tighter text-center font-bold mb-6')}>
            SYSTEM LOGS REPORT
          </Text>
          <View style={tw('w-full mb-4 h-full z-50 flex flex-col')}>
            {/* Table Header */}
            <View 
              style={tw('flex flex-row text-sm border border-gray-200 px-4 py-2')}
            >
              <Text style={tw('w-[20rem] text-start uppercase text-xs tracking-wide')}>Person</Text>
              <Text style={tw('w-[50rem] text-start uppercase text-xs tracking-wide')}>Description</Text>
              <Text style={tw('w-[20rem] text-start uppercase text-xs tracking-wide px-4')}>ACTION</Text>
              <Text style={tw('w-[20rem] text-start uppercase text-xs tracking-wide')}>DATE</Text>
            </View>
          {logs.map(( log , index) => (
            <View 
                style={tw('flex flex-row text-sm border-x border-b border-gray-200 px-4 py-2')}
                key={index}
              >
                <Text style={tw('w-[20rem] text-start uppercase text-sm tracking-wide')}>{log.userId.firstName} {log.userId.lastName}</Text>
                <Text style={tw('w-[50rem] text-start uppercase text-xs text-gray-500 tracking-wide')}>{log.description}</Text>
                <Text style={tw('w-[20rem] text-start uppercase text-xs tracking-wide px-4')}>{log.action}</Text>
                <Text style={tw('w-[20rem] text-start uppercase text-xs tracking-wide')}>{formatDate(log.createdAt)}
                </Text>
              </View>
          ))}


          </View>
        </View>
  
      </Page>
    </Document>
  );
};

export default LogsTemplate;

    
