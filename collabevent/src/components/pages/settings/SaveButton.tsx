import React from 'react';
import { Save, CheckCircle } from 'lucide-react';

interface SaveButtonProps {
  onSave: () => void;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
}

const SaveButton: React.FC<SaveButtonProps> = ({ onSave, saveStatus }) => {
  return (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
      <button
        onClick={onSave}
        disabled={saveStatus === 'saving'}
        className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {saveStatus === 'saving' ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : saveStatus === 'saved' ? (
          <CheckCircle size={16} />
        ) : (
          <Save size={16} />
        )}
        <span>
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
        </span>
      </button>
    </div>
  );
};

export default SaveButton;