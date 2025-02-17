// src/components/table/TableHeader.jsx
import React from 'react';
import { Activity } from 'lucide-react';
import { CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { TableFilters } from './TableFilters';

export const TableHeader = ({ 
  streamStatus,
  filterOptions,
  selectedDates,
  selectedMatchups,
  selectedLeagues,
  setSelectedDates,
  setSelectedMatchups,
  setSelectedLeagues
}) => {
  return (
    <CardHeader className="pb-4">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <CardTitle className="text-2xl">Live Bets</CardTitle>
            <Badge 
              variant={
                streamStatus === 'connected' 
                  ? 'success' 
                  : streamStatus === 'error'
                    ? 'destructive'
                    : 'secondary'
              }
              className="flex items-center gap-1"
            >
              <Activity className="h-3 w-3" />
              {streamStatus}
            </Badge>
          </div>
        </div>
        <TableFilters 
          filterOptions={filterOptions}
          selectedDates={selectedDates}
          selectedMatchups={selectedMatchups}
          selectedLeagues={selectedLeagues}
          setSelectedDates={setSelectedDates}
          setSelectedMatchups={setSelectedMatchups}
          setSelectedLeagues={setSelectedLeagues}
        />
      </div>
    </CardHeader>
  );
};
