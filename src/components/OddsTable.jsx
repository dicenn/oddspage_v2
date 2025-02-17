// src/components/OddsTable.jsx
import React, { useMemo } from 'react';
import { flexRender } from '@tanstack/react-table';
import { Card, CardContent } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { TableHeader as CustomTableHeader } from './table/TableHeader';
import { useTableData } from './table/useTableData';
import { createColumns } from './table/columns';

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

  if (!bets.length) {
    return (
      <Card className="mx-auto max-w-7xl">
        <CardContent className="p-6 text-center text-muted-foreground">
          No bets available
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[95vw] mx-auto">
      <Card>
        <CustomTableHeader 
          streamStatus={streamStatus}
          filterOptions={filterOptions}
          selectedDates={selectedDates}
          selectedMatchups={selectedMatchups}
          selectedLeagues={selectedLeagues}
          setSelectedDates={setSelectedDates}
          setSelectedMatchups={setSelectedMatchups}
          setSelectedLeagues={setSelectedLeagues}
        />
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <TableHead
                        key={header.id}
                        className="group cursor-pointer"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center justify-between">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          <ArrowUpDown className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    className="group"
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell
                        key={cell.id}
                        className="group-hover:bg-muted/50 transition-colors"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OddsTable;