import React, { useState, useEffect } from 'react';
import { Building } from 'lucide-react';
import { supabase } from './lib/supabase';
import ResourceTabs from './components/ResourceTabs';
import HallDashboard from './components/HallDashboard';
import TopHalls from './components/TopHalls';
import Timeline from './components/Timeline';
import ProgressChart from './components/ProgressChart';
import CumulativeLeaderboard from './components/CumulativeLeaderboard';
import AdminDataInput from './components/AdminDataInput';
import ResultsPage from './components/ResultsPage';
import Auth from './components/Auth';
import { processData, generateTimelineEvents, generateChartData, calculateCumulativeScores } from './utils';
import { historicalData } from './data/historicalData';
import { ConsumptionData } from './types';

function App() {
  const [selectedHall, setSelectedHall] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState(historicalData.length);
  const [weeklyData, setWeeklyData] = useState<ConsumptionData[]>(historicalData);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setIsAdmin(!!session);
    });
  }, []);

  const processedData = processData(weeklyData.slice(0, selectedWeek));
  const timelineEvents = generateTimelineEvents(weeklyData);
  const cumulativeScores = calculateCumulativeScores(weeklyData.slice(0, selectedWeek));
  const showResults = weeklyData.length === 18;

  const handleNewWeekData = (newData: ConsumptionData) => {
    setWeeklyData(prevData => [...prevData, newData]);
    setSelectedWeek(prev => prev + 1);
  };

  const handleAdminClick = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.auth.signOut();
      setIsAdmin(false);
    } else {
      setShowAuth(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showResults && <ResultsPage data={cumulativeScores} />}
      
      <header className="bg-[#041E42] text-white">
        <div className="max-w-[70%] mx-auto px-4">
          <div className="py-2 text-sm border-b border-[#1d3352]">
            <nav className="flex justify-between items-center">
              <div className="flex space-x-6">
                <a href="#" className="hover:text-blue-200"> </a>
                <a href="#" className="hover:text-blue-200"> </a>
                <a href="#" className="hover:text-blue-200"> </a>
              </div>
              <button
                onClick={handleAdminClick}
                className={`text-sm px-3 py-1 rounded-md transition-colors ${
                  isAdmin 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {isAdmin ? 'Logout' : 'Admin Login'}
              </button>
            </nav>
          </div>
          <div className="py-8">
            <div className="flex items-center space-x-3">
              <Building className="h-10 w-10 text-[#C4D7E0]" />
              <div>
                <h1 className="text-4xl font-bold font-serif">Georgetown Green Challenge</h1>
                <div className="text-[#C4D7E0] mt-2">
                  <p className="text-lg">Spring 2024 Season</p>
                  <p className="text-sm font-medium">Competition ends May 1st, 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-[#C4D7E0] py-4">
        <div className="max-w-[70%] mx-auto px-4">
          <nav className="flex space-x-6 text-[#041E42] font-medium">
            <a href="#" className="hover:text-blue-800"> </a>
            <a href="#" className="hover:text-blue-800"> </a>
            <a href="#" className="hover:text-blue-800"> </a>
            <a href="#" className="hover:text-blue-800"> </a>
          </nav>
        </div>
      </div>

      <main className="max-w-[70%] mx-auto px-4 py-8">
        <Timeline
          events={timelineEvents}
          onWeekSelect={setSelectedWeek}
          selectedWeek={selectedWeek}
        />

        {isAdmin && (
          <div className="mb-8">
            <AdminDataInput onDataSubmit={handleNewWeekData} />
          </div>
        )}

        <TopHalls
          data={cumulativeScores}
          onHallSelect={setSelectedHall}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100 sticky top-4">
              <h2 className="text-2xl font-serif text-[#041E42] mb-6">Overall Standings</h2>
              <CumulativeLeaderboard
                data={cumulativeScores}
                onHallSelect={setSelectedHall}
                compact={true}
              />
            </div>
          </div>

          <div className="lg:col-span-8">
            {selectedHall && (
              <div className="mb-8">
                <ProgressChart
                  data={generateChartData(weeklyData.slice(0, selectedWeek), selectedHall)}
                  hallName={selectedHall}
                />
              </div>
            )}

            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-serif text-[#041E42] mb-6">Weekly Rankings</h2>
              <ResourceTabs
                data={processedData}
                onHallSelect={setSelectedHall}
              />
            </div>
          </div>
        </div>
      </main>

      {selectedHall && (
        <HallDashboard
          hallName={selectedHall}
          data={processedData}
          onClose={() => setSelectedHall(null)}
        />
      )}

      {showAuth && (
        <Auth 
          onSuccess={() => {
            setShowAuth(false);
            setIsAdmin(true);
          }}
          onClose={() => setShowAuth(false)}
        />
      )}

      <footer className="bg-[#041E42] text-white py-8 mt-12">
        <div className="max-w-[70%] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <p>37th and O Streets, N.W.</p>
              <p>Washington D.C. 20057</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-200">Sustainability Office</a></li>
                <li><a href="#" className="hover:text-blue-200">Energy Dashboard</a></li>
                <li><a href="#" className="hover:text-blue-200">Get Involved</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Follow Us</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-200">Facebook</a></li>
                <li><a href="#" className="hover:text-blue-200">Twitter</a></li>
                <li><a href="#" className="hover:text-blue-200">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#1d3352] text-sm text-[#C4D7E0]">
            <p>© {new Date().getFullYear()} Georgetown University</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;