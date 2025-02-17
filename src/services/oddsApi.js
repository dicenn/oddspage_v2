// services/oddsApi.js
import { SPORTSBOOK_BATCHES } from '../constants/sportsbooks';

export const fetchOddsForBatch = async (gameIds, sportsbooks) => {
    const params = new URLSearchParams({
      key: 'd39909fa-3f0d-481f-8791-93d4434f8605'
    });
  
    gameIds.forEach(id => params.append('fixture_id', id));
    sportsbooks.forEach(book => params.append('sportsbook', book));
  
    const response = await fetch(
      `https://api.opticodds.com/api/v3/fixtures/odds?${params}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      }
    );
  
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
  
    return response.json();
};

export const createOddsStream = (leagues) => {
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