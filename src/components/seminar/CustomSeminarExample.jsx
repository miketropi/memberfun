import { useState, useEffect } from 'react';
import { seminarsAPI } from '../../api/apiService';
import { isPast, parseISO } from 'date-fns';
import { 
  SeminarTabs, 
  SeminarList, 
  SeminarDetails,
  SeminarRegistrationForm
} from './index';

export default function CustomSeminarExample() {
  const [upcomingSeminars, setUpcomingSeminars] = useState([]);
  const [pastSeminars, setPastSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedSeminar, setSelectedSeminar] = useState(null);
  const [registeredSeminars, setRegisteredSeminars] = useState([]);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  
  useEffect(() => {
    fetchSeminars();
  }, []);

  const fetchSeminars = async () => {
    try {
      setLoading(true);
      
      // Fetch all seminars
      const allSeminars = await seminarsAPI.getUpcomingSeminars({
        limit: 50,
        offset: 0
      });
      
      // Split into upcoming and past
      const upcoming = (allSeminars || []).filter(seminar => 
        !isPast(parseISO(seminar.date))
      );
      
      const past = (allSeminars || []).filter(seminar => 
        isPast(parseISO(seminar.date))
      );
      
      setUpcomingSeminars(upcoming);
      setPastSeminars(past);
      setLoading(false);
    } catch (err) {
      setError('Failed to load seminars. Please try again later.');
      setLoading(false);
      console.error('Error fetching seminars:', err);
    }
  };

  const handleSeminarClick = (seminar) => {
    setSelectedSeminar(seminar);
    setShowRegistrationForm(false);
  };

  const handleRegister = (seminarId) => {
    // Instead of directly registering, show the registration form
    setShowRegistrationForm(true);
  };

  const handleRegistrationComplete = (seminarId) => {
    if (seminarId) {
      // Add to registered seminars
      setRegisteredSeminars([...registeredSeminars, seminarId]);
    }
    
    // Close the form and details
    setShowRegistrationForm(false);
    setSelectedSeminar(null);
    
    // Refresh the seminars list
    fetchSeminars();
  };

  const handleCancelRegistration = async (seminarId) => {
    try {
      setRegistrationLoading(true);
      await seminarsAPI.cancelRegistration(seminarId);
      setRegisteredSeminars(registeredSeminars.filter(id => id !== seminarId));
      setRegistrationLoading(false);
    } catch (err) {
      console.error('Error canceling registration:', err);
      setRegistrationLoading(false);
    }
  };

  const handleExportCalendar = async (seminarId) => {
    try {
      const blob = await seminarsAPI.exportToIcal(seminarId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `seminar-${seminarId}.ics`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error exporting calendar:', err);
    }
  };

  const isRegistered = (seminarId) => {
    return registeredSeminars.includes(seminarId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Seminars</h1>
        <SeminarTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {showRegistrationForm && selectedSeminar ? (
        <SeminarRegistrationForm
          seminarId={selectedSeminar.id}
          onRegistrationComplete={handleRegistrationComplete}
          initialData={{
            name: '',
            email: '',
            phone: '',
            company: '',
            dietary_requirements: '',
            special_requests: ''
          }}
        />
      ) : selectedSeminar ? (
        <SeminarDetails
          seminar={selectedSeminar}
          onClose={() => setSelectedSeminar(null)}
          isRegistered={isRegistered(selectedSeminar.id)}
          onRegister={handleRegister}
          onCancelRegistration={handleCancelRegistration}
          onExportCalendar={handleExportCalendar}
          registrationLoading={registrationLoading}
        />
      ) : (
        <div>
          {activeTab === 'upcoming' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Upcoming Seminars</h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {upcomingSeminars.length} upcoming seminars
                </div>
              </div>
              <SeminarList
                seminars={upcomingSeminars}
                isRegisteredFn={isRegistered}
                onSeminarClick={handleSeminarClick}
                emptyMessage="No upcoming seminars available."
              />
            </>
          )}

          {activeTab === 'past' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Past Seminars</h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {pastSeminars.length} past seminars
                </div>
              </div>
              <SeminarList
                seminars={pastSeminars}
                isRegisteredFn={isRegistered}
                onSeminarClick={handleSeminarClick}
                isPast={true}
                emptyMessage="No past seminars available."
              />
            </>
          )}
        </div>
      )}
    </div>
  );
} 