import { format, parseISO, isFuture } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Users, 
  XCircle,
  FileText,
  Download
} from 'lucide-react';
import SeminarRegistrationButton from './SeminarRegistrationButton';

export default function SeminarDetails({ 
  seminar, 
  onClose, 
  isRegistered, 
  onRegister, 
  onCancelRegistration, 
  onExportCalendar,
  registrationLoading = false
}) {
  if (!seminar) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-8 border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-start mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight pr-8">{seminar.title}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          <XCircle className="h-6 w-6 sm:h-7 sm:w-7" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-5">
        <div className="col-span-1 md:col-span-8">
          <div className="prose dark:prose-invert max-w-none mb-6 sm:mb-8 text-gray-600 dark:text-gray-300 prose" 
               dangerouslySetInnerHTML={{ __html: seminar.content }} />
          
          <div className="space-y-4 mb-6 sm:mb-8 bg-gray-50 dark:bg-gray-700/50 p-4 sm:p-6 rounded-xl">
            <div className="flex items-center text-gray-700 dark:text-gray-200">
              <Calendar className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
              <span className="font-medium">{seminar.formatted_date || format(parseISO(seminar.date), 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center text-gray-700 dark:text-gray-200">
              <Clock className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
              <span className="font-medium">{seminar.formatted_time || seminar.time}</span>
            </div>
            <div className="flex items-center text-gray-700 dark:text-gray-200">
              <MapPin className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
              <span className="font-medium break-words">{seminar.location}</span>
            </div>
            <div className="flex items-center text-gray-700 dark:text-gray-200">
              <User className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
              <span className="font-medium">Host: {seminar.host?.name || 'Unknown'}</span>
            </div>
            {seminar.capacity && (
              <div className="flex items-center text-gray-700 dark:text-gray-200">
                <Users className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
                <span className="font-medium">Capacity: {seminar.capacity}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-4">
          {seminar.featured_image && (
            <div className="mb-6 sm:mb-8">
              <img 
                src={seminar.featured_image} 
                alt={seminar.title}
                className="w-full h-auto rounded-2xl shadow-md object-cover" 
              />
            </div>
          )}
          
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
              <FileText className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
              Seminar Documents
            </h3>
            
            {seminar.documents && seminar.documents.length > 0 ? (
              <ul className="space-y-3">
                {seminar.documents.map((doc) => (
                  <li key={doc.id}>
                    <a
                      href={doc.url}
                      download={doc.filename}
                      className="flex items-center p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/70 rounded-lg transition-colors group"
                    >
                      <Download className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0 group-hover:text-blue-600" />
                      <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-white break-words">
                        {doc.title}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No documents available for this seminar.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}