import { useState, useMemo, useEffect } from 'react';
import { useReactTable, getCoreRowModel, getSortedRowModel } from '@tanstack/react-table';

export const useTableData = (bets, columns) => {
  const [sorting, setSorting] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedMatchups, setSelectedMatchups] = useState([]);
  const [selectedLeagues, setSelectedLeagues] = useState([]);

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

  const filteredData = useMemo(() => {
    // If any filter category is empty, return no rows
    if (selectedDates.length === 0 || selectedMatchups.length === 0 || selectedLeagues.length === 0) {
      return [];
    }

    return bets.filter(bet => {
      const date = new Date(bet.Match_Date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      const matchup = `${bet.Home_Team} vs ${bet.Away_Team}`;
      
      // Only show rows that match ALL selected filters
      return selectedDates.includes(date) && 
             selectedMatchups.includes(matchup) && 
             selectedLeagues.includes(bet.League);
    });
  }, [bets, selectedDates, selectedMatchups, selectedLeagues]);

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