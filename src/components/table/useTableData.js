import { useState, useMemo, useEffect } from 'react';
import { useReactTable, getCoreRowModel, getSortedRowModel } from '@tanstack/react-table';
import { KEY_SPORTSBOOKS } from '../../constants/sportsbooks';

export const useTableData = (bets, columns, showOnlyKeyBooks, setShowOnlyKeyBooks) => {
  const [sorting, setSorting] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedMatchups, setSelectedMatchups] = useState([]);
  const [selectedLeagues, setSelectedLeagues] = useState([]);

  // Add console.log to verify showOnlyKeyBooks state is correctly passed
  console.log("useTableData - showOnlyKeyBooks:", showOnlyKeyBooks);

  const filterOptions = useMemo(() => {
    const dates = new Set();
    const matchups = new Set();
    const leagues = new Set();

    bets.forEach(bet => {
      const date = new Date(bet.Match_Date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      dates.add(date);

      const matchup = `${bet.Home_Team} vs ${bet.Away_Team}`;
      matchups.add(matchup);
      leagues.add(bet.League);
    });

    return {
      dates: Array.from(dates).sort(),
      matchups: Array.from(matchups).sort(),
      leagues: Array.from(leagues).sort()
    };
  }, [bets]);

  // Initialize filters with all options only on first load
  useEffect(() => {
    // Only set initial values if we haven't set them before and we have options
    if (selectedDates.length === 0 && filterOptions.dates.length > 0) {
      setSelectedDates(filterOptions.dates);
    }
    if (selectedMatchups.length === 0 && filterOptions.matchups.length > 0) {
      setSelectedMatchups(filterOptions.matchups);
    }
    if (selectedLeagues.length === 0 && filterOptions.leagues.length > 0) {
      setSelectedLeagues(filterOptions.leagues);
    }
  }, [filterOptions]); // Only run on filterOptions change

  // Track state changes for debugging
  useEffect(() => {
    console.log("Filter state changed:", { 
      showOnlyKeyBooks, 
      datesCount: selectedDates.length,
      matchupsCount: selectedMatchups.length,
      leaguesCount: selectedLeagues.length
    });
  }, [showOnlyKeyBooks, selectedDates, selectedMatchups, selectedLeagues]);

  const filteredData = useMemo(() => {
    console.log("Calculating filteredData with showOnlyKeyBooks:", showOnlyKeyBooks);
    console.log("KEY_SPORTSBOOKS:", KEY_SPORTSBOOKS);
    
    // If any filter category is empty, return no rows
    if (selectedDates.length === 0 || selectedMatchups.length === 0 || selectedLeagues.length === 0) {
      return [];
    }

    if (!Array.isArray(bets)) {
      console.warn("bets is not an array:", bets);
      return [];
    }

    const filteredResult = bets.filter(bet => {
      try {
        // Skip null or undefined bets
        if (!bet) return false;
        
        const date = new Date(bet.Match_Date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        const matchup = `${bet.Home_Team || ''} vs ${bet.Away_Team || ''}`;
        
        // Check basic filters first
        const meetsBasicFilters = selectedDates.includes(date) && 
               selectedMatchups.includes(matchup) && 
               selectedLeagues.includes(bet.League);
        
        if (!meetsBasicFilters) return false;
        
        // If key books filter is enabled, check if bet has prices for key sportsbooks
        if (showOnlyKeyBooks === true) {
          // Log sample data to debug
          if (Math.random() < 0.01) { // Only log a small percentage to avoid flooding console
            console.log("Sample bet for key books filtering:", {
              id: bet.game_id,
              currentPrices: bet.currentPrices,
              hasKeyPrices: KEY_SPORTSBOOKS.some(book => 
                bet.currentPrices && 
                bet.currentPrices[book] !== undefined && 
                bet.currentPrices[book] !== null
              )
            });
          }
          
          // Check if bet has ANY prices from key sportsbooks
          return KEY_SPORTSBOOKS.some(book => 
            bet.currentPrices && 
            bet.currentPrices[book] !== undefined && 
            bet.currentPrices[book] !== null
          );
        }
        
        return true;
      } catch (error) {
        console.error("Error filtering bet:", error, bet);
        return false;
      }
    });
    
    console.log(`Filtered data: ${filteredResult.length} rows (from ${bets.length} total) with keyBooksFilter=${showOnlyKeyBooks}`);
    return filteredResult;
  }, [bets, selectedDates, selectedMatchups, selectedLeagues, showOnlyKeyBooks]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  return {
    table,
    filterOptions,
    selectedDates,
    selectedMatchups,
    selectedLeagues,
    setSelectedDates,
    setSelectedMatchups,
    setSelectedLeagues,
  };
};