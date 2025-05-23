import React, { useState } from 'react';
import { flexRender } from '@tanstack/react-table';
import { Card, CardContent } from "./ui/card";
import { TableHeader as CustomTableHeader } from './table/TableHeader';

const FrozenTable = ({ 
  table,
  filterOptions,
  selectedDates,
  selectedMatchups,
  selectedLeagues,
  setSelectedDates,
  setSelectedMatchups,
  setSelectedLeagues,
  streamStatus,
  loading = false,
  showOnlyKeyBooks,
  setShowOnlyKeyBooks
}) => {
  console.log("FrozenTable - setShowOnlyKeyBooks:", typeof setShowOnlyKeyBooks);
  
  const [isScrolled, setIsScrolled] = useState(false);

  // Dynamic column widths based on screen size and scroll state
  const getColumnWidth = (index) => {
    // First column (Match Info)
    if (index === 0) return { 
      mobile: isScrolled ? '100px' : '140px', 
      desktop: '300px' 
    };
    // Second column (Market/Selection)
    if (index === 1) return { 
      mobile: isScrolled ? '80px' : '120px', 
      desktop: '300px' 
    };
    // Other columns
    return { mobile: '100px', desktop: '120px' };
  };

  // Calculate left position for frozen columns
  const getLeftPosition = (index) => {
    if (index === 0) return '0';
    if (index === 1) {
      // The left position of second column depends on first column's width
      const firstColWidth = isScrolled ? '100px' : '140px';
      return { 
        mobile: firstColWidth, 
        desktop: '300px' 
      };
    }
    return 'auto';
  };

  const handleScroll = (e) => {
    // More sensitive scroll detection to ensure the transition happens quickly
    setIsScrolled(e.target.scrollLeft > 10);
    
    // Force a re-render for the transition to apply immediately
    setTimeout(() => {
      const container = e.target;
      if (container) {
        const event = new Event('resize');
        window.dispatchEvent(event);
      }
    }, 10);
  };

  // Calculate showEmptyState based on loading and row count
  const hasRows = table.getRowModel().rows?.length > 0;
  const showEmptyState = !loading && !hasRows;
  const showLoadingEmptyState = loading && !hasRows;

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="w-full flex-none">
        <Card className="w-full mb-4">
          <CustomTableHeader 
            streamStatus={streamStatus}
            filterOptions={filterOptions}
            selectedDates={selectedDates}
            selectedMatchups={selectedMatchups}
            selectedLeagues={selectedLeagues}
            setSelectedDates={setSelectedDates}
            setSelectedMatchups={setSelectedMatchups}
            setSelectedLeagues={setSelectedLeagues}
            showOnlyKeyBooks={showOnlyKeyBooks}
            setShowOnlyKeyBooks={setShowOnlyKeyBooks}
          />
        </Card>
      </div>

      {/* Table section - scrollable */}
      <div className="flex-grow overflow-auto">
        <Card className="w-full h-full">
          <CardContent className="p-0 h-full">
            <div className="relative h-full rounded-md border">
              <div 
                className="overflow-x-auto w-full h-full"
                onScroll={handleScroll}
              >
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 z-20">
                    {table.getHeaderGroups().map(headerGroup => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header, index) => {
                          const columnWidth = getColumnWidth(index);
                          const leftPos = getLeftPosition(index);
                          return (
                            <th
                              key={header.id}
                              className={`
                                p-2 sm:p-4 text-left text-[10px] sm:text-sm font-medium text-muted-foreground h-12
                                ${index < 2 ? 'sticky left-0 z-10' : ''}
                                ${index === 1 ? 'border-r border-border' : ''}
                                ${index < 2 ? 'bg-muted' : 'bg-muted'}
                                truncate transition-all duration-300
                              `}
                              style={{
                                left: typeof leftPos === 'string' ? leftPos : 
                                      `clamp(${leftPos.mobile}, 20vw, ${leftPos.desktop})`,
                                width: `clamp(${columnWidth.mobile}, 20vw, ${columnWidth.desktop})`,
                                minWidth: columnWidth.mobile,
                                maxWidth: columnWidth.desktop
                              }}
                            >
                              <div className="truncate">
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {showEmptyState && (
                      <tr>
                        <td 
                          colSpan={table.getAllColumns().length}
                          className="text-center p-8"
                        >
                          <div className="text-lg font-semibold mb-2">No matches found</div>
                          <p className="text-muted-foreground">
                            Try adjusting your filters to see more results
                          </p>
                        </td>
                      </tr>
                    )}
                    
                    {showLoadingEmptyState && (
                      <tr>
                        <td 
                          colSpan={table.getAllColumns().length}
                          className="text-center p-8"
                        >
                          <div className="text-lg font-semibold mb-2">Loading matches...</div>
                          <p className="text-muted-foreground">
                            Odds data will appear shortly
                          </p>
                        </td>
                      </tr>
                    )}
                    
                    {hasRows && table.getRowModel().rows.map(row => (
                      <tr
                        key={row.id}
                        className="border-b last:border-b-0 hover:bg-gray-100 group"
                      >
                        {row.getVisibleCells().map((cell, index) => {
                          const columnWidth = getColumnWidth(index);
                          const leftPos = getLeftPosition(index);
                          return (
                            <td
                              key={cell.id}
                              className={`
                                p-2 sm:p-4 align-middle
                                text-[10px] sm:text-sm
                                ${index < 2 ? 'sticky left-0 bg-card z-10 group-hover:bg-gray-100' : ''}
                                ${index === 1 ? 'border-r border-border' : ''}
                                truncate transition-all duration-300
                              `}
                              style={{
                                left: typeof leftPos === 'string' ? leftPos : 
                                      `clamp(${leftPos.mobile}, 20vw, ${leftPos.desktop})`,
                                width: `clamp(${columnWidth.mobile}, 20vw, ${columnWidth.desktop})`,
                                minWidth: columnWidth.mobile,
                                maxWidth: columnWidth.desktop
                              }}
                            >
                              <div className="truncate">
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FrozenTable;