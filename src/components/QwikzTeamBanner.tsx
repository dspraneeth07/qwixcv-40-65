
import React from "react";

const QwikzTeamBanner: React.FC = () => {
  return (
    <div className="mt-6 mb-8 p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
          <svg className="h-12 w-12" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
            <circle fill="#4F46E5" cx="18" cy="18" r="18"/>
            <path d="M25.5,15.5 C27.9852814,15.5 30,17.5147186 30,20 C30,22.4852814 27.9852814,24.5 25.5,24.5 L11.5,24.5 C9.01471863,24.5 7,22.4852814 7,20 C7,17.5147186 9.01471863,15.5 11.5,15.5 L25.5,15.5 Z M13.5,17.5 L11.5,17.5 C10.1192881,17.5 9,18.6192881 9,20 C9,21.3807119 10.1192881,22.5 11.5,22.5 L13.5,22.5 L13.5,17.5 Z" fill="white"/>
            <circle fill="white" cx="23" cy="20" r="2.5"/>
          </svg>
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold text-indigo-800 dark:text-indigo-300">Built by Team QwikZen</h3>
          <p className="text-sm text-indigo-700 dark:text-indigo-400">
            HackIndia 2025 Hackathon Submission — AI-Powered Career Development Suite
          </p>
        </div>
      </div>
    </div>
  );
};

export default QwikzTeamBanner;
