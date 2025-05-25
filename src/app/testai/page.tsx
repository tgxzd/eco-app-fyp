'use client';

import { useState, FormEvent } from 'react';
import { queryFlowiseAI } from '@/lib/flowiseAI';

type AgentType = 'AIR-POLLUTION' | 'WATER-POLLUTION' | 'WILDFIRE' | null;

const getAgentColor = (agentType: AgentType) => {
  switch (agentType) {
    case 'AIR-POLLUTION':
      return 'from-red-500 to-orange-500';
    case 'WATER-POLLUTION':
      return 'from-blue-500 to-cyan-500';
    case 'WILDFIRE':
      return 'from-orange-500 to-red-600';
    default:
      return 'from-gray-500 to-gray-600';
  }
};

export default function Home() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAgent, setCurrentAgent] = useState<AgentType>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Call Flowise AI API
      const response = await queryFlowiseAI({ question: userMessage });
      
      // Update current agent based on route
      setCurrentAgent(response.route as AgentType);

      if (response.error) {
        setError(response.error);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-center">Environmental Assistant</h1>
        
        {/* Agent Type Banner */}
        {currentAgent && (
          <div className="w-full overflow-hidden rounded-lg shadow-lg transition-all duration-500 ease-in-out">
            <div className={`bg-gradient-to-r ${getAgentColor(currentAgent)} p-6 text-white text-center transform transition-transform duration-500 ease-in-out hover:scale-105`}>
              <h2 className="text-4xl font-bold tracking-wider">
                {currentAgent.replace('-', ' ')}
              </h2>
              <p className="mt-2 text-sm opacity-90">
                {currentAgent === 'AIR-POLLUTION' && 'Monitoring and analyzing air quality issues'}
                {currentAgent === 'WATER-POLLUTION' && 'Addressing water contamination concerns'}
                {currentAgent === 'WILDFIRE' && 'Tracking and responding to wildfire situations'}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about air pollution, water pollution, or wildfire..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg bg-blue-500 text-white font-medium ${
              isLoading
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-600 active:bg-blue-700'
            }`}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </main>
  );
}
