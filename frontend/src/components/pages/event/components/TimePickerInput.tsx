import React, { useState } from 'react';
import { Clock as ClockIcon, ChevronUp, ChevronDown } from 'lucide-react';

interface TimePickerInputProps {
  value: string;
  onChange: (time: string) => void;
  label: string;
  error?: string;
  required?: boolean;
}

const TimePickerInput: React.FC<TimePickerInputProps> = ({ 
  value, 
  onChange, 
  label, 
  error, 
  required = false 
}) => {
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Parse time string into hours and minutes
  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hours: 12, minutes: 0, period: 'AM' };
    
    const [time] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    if (hours === 0) return { hours: 12, minutes, period: 'AM' };
    if (hours < 12) return { hours, minutes, period: 'AM' };
    if (hours === 12) return { hours: 12, minutes, period: 'PM' };
    return { hours: hours - 12, minutes, period: 'PM' };
  };

  // Format time back to HH:MM string
  const formatTime = (hours: number, minutes: number, period: string) => {
    let hour24 = hours;
    if (period === 'AM' && hours === 12) hour24 = 0;
    if (period === 'PM' && hours !== 12) hour24 = hours + 12;
    
    return `${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const { hours, minutes, period } = parseTime(value);

  const updateTime = (newHours: number, newMinutes: number, newPeriod: string) => {
    const timeString = formatTime(newHours, newMinutes, newPeriod);
    onChange(timeString);
  };

  const adjustHours = (increment: boolean) => {
    let newHours = increment ? hours + 1 : hours - 1;
    if (newHours > 12) newHours = 1;
    if (newHours < 1) newHours = 12;
    updateTime(newHours, minutes, period);
  };

  const adjustMinutes = (increment: boolean) => {
    let newMinutes = increment ? minutes + 15 : minutes - 15;
    if (newMinutes >= 60) newMinutes = 0;
    if (newMinutes < 0) newMinutes = 45;
    updateTime(hours, newMinutes, period);
  };

  const togglePeriod = () => {
    updateTime(hours, minutes, period === 'AM' ? 'PM' : 'AM');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <label className="block text-sm text-gray-600 mb-1">
        {label} {required && '*'}
      </label>
      
      <div className="relative">
        <input
          type="time"
          value={value}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        
        <button
          type="button"
          onClick={() => setShowTimePicker(!showTimePicker)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
        >
          <ClockIcon size={18} />
        </button>
      </div>

      {/* Custom Time Picker Dropdown */}
      {showTimePicker && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 min-w-[280px]">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-sm font-medium text-gray-700">Select Time</div>
            
            {/* Time Display */}
            <div className="text-2xl font-bold text-gray-800">
              {hours}:{minutes.toString().padStart(2, '0')} {period}
            </div>
            
            {/* Time Controls */}
            <div className="flex items-center space-x-6">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => adjustHours(true)}
                  className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  <ChevronUp size={20} />
                </button>
                <div className="w-12 h-8 flex items-center justify-center text-lg font-semibold">
                  {hours}
                </div>
                <button
                  type="button"
                  onClick={() => adjustHours(false)}
                  className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              <div className="text-2xl font-bold text-gray-400">:</div>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => adjustMinutes(true)}
                  className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  <ChevronUp size={20} />
                </button>
                <div className="w-12 h-8 flex items-center justify-center text-lg font-semibold">
                  {minutes.toString().padStart(2, '0')}
                </div>
                <button
                  type="button"
                  onClick={() => adjustMinutes(false)}
                  className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              {/* AM/PM */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={togglePeriod}
                  className="w-12 h-16 flex items-center justify-center text-lg font-semibold bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                >
                  {period}
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-2 w-full">
              <button
                type="button"
                onClick={() => setShowTimePicker(false)}
                className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowTimePicker(false)}
                className="flex-1 px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default TimePickerInput;