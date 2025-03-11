'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<Record<string, { timestamp: string; completed: boolean; priority: number }> | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [deletedTasks, setDeletedTasks] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('data');
    if (saved) {
      setData(JSON.parse(saved));
    }
    const savedSuggestions = localStorage.getItem('suggestions');
    if (savedSuggestions) {
      setSuggestions(JSON.parse(savedSuggestions));
    }
    const savedDeletedTasks = localStorage.getItem('deletedTasks');
    if (savedDeletedTasks) {
      setDeletedTasks(JSON.parse(savedDeletedTasks));
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (data) {
      localStorage.setItem('data', JSON.stringify(data));
      const newSuggestions = Object.entries(data)
        .filter(([_, value]) => value.completed)
        .map(([key]) => key);
      setSuggestions((prev) => Array.from(new Set([...prev, ...newSuggestions])));
      localStorage.setItem('suggestions', JSON.stringify(newSuggestions));
    }
  }, [data]);

  if (!mounted) {
    return null;
  }

  const handleDeleteAll = () => {
    if (data) {
      const tasksToDelete = Object.keys(data);
      setDeletedTasks(prev => {
        const newDeletedTasks = Array.from(new Set([...prev, ...tasksToDelete]));
        localStorage.setItem('deletedTasks', JSON.stringify(newDeletedTasks));
        return newDeletedTasks;
      });
    }
    setData(null);
    localStorage.removeItem('data');
  };

  const handleDeleteCompleted = () => {
    if (data) {
      const newData = { ...data };
      const completedTasks = Object.entries(data)
        .filter(([_, value]) => value.completed)
        .map(([key]) => key);

      completedTasks.forEach(key => {
        delete newData[key];
      });

      setDeletedTasks(prev => {
        const newDeletedTasks = Array.from(new Set([...prev, ...completedTasks]));
        localStorage.setItem('deletedTasks', JSON.stringify(newDeletedTasks));
        return newDeletedTasks;
      });

      setData(Object.keys(newData).length > 0 ? newData : null);
    }
  };

  const sortedEntries = data ? Object.entries(data).sort((a, b) => (b[1].priority || 0) - (a[1].priority || 0)) : [];

  const allSuggestions = Array.from(new Set([...suggestions, ...deletedTasks]));
  const filteredSuggestions = allSuggestions.filter(
    suggestion => suggestion.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex justify-center items-center bg-gray-50 p-8"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-8"
      >
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-bold text-gray-800 text-center"
          >
            Todoliste
          </motion.h1>
          {data && Object.keys(data).length > 0 && (
            <div className="flex gap-4">
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDeleteCompleted}
                className="px-4 py-2 bg-orange-50 text-orange-500 rounded-lg hover:bg-orange-100 transition-colors"
              >
                Slet færdige
              </motion.button>
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDeleteAll}
                className="px-4 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
              >
                Slet alle
              </motion.button>
            </div>
          )}
        </div>
        
        <AnimatePresence>
          {data && Object.keys(data).length > 0 ? (
            <motion.ul 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {sortedEntries.sort((a, b) => {
                const priorityDiff = (b[1].priority || 0) - (a[1].priority || 0);
                return priorityDiff === 0 ? a[0].localeCompare(b[0]) : priorityDiff;
              }).map(([key, { timestamp, completed, priority }]) => (
                <motion.li
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-gray-50 rounded-lg p-6 flex justify-between items-center hover:bg-gray-100 transition-colors ${completed ? 'opacity-50' : ''}`}
                >
                  <div className="flex-1 flex items-center gap-4">
                    <motion.input
                      whileTap={{ scale: 0.9 }}
                      type="checkbox"
                      checked={completed}
                      onChange={() => {
                        setData((prev) => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            [key]: {
                              ...prev[key],
                              completed: !prev[key].completed
                            }
                          };
                        });
                      }}
                      className="w-6 h-6 rounded-md border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <motion.span 
                          animate={{ opacity: completed ? 0.5 : 1 }}
                          className={`text-lg font-medium text-gray-800 ${completed ? 'line-through' : ''}`}
                        >
                          {key}
                        </motion.span>
                        <motion.select
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          value={priority || 0}
                          onChange={(e) => {
                            setData((prev) => {
                              if (!prev) return prev;
                              return {
                                ...prev,
                                [key]: {
                                  ...prev[key],
                                  priority: Number(e.target.value)
                                }
                              };
                            });
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            priority === 2 ? 'bg-red-100 text-red-800 border-red-200' :
                            priority === 1 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-green-100 text-green-800 border-green-200'
                          } border-2 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            priority === 2 ? 'focus:ring-red-500' :
                            priority === 1 ? 'focus:ring-yellow-500' :
                            'focus:ring-green-500'
                          }`}
                        >
                          <option value="0" className="bg-green-50 text-green-800">Lav</option>
                          <option value="1" className="bg-yellow-50 text-yellow-800">Medium</option>
                          <option value="2" className="bg-red-50 text-red-800">Høj</option>
                        </motion.select>
                      </div>
                      <p className="text-base text-gray-600 mt-2">{timestamp}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: completed ? "rgb(220 252 231)" : "rgb(254 242 242)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setData((prev) => {
                        if (!prev) return prev;
                        const newData = { ...prev };
                        setDeletedTasks(prevDeleted => {
                          const newDeletedTasks = Array.from(new Set([...prevDeleted, key]));
                          localStorage.setItem('deletedTasks', JSON.stringify(newDeletedTasks));
                          return newDeletedTasks;
                        });
                        delete newData[key];
                        return newData;
                      });
                    }}
                    className={`ml-6 p-3 ${completed ? 'text-green-500 hover:text-green-600 hover:bg-green-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'} rounded-full transition-colors`}
                    aria-label="Slet note"
                  >
                    {completed ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </motion.button>
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center text-gray-500 text-lg py-12"
            >
              Ingen punkter fundet
            </motion.p>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 relative"
        >
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            placeholder="Skriv et nyt punkt..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                setShowSuggestions(false);
              }, 200);
            }}
            className="w-full px-6 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-black"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputValue) {
                setData((prev) => ({
                  ...prev,
                  [inputValue]: {
                    timestamp: new Date().toLocaleString('da-DK', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }),
                    completed: false,
                    priority: 0
                  }
                }));
                setInputValue('');
                setShowSuggestions(false);
              }
            }}
          />
          <AnimatePresence>
            {showSuggestions && filteredSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute w-full bg-blue-50 mt-2 rounded-lg shadow-lg border border-blue-200 max-h-48 overflow-y-auto z-10"
              >
                {filteredSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ backgroundColor: "#dbeafe" }}
                    className="px-4 py-2 cursor-pointer text-blue-800 hover:text-blue-900"
                    onClick={() => {
                      setInputValue(suggestion);
                      setShowSuggestions(false);
                    }}
                  >
                    {suggestion}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.main>
  );
}