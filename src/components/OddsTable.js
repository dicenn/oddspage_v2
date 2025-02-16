import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import _ from 'lodash';

// Define sportsbook batches (max 5 per request)
const SPORTSBOOK_BATCHES = [
  ['Pinnacle', 'FanDuel', 'DraftKings', 'Caesars', 'BetMGM'],
  ['Betfair Exchange', 'Betrivers', 'Betonline', 'Hard Rock', 'ESPN BET'],
  ['Fanatics', 'Bet365', 'Bovada', 'Betano', 'bet105']
];

// Flatten sportsbooks for column headers
const ALL_SPORTSBOOKS = SPORTSBOOK_BATCHES.flat();

const OddsTable = () => {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Load CSV
        const csvResponse = await fetch('/live_bets_sample_feb16_2025.csv');
        const csvText = await csvResponse.text();
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: async (results) => {
            const allRows = results.data;
            console.log('Total rows:', allRows.length);
            
            const allGameIds = _.uniq(allRows.map(row => row.game_id)).filter(Boolean);
            console.log('Unique game IDs:', allGameIds.length);

            try {
              // Split game IDs into batches of 5
              const gameBatches = _.chunk(allGameIds, 5);
              console.log('Number of game batches:', gameBatches.length);

              // Store all odds data
              let allOddsData = { data: [] };
              
              // For each game batch, fetch odds from each sportsbook batch
              for (let i = 0; i < gameBatches.length; i++) {
                const gameBatch = gameBatches[i];
                console.log(`Processing game batch ${i + 1}/${gameBatches.length}`);

                // Fetch odds for each sportsbook batch
                for (let j = 0; j < SPORTSBOOK_BATCHES.length; j++) {
                  const sportsbookBatch = SPORTSBOOK_BATCHES[j];
                  console.log(`Fetching sportsbooks batch ${j + 1}`);

                  const params = new URLSearchParams({
                    key: 'd39909fa-3f0d-481f-8791-93d4434f8605'
                  });

                  // Add game IDs and sportsbooks to params
                  gameBatch.forEach(id => params.append('fixture_id', id));
                  sportsbookBatch.forEach(book => params.append('sportsbook', book));

                  const oddsResponse = await fetch(
                    `https://api.opticodds.com/api/v3/fixtures/odds?${params}`,
                    {
                      method: 'GET',
                      headers: {
                        'Accept': 'application/json'
                      }
                    }
                  );

                  if (!oddsResponse.ok) {
                    console.warn(`API error for batch: ${oddsResponse.status}`);
                    continue; // Skip this batch but continue with others
                  }

                  const batchData = await oddsResponse.json();
                  allOddsData.data = [...allOddsData.data, ...batchData.data];
                }
              }

              console.log('All odds data collected');

              // Merge CSV data with API odds using exact matching
              const mergedData = allRows.map(csvRow => {
                const gameOdds = allOddsData.data.filter(game => game.id === csvRow.game_id);
                
                if (!gameOdds?.length) {
                  return {
                    ...csvRow,
                    currentPrices: {}
                  };
                }

                // Create an object to store prices from all sportsbooks
                const currentPrices = {};
                
                // Look for exact matches in each game's odds
                gameOdds.forEach(game => {
                  game.odds?.forEach(odd => {
                    if (odd.market === csvRow.Market && 
                        odd.name === csvRow.Selection) {
                      currentPrices[odd.sportsbook] = odd.price;
                    }
                  });
                });

                return {
                  ...csvRow,
                  currentPrices
                };
              });

              setBets(mergedData);
              setLoading(false);
            } catch (error) {
              console.error('Error fetching odds:', error);
              setError('Error fetching current odds');
              setLoading(false);
            }
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setError('Error parsing CSV file');
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error loading CSV:', error);
        setError('Error loading CSV file');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatPrice = (price) => {
    if (!price && price !== 0) return '-';
    return price > 0 ? `+${price}` : price.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading odds data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        <div className="text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Live Bets</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">League</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selection</th>
              <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
              {ALL_SPORTSBOOKS.map(book => (
                <th key={book} className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {book}
                </th>
              ))}
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Limit</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bets.map((bet, index) => (
              <tr 
                key={index}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="py-2 px-4 text-sm">
                  {bet.Home_Team} vs {bet.Away_Team}
                </td>
                <td className="py-2 px-4 text-sm text-gray-600">
                  {bet.League}
                </td>
                <td className="py-2 px-4 text-sm">
                  {bet.Market}
                </td>
                <td className="py-2 px-4 text-sm">
                  {bet.Selection}
                </td>
                <td className="py-2 px-4">
                  <span className="inline-flex justify-center w-full">
                    <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 text-xs rounded">
                      {bet.Grade}
                    </span>
                  </span>
                </td>
                {ALL_SPORTSBOOKS.map(book => (
                  <td key={book} className="py-2 px-4 text-center font-mono text-sm">
                    {formatPrice(bet.currentPrices[book])}
                  </td>
                ))}
                <td className="py-2 px-4 text-right font-mono text-sm">
                  {bet.Pinn_Limit || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OddsTable;