import React, { useMemo } from 'react';
import { createColumns } from './table/columns';
import { useTableData } from './table/useTableData';
import FrozenTable from './FrozenTable';

const OddsTable = ({ 
  bets = [], 
  priceUpdates = {}, 
  streamStatus = 'disconnected' 
}) => {
  const columns = useMemo(() => createColumns(priceUpdates), [priceUpdates]);
  const {
    table,
    filterOptions,
    selectedDates,
    selectedMatchups,
    selectedLeagues,
    setSelectedDates,
    setSelectedMatchups,
    setSelectedLeagues,
  } = useTableData(bets, columns);

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
    />
  );
};

export default OddsTable;