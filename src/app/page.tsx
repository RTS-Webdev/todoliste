'use client';

import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('data');
    if (saved) {
      setData(JSON.parse(saved));
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (data) {
      localStorage.setItem('data', JSON.stringify(data));
    }
  }, [data]);

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen flex justify-center items-center bg-gray-50 p-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Noter</h1>
        
        {data && Object.keys(data).length > 0 ? (
          <ul className="space-y-4">
            {Object.entries(data).map(([key, value]) => (
              <li key={key} className="bg-gray-50 rounded-lg p-6 flex justify-between items-center hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <span className="text-lg font-medium text-gray-800">{key}</span>
                  <p className="text-base text-gray-600 mt-2">{value}</p>
                </div>
                <button
                  onClick={() => {
                    setData((prev) => {
                      if (!prev) return prev;
                      const newData = { ...prev };
                      delete newData[key];
                      return newData;
                    });
                  }}
                  className="ml-6 p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  aria-label="Slet note"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 text-lg py-12">Ingen noter fundet</p>
        )}

        <div className="mt-8">
          <input
            type="text"
            placeholder="Skriv en ny note..."
            className="w-full px-6 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-black"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const value = e.currentTarget.value;
                if (value) {
                  setData((prev) => ({
                    ...prev,
                    [value]: new Date().toLocaleString('da-DK')
                  }));
                  e.currentTarget.value = '';
                }
              }
            }}
          />
        </div>
      </div>
    </main>
  );
}
