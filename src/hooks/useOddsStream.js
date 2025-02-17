// hooks/useOddsStream.js
import { useState, useEffect } from 'react';
import { createOddsStream } from '../services/oddsApi';

export const useOddsStream = (bets) => {
  const [streamStatus, setStreamStatus] = useState('disconnected');
  const [priceUpdates, setPriceUpdates] = useState({}); // gameId -> { market+selection -> price }

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

    stream.addEventListener('odds', (event) => {
      const data = JSON.parse(event.data);
      console.log('Received odds update:', data);

      // Create a key that matches our bet structure
      data.data.forEach(update => {
        // Look for matching bet
        const matchingBet = bets.find(bet => 
          bet.game_id === update.fixture_id &&
          bet.Market === update.market &&
          bet.Selection === update.name
        );

        if (matchingBet) {
          setPriceUpdates(prev => ({
            ...prev,
            [matchingBet.game_id]: {
              ...prev[matchingBet.game_id],
              [`${update.market}-${update.name}`]: update.price
            }
          }));
        }
      });
    });

    stream.onerror = (error) => {
      console.error('Stream error:', error);
      setStreamStatus('error');
    };

    return () => {
      stream.close();
      setStreamStatus('disconnected');
    };
  }, [bets]);

  return { priceUpdates, streamStatus };
};