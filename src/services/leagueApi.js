// src/services/leagueApi.js
import { PROXY_URL } from './oddsApi';

// Cache the leagues to avoid making repeated API calls
let cachedLeagues = null;
let lastFetchTime = 0;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

/**
 * Fetches the list of active leagues from the API
 * @param {string} sport - Optional sport filter
 * @returns {Promise<Array>} - Array of league objects
 */
export const fetchActiveLeagues = async (sport = null) => {
  // Check if we have a valid cached result
  const now = Date.now();
  if (cachedLeagues && (now - lastFetchTime < CACHE_DURATION)) {
    console.log('Using cached leagues list');
    // If sport is specified, filter the cached leagues
    return sport 
      ? cachedLeagues.filter(league => league.sport.id === sport)
      : cachedLeagues;
  }

  // Construct query params
  const params = new URLSearchParams({
    key: 'd39909fa-3f0d-481f-8791-93d4434f8605'
  });
  
  if (sport) {
    params.append('sport', sport);
  }

  try {
    const response = await fetch(
      `${PROXY_URL}/api/leagues/active?${params}`,
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

    const data = await response.json();
    
    // Update cache
    cachedLeagues = data.data;
    lastFetchTime = now;
    
    return cachedLeagues;
  } catch (error) {
    console.error('Error fetching active leagues:', error);
    // If cache exists but is expired, still return it in case of error
    if (cachedLeagues) {
      console.warn('Using expired cache due to fetch error');
      return sport 
        ? cachedLeagues.filter(league => league.sport.id === sport)
        : cachedLeagues;
    }
    throw error;
  }
};