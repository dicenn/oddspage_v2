import React, { useMemo } from 'react';
import { createColumns } from './table/columns';
import { useTableData } from './table/useTableData';
import FrozenTable from './FrozenTable';

const OddsTable = ({ 
  bets = [], 
  priceUpdates = {}, 
  streamStatus = 'disconnected',
  loading = false,
  showOnlyKeyBooks,
  setShowOnlyKeyBooks
}) => {
  console.log("OddsTable - showOnlyKeyBooks:", showOnlyKeyBooks);
  console.log("OddsTable - setShowOnlyKeyBooks:", typeof setShowOnlyKeyBooks);
  
  const columns = useMemo(() => createColumns(priceUpdates), [priceUpdates]);
  
  // IMPORTANT: Pass showOnlyKeyBooks and setShowOnlyKeyBooks to useTableData
  const {
    table,
    filterOptions,
    selectedDates,
    selectedMatchups,
    selectedLeagues,
    setSelectedDates,
    setSelectedMatchups,
    setSelectedLeagues,
  } = useTableData(bets, columns, showOnlyKeyBooks, setShowOnlyKeyBooks);

  return (
    <FrozenTable
      table={table}
      filterOptions={filterOptions}
      selectedDates={selectedDates}
      selectedMatchups={selectedMatchups}
      selectedLeagues={selectedLeagues}
      setSelectedDates={setSelectedDates}
      setSelectedMatchups={setSelectedMatchups}
      setSelectedLeagues={setSelectedLeagues}
      streamStatus={streamStatus}
      loading={loading}
      showOnlyKeyBooks={showOnlyKeyBooks}
      setShowOnlyKeyBooks={setShowOnlyKeyBooks}
    />
  );
};

export default OddsTable;