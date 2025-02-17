import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender
} from '@tanstack/react-table';
import { Search, ArrowUpDown, Activity } from 'lucide-react';
import { formatPrice } from '../utils/formatting';
import { ALL_SPORTSBOOKS } from '../constants/sportsbooks';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";

const OddsTable = ({ 
  bets = [], 
  priceUpdates = {}, 
  streamStatus = 'disconnected' 
}) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = React.useMemo(() => [
    {
      header: 'Match',
      accessorFn: row => `${row.Home_Team} vs ${row.Away_Team}`,
      cell: ({ getValue }) => (
        <div className="font-medium">{getValue()}</div>
      ),
    },
    {
      header: 'League',
      accessorKey: 'League',
      cell: ({ getValue }) => (
        <div className="text-muted-foreground">{getValue()}</div>
      ),
    },
    {
      header: 'Market',
      accessorKey: 'Market',
      cell: ({ getValue }) => (
        <div className="whitespace-nowrap">{getValue()}</div>
      ),
    },
    {
      header: 'Selection',
      accessorKey: 'Selection',
      cell: ({ getValue }) => (
        <div className="whitespace-nowrap">{getValue()}</div>
      ),
    },
    {
      header: 'Grade',
      accessorKey: 'Grade',
      cell: ({ getValue }) => (
        <div className="flex justify-center">
          <Badge variant="secondary" className="font-medium">
            {getValue()}
          </Badge>
        </div>
      ),
    },
    ...ALL_SPORTSBOOKS.map(book => ({
      header: book,
      accessorFn: row => row.currentPrices?.[book],
      cell: ({ row, getValue }) => {
        const originalPrice = getValue();
        const betUpdates = priceUpdates[row.original.game_id] || {};
        const update = betUpdates[`${row.original.Market}-${row.original.Selection}-${book}`];
        
        return (
          <div className="text-center font-mono">
            <div className={update ? 'text-muted-foreground' : ''}>
              {formatPrice(originalPrice)}
            </div>
            {update && (
              <Badge 
                variant={update > originalPrice ? 'success' : update < originalPrice ? 'destructive' : 'secondary'}
                className="mt-1 animate-fade-in"
              >
                {formatPrice(update)}
              </Badge>
            )}
          </div>
        );
      },
    })),
    {
      header: 'Limit',
      accessorKey: 'Pinn_Limit',
      cell: ({ getValue }) => (
        <div className="text-right font-mono text-muted-foreground">
          {getValue() || '-'}
        </div>
      ),
    },
  ], [priceUpdates]);

  const table = useReactTable({
    data: bets,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

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
        <CardHeader className="pb-4">
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
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={globalFilter}
                onChange={e => setGlobalFilter(e.target.value)}
                placeholder="Search bets..."
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
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