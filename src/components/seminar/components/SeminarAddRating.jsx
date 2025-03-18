import { useState, useEffect, useRef } from 'react';
import { Star, Mic2, ClipboardCheck, Lightbulb } from 'lucide-react';
import Popover from '../../Popover';
import { seminarsAPI } from '../../../api/apiService';
export default function SeminarAddRating({ seminar, onRatingAdded }) {
  const [rating, setRating] = useState({
    skill: null,
    quality: null,
    usefulness: null
  });

  // Skill, quality, usefulness
  const rateMethods = [
    {
      name: 'Skill',
      description: 'How well did the speaker explain the topic?',
      icon: <Mic2 className="h-5 w-5 text-blue-500" />,
      options: [
        {
          label: 'Poor',
          value: 1
        },
        {
          label: 'Average', 
          value: 2
        },
        {
          label: 'Good',
          value: 3
        },
        {
          label: 'Excellent',
          value: 4
        },
        {
          label: 'Outstanding',
          value: 5
        }
      ]
    },
    {
      name: 'Quality',
      description: 'How well was the seminar organized?',
      icon: <ClipboardCheck className="h-5 w-5 text-blue-500" />,
      options: [
        {
          label: 'Poor',
          value: 1
        },
        {
          label: 'Average',
          value: 2
        },
        {
          label: 'Good',
          value: 3
        },
        {
          label: 'Excellent',
          value: 4
        },
        {
          label: 'Outstanding',
          value: 5
        }
      ]
    },
    {
      name: 'Usefulness',
      description: 'How useful was the seminar?',
      icon: <Lightbulb className="h-5 w-5 text-blue-500" />,
      options: [
        {
          label: 'Not at all',
          value: 1
        },
        {
          label: 'Somewhat',
          value: 2
        },
        {
          label: 'Very',
          value: 3
        },
        {
          label: 'Extremely',
          value: 4
        },
        {
          label: 'Absolutely',
          value: 5
        }
      ]
    }
  ]

  const handleSubmit = async () => {
    try {
      const response = await seminarsAPI.addRating(seminar.id, { ratingData: rating });
      console.log(response);
      onRatingAdded(response);
    } catch (error) {
      console.error('Error adding rating:', error);
    }
  }

  const ratingContent = (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">Rate Your Experience</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Help others by sharing your feedback</p>
      {rateMethods.map((method) => (
        <div key={method.name} className="mb-6 last:mb-8 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg backdrop-blur-sm">
          <h4 className="text-sm font-semibold flex items-center gap-3 mb-3">
            <span className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">{method.icon}</span>
            <span className="text-gray-800 dark:text-gray-200">{method.name}</span>
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{method.description}</p>
            <div className="flex items-center gap-4">
              <select
                value={rating[method.name.toLowerCase()]}
                onChange={(e) => setRating({ ...rating, [method.name.toLowerCase()]: e.target.value })}
                className="w-24 px-3 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all duration-200 appearance-none cursor-pointer hover:border-blue-500 dark:hover:border-blue-400"
              >
                <option value="">Rate</option>
                {method.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.value}</option>
                ))}
              </select>
              <span className="text-xs font-medium px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full">
                {method.options.find(opt => opt.value === Number(rating[method.name.toLowerCase()]))?.label || 'Select rating'}
              </span>
            </div>
          </div>
          
        </div>
      ))}
      <button 
        onClick={handleSubmit}
        className="w-full py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-lg shadow-lg hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] animate-gradient bg-[length:200%_200%]"
      >
        Submit Your Rating
      </button>
    </div>
  )

  return <div>
    <Popover width={450} placement="right" content={ ratingContent }>
      <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border border-transparent rounded-md shadow-sm hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all animate-gradient bg-[length:200%_200%] bg-left hover:bg-right duration-500">
        <Star className="h-5 w-5 mr-2" />
        Add Rating
      </button>
    </Popover>
  </div>
}