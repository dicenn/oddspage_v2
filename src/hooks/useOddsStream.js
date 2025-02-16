import { useState, useEffect } from 'react';
import { createOddsStream } from '../services/oddsApi';

export const useOddsStream = (bets) => {
  const [priceUpdates, setPriceUpdates] = useState({});  // gameId -> { sportsbook -> price }
  
  useEffect(() => {
    if (!bets.length) return;

    // Get unique leagues from bets
    const leagues = [...new Set(bets.map(bet => bet.League))];
    const stream = createOddsStream(leagues);

    stream.onmessage = (event) => {
      console.log('Stream update received:', event);
    };

    stream.addEventListener('odds', (event) => {
      const data = JSON.parse(event.data);
      console.log('Odds update:', data);

      // Process updates and find matching bets
      data.data.forEach(update => {
        setPriceUpdates(prev => ({
          ...prev,
          [update.game_id]: {
            ...(prev[update.game_id] || {}),
            [update.sportsbook]: update.price
          }
        }));
      });
    });

    stream.onerror = (error) => {
      console.error('Stream error:', error);
      stream.close();
    };

    return () => stream.close();
  }, [bets]);

  return priceUpdates;
};