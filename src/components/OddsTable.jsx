import React, { useState, useEffect } from 'react';
import { useOddsData } from '../hooks/useOddsData';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorDisplay } from './ErrorDisplay';
import { OddsTableHeader } from './OddsTableHeader';
import { OddsTableRow } from './OddsTableRow';
import { SPORTSBOOK_BATCHES } from '../constants/sportsbooks';

// In OddsTable.jsx - replace the createOddsStream function
const createOddsStream = (leagues) => {
    const params = new URLSearchParams({
        key: 'd39909fa-3f0d-481f-8791-93d4434f8605'
    });

    // Add all sportsbooks
    SPORTSBOOK_BATCHES.forEach(batch => {
        batch.forEach(book => params.append('sportsbook', book));
    });

    leagues.forEach(league => params.append('league', league));

    return new EventSource(
        `https://api.opticodds.com/api/v3/stream/soccer/odds?${params}`
    );
};
  
const OddsTable = () => {
  const { bets, loading, error } = useOddsData();
  const [priceUpdates, setPriceUpdates] = useState({});
  const [streamStatus, setStreamStatus] = useState('disconnected');

  // Set up streaming
  useEffect(() => {
    if (!bets.length) return;

    // Get unique leagues
    const leagues = [...new Set(bets.map(bet => bet.League))];
    console.log('Setting up stream for leagues:', leagues);

    const stream = createOddsStream(leagues);

    stream.onopen = () => {
      console.log('Stream connected');
      setStreamStatus('connected');
    };

    stream.addEventListener('connected', (event) => {
      console.log('Stream ready:', event);
    });

    stream.addEventListener('ping', (event) => {
      console.log('Stream ping:', event);
    });

    stream.addEventListener('odds', (event) => {
      const data = JSON.parse(event.data);
      console.log('Received odds update:', data);

      data.data.forEach(update => {
        // Find matching bet in our table
        const matchingBet = bets.find(bet => 
          bet.game_id === update.fixture_id &&
          bet.Market === update.market &&
          bet.Selection === update.name
        );

        if (matchingBet) {
          console.log('Found matching bet:', matchingBet);
          setPriceUpdates(prev => ({
            ...prev,
            [matchingBet.game_id]: {
              ...(prev[matchingBet.game_id] || {}),
              [`${update.market}-${update.name}-${update.sportsbook}`]: update.price
            }
          }));
        }
      });
    });

    stream.addEventListener('locked-odds', (event) => {
      const data = JSON.parse(event.data);
      console.log('Received locked odds:', data);
      // Handle locked odds similarly
    });

    stream.onerror = (error) => {
      console.error('Stream error:', error);
      setStreamStatus('error');
    };

    return () => {
      console.log('Closing stream');
      stream.close();
      setStreamStatus('disconnected');
    };
  }, [bets]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Live Bets</h1>
        <div className={`px-3 py-1 rounded-full text-sm ${
          streamStatus === 'connected' 
            ? 'bg-green-100 text-green-800' 
            : streamStatus === 'error'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
        }`}>
          Stream: {streamStatus}
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <OddsTableHeader />
          <tbody className="bg-white divide-y divide-gray-200">
            {bets.map((bet, index) => (
              <OddsTableRow 
                key={index} 
                bet={bet} 
                priceUpdates={priceUpdates}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OddsTable;