import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useUserStore from '../store/userStore';

const Dashboard = () => {
  const { isAuthenticated } = useAuthStore();
  const { userData, isLoading: userLoading, fetchUserData } = useUserStore();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([
    { id: 1, read: false, message: 'Welcome to your dashboard!', date: '2023-03-15' },
    { id: 2, read: false, message: 'Your membership will renew in 30 days', date: '2023-03-14' },
    { id: 3, read: true, message: 'New document added to your library', date: '2023-03-10' },
  ]);
  const [documents, setDocuments] = useState([
    { id: 1, title: 'Membership Agreement', type: 'PDF', date: '2023-01-15', size: '1.2 MB' },
    { id: 2, title: 'Welcome Package', type: 'PDF', date: '2023-01-15', size: '3.5 MB' },
    { id: 3, title: 'Member Benefits Guide', type: 'PDF', date: '2023-02-10', size: '2.1 MB' },
    { id: 4, title: 'Community Guidelines', type: 'DOC', date: '2023-02-15', size: '0.8 MB' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated, fetchUserData]);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Filter documents based on search term
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {userData?.name}!</h1>
        <p className="opacity-90">Your membership is currently {userData?.membershipStatus.toLowerCase()}</p>
      </div>

      {/* Dashboard Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Notifications
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {notifications.filter(n => !n.read).length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Membership Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Membership Details</h3>
                <div className="space-y-2">
                  <p className="flex justify-between">
                    <span className="text-gray-500">Type:</span>
                    <span className="font-medium">{userData?.membershipType}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className="font-medium">{userData?.membershipStatus}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Member Since:</span>
                    <span className="font-medium">{userData?.memberSince}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Next Billing:</span>
                    <span className="font-medium">{userData?.nextBillingDate}</span>
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Activity Summary</h3>
                <div className="space-y-2">
                  <p className="flex justify-between">
                    <span className="text-gray-500">Logins:</span>
                    <span className="font-medium">{userData?.activityStats.logins}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Documents Viewed:</span>
                    <span className="font-medium">{userData?.activityStats.documentsViewed}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Messages:</span>
                    <span className="font-medium">{userData?.activityStats.messagesReceived}</span>
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition">
                    Update Profile
                  </button>
                  <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded transition">
                    View Benefits
                  </button>
                  <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Logged in from new device</p>
                    <p className="text-sm text-gray-500">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Downloaded Member Benefits Guide</p>
                    <p className="text-sm text-gray-500">5 days ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Received new message from admin</p>
                    <p className="text-sm text-gray-500">1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Document Library</h2>
            
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((document) => (
                      <tr key={document.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{document.title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {document.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {document.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {document.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                          <button className="text-green-600 hover:text-green-900">Download</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No documents found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Notifications</h2>
              <button 
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            </div>
            
            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 rounded-lg border ${notification.read ? 'bg-white' : 'bg-blue-50 border-blue-200'}`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className={`${notification.read ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
                          {notification.message}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{notification.date}</p>
                      </div>
                      {!notification.read && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No notifications to display.</p>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={userData?.name}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={userData?.email}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input 
                      type="password" 
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input 
                      type="password" 
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Notification Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input 
                      id="email-notifications" 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700">
                      Email Notifications
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      id="sms-notifications" 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="sms-notifications" className="ml-2 block text-sm text-gray-700">
                      SMS Notifications
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      id="marketing-emails" 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="marketing-emails" className="ml-2 block text-sm text-gray-700">
                      Marketing Emails
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md transition">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 