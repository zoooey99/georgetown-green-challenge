import React from 'react';
import { Trophy } from 'lucide-react';
import { CumulativeData } from '../types';

interface ResultsPageProps {
  data: CumulativeData[];
}

const ResultsPage: React.FC<ResultsPageProps> = ({ data }) => {
  const topFive = data.slice(0, 5);
  const trophyColors = ['text-yellow-400', 'text-gray-400', 'text-amber-600', 'text-gray-300', 'text-gray-300'];

  return (
    <div className="fixed inset-0 bg-[#041E42] bg-opacity-98 z-50 flex items-center justify-center overflow-y-auto">
      <div className="max-w-[70%] mx-auto px-4 py-12 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-serif text-center mb-4">Georgetown Green Challenge</h1>
          <h2 className="text-2xl text-center text-[#C4D7E0] mb-12">Final Results - Spring 2024</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Second Place */}
            {topFive[1] && (
              <div className="bg-white bg-opacity-10 rounded-lg p-6 text-center transform hover:scale-105 transition-transform">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <div className="text-3xl font-bold mb-2">2nd Place</div>
                <div className="text-xl font-serif mb-4">{topFive[1].name}</div>
                <div className="text-4xl font-bold text-gray-400">
                  {topFive[1].points}
                  <span className="text-lg ml-2 opacity-75">pts</span>
                </div>
              </div>
            )}

            {/* First Place */}
            {topFive[0] && (
              <div className="bg-white bg-opacity-20 rounded-lg p-8 text-center transform hover:scale-105 transition-transform border-2 border-yellow-400">
                <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
                <div className="text-4xl font-bold mb-2">1st Place</div>
                <div className="text-2xl font-serif mb-4">{topFive[0].name}</div>
                <div className="text-5xl font-bold text-yellow-400">
                  {topFive[0].points}
                  <span className="text-xl ml-2 opacity-75">pts</span>
                </div>
              </div>
            )}

            {/* Third Place */}
            {topFive[2] && (
              <div className="bg-white bg-opacity-10 rounded-lg p-6 text-center transform hover:scale-105 transition-transform">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-amber-600" />
                <div className="text-3xl font-bold mb-2">3rd Place</div>
                <div className="text-xl font-serif mb-4">{topFive[2].name}</div>
                <div className="text-4xl font-bold text-amber-600">
                  {topFive[2].points}
                  <span className="text-lg ml-2 opacity-75">pts</span>
                </div>
              </div>
            )}
          </div>

          {/* 4th and 5th Place */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {topFive.slice(3).map((hall, index) => (
              <div
                key={hall.name}
                className="bg-white bg-opacity-5 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <Trophy className={`h-8 w-8 ${trophyColors[index + 3]}`} />
                  <div>
                    <div className="text-lg font-bold">{index + 4}th Place</div>
                    <div className="text-[#C4D7E0]">{hall.name}</div>
                  </div>
                </div>
                <div className="text-2xl font-bold">
                  {hall.points}
                  <span className="text-sm ml-1 opacity-75">pts</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 text-[#C4D7E0]">
            <p className="text-lg">Competition completed on May 1st, 2024</p>
            <p className="mt-2">Thank you to all participants for contributing to a more sustainable campus!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;