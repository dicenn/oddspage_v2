import { useState, useEffect } from 'react';
import { createOddsStream } from '../services/oddsApi';
import { fetchActiveLeagues } from '../services/leagueApi';

export const useOddsStream = (bets) => {
  const [streamStatus, setStreamStatus] = useState('disconnected');
  const [priceUpdates, setPriceUpdates] = useState({});
  const [validLeagues, setValidLeagues] = useState([]);
  const [invalidLeagues, setInvalidLeagues] = useState([]);
  // Track active streams to close them properly
  const [activeStreams, setActiveStreams] = useState([]);

  // First, fetch the list of valid leagues
  useEffect(() => {
    const getActiveLeagues = async () => {
      try {
        const leagues = await fetchActiveLeagues();
        setValidLeagues(leagues);
      } catch (error) {
        console.error('Error fetching active leagues:', error);
      }
    };

    getActiveLeagues();
  }, []);

  // Then, set up streams for each sport with validated leagues
  useEffect(() => {
    if (!bets.length || !validLeagues.length) return;

    // Group bets by sport
    const betsBySport = {};
    bets.forEach(bet => {
      const sport = bet.Sport || 'soccer'; // Default to soccer if sport is missing
      if (!betsBySport[sport]) {
        betsBySport[sport] = [];
      }
      betsBySport[sport].push(bet);
    });

    // Get unique leagues for each sport
    const sportLeagueMap = {};
    Object.keys(betsBySport).forEach(sport => {
      sportLeagueMap[sport] = [...new Set(betsBySport[sport].map(bet => bet.League))];
    });
    
    console.log('Sports and their leagues:', sportLeagueMap);
    
    // Validate leagues against the active leagues list
    const validLeaguesBySport = {};
    const allInvalidLeagues = [];
    
    Object.entries(sportLeagueMap).forEach(([sport, leagues]) => {
      const validForSport = leagues.filter(league => 
        validLeagues.some(validLeague => 
          validLeague.name.toLowerCase() === league.toLowerCase() ||
          validLeague.id.toLowerCase() === league.toLowerCase().replace(/\s+/g, '_')
        )
      );
      
      const invalidForSport = leagues.filter(league => 
        !validLeagues.some(validLeague => 
          validLeague.name.toLowerCase() === league.toLowerCase() ||
          validLeague.id.toLowerCase() === league.toLowerCase().replace(/\s+/g, '_')
        )
      );
      
      if (validForSport.length > 0) {
        validLeaguesBySport[sport] = validForSport;
      }
      
      allInvalidLeagues.push(...invalidForSport);
    });
    
    setInvalidLeagues(allInvalidLeagues);
    
    if (allInvalidLeagues.length > 0) {
      console.warn('Some leagues are invalid or inactive:', allInvalidLeagues);
    }
    
    if (Object.keys(validLeaguesBySport).length === 0) {
      console.error('No valid leagues to stream. Stream will not be created.');
      setStreamStatus('error');
      return;
    }

    // Close any existing streams
    activeStreams.forEach(stream => stream.close());
    
    // Create new streams for each sport
    const newStreams = [];
    let connectedStreams = 0;
    
    Object.entries(validLeaguesBySport).forEach(([sport, leagues]) => {
      console.log(`Setting up stream for ${sport} leagues:`, leagues);
      
      const stream = createOddsStream(sport, leagues);
      newStreams.push(stream);
      
      stream.onopen = () => {
        console.log(`Stream for ${sport} connected`);
        connectedStreams++;
        if (connectedStreams === newStreams.length) {
          setStreamStatus('connected');
        }
      };
      
      stream.addEventListener('odds', (event) => {
        const data = JSON.parse(event.data);
        console.log(`Received ${sport} odds update:`, data);
        
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
                ...(prev[matchingBet.game_id] || {}),
                [`${update.market}-${update.name}-${update.sportsbook}`]: update.price
              }
            }));
          }
        });
      });
      
      stream.onerror = (error) => {
        console.error(`Stream error for ${sport}:`, error);
        // Only set overall status to error if all streams have error
        const allFailed = newStreams.every(s => s.readyState === 2); // 2 is CLOSED
        if (allFailed) {
          setStreamStatus('error');
        }
      };
    });
    
    setActiveStreams(newStreams);
    
    return () => {
      // Clean up all streams on unmount
      newStreams.forEach(stream => stream.close());
      setStreamStatus('disconnected');
    };
  }, [bets, validLeagues]);

  return { priceUpdates, streamStatus, invalidLeagues };
};