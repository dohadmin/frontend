
import { getColorForInitial } from "../../../utils/NameColor";

const AuditTrailBranch = ({
  logs
}) => {


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };



  const getStatusColor = (status) => {
    switch (status) {
      case 'delete':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-500',
          ring: 'ring-rose-500',
          label: "Delete"
        };
      case 'create':
        return {
          bg: 'bg-purple-50',
          text: 'text-purple-500',
          ring: 'ring-purple-500',
          label: "Create"
        };
      case 'update':
        return {
          bg: 'bg-cyan-50',
          text: 'text-cyan-500',
          ring: 'ring-cyan-500',
          label: "Update"
        };
      default:
        return {
          bg: '',
          text: ''
        };
    }
  };


  return (
    <div className="w-full h-full flex flex-col">
        
      <div 
        className="h-16 grid grid-cols-6 border-b border-stone-200 text-sm text-gray-950 font-medium overflow-y-scroll "
        style={{gridTemplateColumns: '20% auto 10%  15%'}}
        >
        {[  "TRAINER","DESCRIPTION" , "ACTION", "DATE"].map((header, index) => (
          <div key={index} className="uppercase px-4 h-full flex items-center justify-start">
            {header}
          </div>
        ))}
      </div>
      <div className="flex flex-col h-full overflow-y-scroll w-full">
        {logs.map(( log , index) => {
          const { bg, text, ring, label } = getStatusColor(log.action);
          const initials = log.userId.firstName[0] + log.userId.lastName[0];
          const bgColor = getColorForInitial(initials[0]);

          return (
            <div
              key={index}
              className="h-16 flex-shrink-0 grid grid-flow-col text-sm text-stone-900 font-medium border-b border-stone-200 decoration-amber-500"
              style={{gridTemplateColumns: '20% auto 10% 15%'}}
            >
              <div className="px-4 h-full flex items-center justify-start  border-stone-200">
                <div>
                  {log.userId.avatar ? (
                    <img src={log.userId.avatar} alt="avatar" className="w-7 h-7 rounded-full mr-2" />
                  ) : (
                    <div className={`w-7 h-7 rounded-full ${bgColor} text-white flex items-center justify-center mr-2`}>
                      {initials}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-700 font-medium">{log.userId.firstName} {log.userId.lastName}</span>
                </div>
              </div>
              <div className="px-4 h-full flex items-center justify-start  border-stone-200">
                 <span className="truncate max-w-full overflow-hidden">
                  {log.description}
                </span>
              </div>
              <div className="px-4 h-full flex items-center justify-start  border-stone-200">
                <span
                  className={`px-2 py-1 rounded-md uppercase ring-1 text-xs ${bg} ${text} ${ring}`}
                >
                  {label}
                </span>
              </div>
              <div className="px-4 h-full flex items-center justify-start  border-stone-200">
                  {formatDate(log.createdAt)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AuditTrailBranch;