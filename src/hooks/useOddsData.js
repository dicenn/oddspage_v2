import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import _ from 'lodash';
import { SPORTSBOOK_BATCHES } from '../constants/sportsbooks';
import { fetchOddsForBatch } from '../services/oddsApi';
import { useOddsStream } from './useOddsStream';

export const useOddsData = () => {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add streaming data
  const { priceUpdates, streamStatus } = useOddsStream(bets);

  useEffect(() => {
    const loadData = async () => {
      try {
        const csvResponse = await fetch('/live_bets_sample_feb16_2025.csv');
        const csvText = await csvResponse.text();
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: async (results) => {
            const allRows = results.data;
            const allGameIds = _.uniq(allRows.map(row => row.game_id)).filter(Boolean);
            const gameBatches = _.chunk(allGameIds, 5);

            try {
              let allOddsData = { data: [] };
              
              for (const gameBatch of gameBatches) {
                for (const sportsbookBatch of SPORTSBOOK_BATCHES) {
                  try {
                    const batchData = await fetchOddsForBatch(gameBatch, sportsbookBatch);
                    allOddsData.data = [...allOddsData.data, ...batchData.data];
                  } catch (error) {
                    console.warn(`Batch error:`, error);
                    continue;
                  }
                }
              }

              const mergedData = allRows.map(csvRow => {
                const gameOdds = allOddsData.data.filter(game => game.id === csvRow.game_id);
                const currentPrices = {};
                
                gameOdds.forEach(game => {
                  game.odds?.forEach(odd => {
                    if (odd.market === csvRow.Market && odd.name === csvRow.Selection) {
                      currentPrices[odd.sportsbook] = odd.price;
                    }
                  });
                });

                return { ...csvRow, currentPrices };
              });

              setBets(mergedData);
              setLoading(false);
            } catch (error) {
              setError('Error fetching odds data');
              setLoading(false);
            }
          },
          error: () => {
            setError('Error parsing CSV file');
            setLoading(false);
          }
        });
      } catch (error) {
        setError('Error loading CSV file');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { bets, loading, error, priceUpdates, streamStatus };
};