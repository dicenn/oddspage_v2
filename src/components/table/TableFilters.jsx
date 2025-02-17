import React from 'react';
import { MultiSelect } from '../MultiSelect';

export const TableFilters = ({ 
  filterOptions, 
  selectedDates, 
  selectedMatchups, 
  selectedLeagues, 
  setSelectedDates,
  setSelectedMatchups,
  setSelectedLeagues 
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
      <MultiSelect
        options={filterOptions.dates}
        selected={selectedDates}
        onChange={setSelectedDates}
        placeholder="Date Filter"
        className="w-full sm:w-[200px]"
        type="dates"
      />
      <MultiSelect
        options={filterOptions.matchups}
        selected={selectedMatchups}
        onChange={setSelectedMatchups}
        placeholder="Matchup Filter"
        className="w-full sm:w-[200px]"
        type="matchups"
      />
      <MultiSelect
        options={filterOptions.leagues}
        selected={selectedLeagues}
        onChange={setSelectedLeagues}
        placeholder="League Filter"
        className="w-full sm:w-[200px]"
        type="leagues"
      />
    </div>
  );
};