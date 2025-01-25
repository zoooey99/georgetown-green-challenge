import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { ConsumptionData } from '../types';

interface AdminDataInputProps {
  onDataSubmit: (data: ConsumptionData) => void;
}

const AdminDataInput: React.FC<AdminDataInputProps> = ({ onDataSubmit }) => {
  const [csvData, setCsvData] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const halls = [
    'Darnall Hall', 'Harbin Hall', 'New South Hall', 'Village C West',
    'Village C East', 'Copley Hall', 'Kennedy Hall', 'McCarthy Hall',
    'Reynolds Hall', 'Ryan Hall', 'Pedro Arrupe Hall', 'Henle Village',
    'LXR', 'Nevils', 'Alumni Square', 'Village A', 'Village B',
    'Magis Row', 'Ida Ryan Hall', 'Isaac Hawkins Hall'
  ];

  const validateAndParseData = (input: string): number[] | null => {
    const values = input.trim().split(',').map(Number);
    
    // Check if we have the correct number of values (3 metrics per hall)
    if (values.length !== halls.length * 3) {
      setError(`Expected ${halls.length * 3} values (3 per hall), but got ${values.length}`);
      return null;
    }

    // Check if all values are valid numbers
    if (values.some(isNaN)) {
      setError('All values must be valid numbers');
      return null;
    }

    // Check if all values are positive
    if (values.some(v => v < 0)) {
      setError('All values must be positive numbers');
      return null;
    }

    return values;
  };

  const handleSubmit = () => {
    setError(null);
    setSuccess(false);

    const values = validateAndParseData(csvData);
    if (!values) return;

    const now = new Date();
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() + 6);

    const newWeekData: ConsumptionData = {
      startDateTime: now.toISOString(),
      endDateTime: weekEnd.toISOString(),
    };

    // Populate the data for each hall
    halls.forEach((hall, index) => {
      const baseIndex = index * 3;
      newWeekData[`${hall} - Electricity : kW`] = values[baseIndex];
      newWeekData[`${hall} - Gas : therm`] = values[baseIndex + 1];
      newWeekData[`${hall} - Water : US gal/min`] = values[baseIndex + 2];
    });

    onDataSubmit(newWeekData);
    setSuccess(true);
    setCsvData('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-serif text-[#041E42]">Add New Week Data</h2>
        <button
          onClick={() => {
            const template = Array(halls.length * 3).fill('0').join(',');
            navigator.clipboard.writeText(template);
          }}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Copy CSV Template
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Paste CSV Data
        </label>
        <textarea
          value={csvData}
          onChange={(e) => {
            setCsvData(e.target.value);
            setError(null);
            setSuccess(false);
          }}
          placeholder="Paste comma-separated values here..."
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 text-green-700">
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm">Data successfully added!</span>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-[#041E42] text-white py-2 px-4 rounded-md hover:bg-[#0a2a5e] flex items-center justify-center gap-2"
      >
        <Upload className="h-5 w-5" />
        Submit Week Data
      </button>

      <div className="mt-4 text-sm text-gray-600">
        <p className="font-medium mb-2">Format Instructions:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Provide values in order: electricity (kW), gas (therm), water (US gal/min) for each hall</li>
          <li>Values should be comma-separated without spaces</li>
          <li>Total of {halls.length * 3} values required ({halls.length} halls × 3 metrics)</li>
          <li>All values must be positive numbers</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDataInput;