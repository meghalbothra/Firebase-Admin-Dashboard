import  { useState, useEffect } from 'react';
import { Users, Database, Activity, AlertTriangle, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from './Header';
import { StatCard } from './StatCard';
import { TabPanel } from './TabPanel';
import { UsersTab } from './tabs/UsersTab';
import { ErrorsTab } from './tabs/ErrorsTab';
import { SearchBar } from './SearchBar';
import { db } from '../firebase/firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import DatabaseMonitor from './DatabaseMonitor';
import { PerformanceMetrics } from "../components/PerformanceMetrics";
import { useLocation, useNavigate } from 'react-router-dom';
import Chatbot from './Chatbot';
import { User } from './types';


// interface User {
//   id: string;
//   email: string;
//   role: string;
// }

export function Dashboard() {
  // Changed default activeTab to 0 (Performance)
  const [activeTab, setActiveTab] = useState(0);
  const [realTimeData, setRealTimeData] = useState({
    totalUsers: 0,
    databaseOps: 0,
    apiRequests: 0,
    activeErrors: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [totalApiCalls, setTotalApiCalls] = useState(0);

  const tabs = ['Performance', 'Database', 'Users', 'Errors'];

  // Keep existing useEffects and handlers...
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'dashboardStats'), (snapshot) => {
      snapshot.forEach((doc) => {
        setRealTimeData((prevData) => ({
          ...prevData,
          ...doc.data(),
        }));
      });
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'apiMetrics'), (snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data();
        const totalCalls = data?.totalCalls || 0;
        setRealTimeData((prevData) => ({
          ...prevData,
          apiRequests: totalCalls,
          databaseOps: totalCalls,
        }));
        setTotalApiCalls(totalCalls);
      });
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const token = location.state?.token || localStorage.getItem('authToken');
    if (!token) {
      setError('Authentication token is missing. Please log in again.');
      navigate('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/users?token=${token}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.statusText}`);
        }
        const data: User[] = await response.json();
        setUsers(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'An error occurred while fetching users.');
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [location.state, navigate]);

  const handleCardClick = (section: string) => {
    const tabIndex = tabs.findIndex((tab) => tab === section);
    if (tabIndex !== -1) {
      setActiveTab(tabIndex);
    }
  };

  const handleErrorCountChange = (count: number) => {
    setRealTimeData((prevData) => ({
      ...prevData,
      activeErrors: count,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
        </div>
      </div>
    );
  }

  const getStatCardInfo = () => ({
    totalUsers: users.length,
    activeErrors: realTimeData.activeErrors,
    apiRequests: realTimeData.apiRequests,
    databaseOps: realTimeData.databaseOps,
  });
  

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg max-w-lg w-full shadow-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <h3 className="text-red-800 font-semibold text-lg">Error</h3>
              <p className="text-red-700 mt-2">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Enhanced Sidebar with smooth transitions */}
      <div 
        className={`
          fixed h-full bg-white border-r border-gray-200 
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'w-64' : 'w-20'}
        `}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div className={`flex items-center ${!isSidebarOpen && 'justify-center w-full'}`}>
            <Database className="h-8 w-8 text-indigo-600 transition-transform duration-300" />
            <span className={`ml-2 font-semibold text-gray-900 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
              Dashboard
            </span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className={`
              text-gray-500 hover:text-gray-600 p-1 rounded-full
              hover:bg-gray-100 transition-all duration-300
              ${!isSidebarOpen && 'absolute right-0 transform translate-x-1'}
            `}
          >
            {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>

        </div>
        <nav className="mt-6">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`
                w-full flex items-center px-4 py-3 text-sm
                transition-all duration-300 ease-in-out
                ${activeTab === index 
                  ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600' 
                  : 'text-gray-600 hover:bg-gray-50'
                }
                ${!isSidebarOpen && 'justify-center'}
              `}
            >
              <div className="relative flex items-center">
                {index === 0 && <Activity className={`h-5 w-5 ${!isSidebarOpen && 'transform scale-110'}`} />}
                {index === 1 && <Database className={`h-5 w-5 ${!isSidebarOpen && 'transform scale-110'}`} />}
                {index === 2 && <Users className={`h-5 w-5 ${!isSidebarOpen && 'transform scale-110'}`} />}
                {index === 3 && <AlertTriangle className={`h-5 w-5 ${!isSidebarOpen && 'transform scale-110'}`} />}
                <span className={`ml-3 transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
                  {tab}
                </span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content with adjusted margin */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
      <Header>
        
      </Header>

        <main className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={users.length.toString()}
              icon={<Users className="h-8 w-8 text-blue-600" />}
              trendIcon={<ChevronUp className="h-4 w-4" />} 
              className="bg-white shadow-lg rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-300"
              onClick={() => handleCardClick('Users')}
            />
            <StatCard
              title="Active Errors"
              value={realTimeData.activeErrors.toString()}
              icon={<AlertTriangle className="h-8 w-8 text-red-600" />}
              trendIcon={<ChevronDown className="h-4 w-4" />} 
              className="bg-white shadow-lg rounded-xl border border-gray-100 hover:border-red-200 transition-all duration-300"
              onClick={() => handleCardClick('Errors')}
            />
            <StatCard
              title="API Requests"
              value={totalApiCalls.toString()}
              icon={<Activity className="h-8 w-8 text-emerald-600" />}
              trendIcon={<ChevronDown className="h-4 w-4" />} 
              className="bg-white shadow-lg rounded-xl border border-gray-100 hover:border-emerald-200 transition-all duration-300"
              onClick={() => handleCardClick('Performance')}
            />
            <StatCard
              title="Database Operations"
              value={realTimeData.databaseOps.toString()}
              icon={<Database className="h-8 w-8 text-purple-600" />}
              trendIcon={<ChevronUp className="h-4 w-4" />} 
              className="bg-white shadow-lg rounded-xl border border-gray-100 hover:border-purple-200 transition-all duration-300"
              onClick={() => handleCardClick('Database')}
            />
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6">
              <TabPanel value={activeTab} index={0}>
                <PerformanceMetrics />
              </TabPanel>
              <TabPanel value={activeTab} index={1}>
                <DatabaseMonitor />
              </TabPanel>
              <TabPanel value={activeTab} index={2}>
                <UsersTab users={users} loading={loading}/>
              </TabPanel>
              <TabPanel value={activeTab} index={3}>
                <ErrorsTab onErrorCountChange={handleErrorCountChange} />
              </TabPanel>
            </div>
          </div>
        </main>
        <Chatbot statCardInfo={getStatCardInfo()} />
      </div>
    </div>
  );
}

export default Dashboard;