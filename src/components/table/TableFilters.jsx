import React from 'react';
import { MultiSelect } from '../MultiSelect';
import { KEY_SPORTSBOOKS } from '../../constants/sportsbooks';

// Simple checkbox component to avoid any potential issues
const SimpleCheckbox = ({ checked, onChange, label }) => (
  <div className="flex items-center space-x-2">
    <input
      type="checkbox"
      className="h-4 w-4 rounded border border-gray-300"
      checked={checked}
      onChange={onChange}
    />
    <label className="text-sm font-medium">{label}</label>
  </div>
);

export const TableFilters = (props) => {
  // Log all props for debugging
  console.log("TableFilters props:", props);

  // Destructure after logging
  const { 
    filterOptions, 
    selectedDates, 
    selectedMatchups, 
    selectedLeagues, 
    setSelectedDates,
    setSelectedMatchups,
    setSelectedLeagues,
    showOnlyKeyBooks,
    setShowOnlyKeyBooks
  } = props;

  // Create a simple direct handler
  const handleChange = (e) => {
    console.log("Checkbox changed to:", e.target.checked);
    // Use props directly to avoid any issues with destructuring
    if (typeof props.setShowOnlyKeyBooks === "function") {
      props.setShowOnlyKeyBooks(e.target.checked);
    } else {
      console.error("setShowOnlyKeyBooks is not a function in TableFilters:", props.setShowOnlyKeyBooks);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
        <MultiSelect
          options={filterOptions?.dates || []}
          selected={selectedDates || []}
          onChange={setSelectedDates}
          placeholder="Date Filter"
          className="w-full sm:w-[200px]"
          type="dates"
        />
        <MultiSelect
          options={filterOptions?.matchups || []}
          selected={selectedMatchups || []}
          onChange={setSelectedMatchups}
          placeholder="Matchup Filter"
          className="w-full sm:w-[200px]"
          type="matchups"
        />
        <MultiSelect
          options={filterOptions?.leagues || []}
          selected={selectedLeagues || []}
          onChange={setSelectedLeagues}
          placeholder="League Filter"
          className="w-full sm:w-[200px]"
          type="leagues"
        />
      </div>
      
      <div className="flex items-center">
        <SimpleCheckbox
          checked={!!showOnlyKeyBooks}
          onChange={handleChange}
          label={`Show only bets with prices from ${KEY_SPORTSBOOKS.join(' and ')}`}
        />
      </div>
    </div>
  );
};