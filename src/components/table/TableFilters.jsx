// src/components/table/TableFilters.jsx
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
    <div className="flex items-center gap-4">
      <MultiSelect
        options={filterOptions.dates}
        selected={selectedDates}
        onChange={setSelectedDates}
        placeholder="Date Filter"
        className="w-[200px]"
      />
      <MultiSelect
        options={filterOptions.matchups}
        selected={selectedMatchups}
        onChange={setSelectedMatchups}
        placeholder="Matchup Filter"
        className="w-[200px]"
      />
      <MultiSelect
        options={filterOptions.leagues}
        selected={selectedLeagues}
        onChange={setSelectedLeagues}
        placeholder="League Filter"
        className="w-[200px]"
      />
    </div>
  );
};