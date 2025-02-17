// src/components/MultiSelect.jsx
import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Card } from './ui/card';

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Date Filter",
  className = "",
}) {
  const [open, setOpen] = React.useState(false);

  const toggleOption = (option) => {
    const newSelected = selected.includes(option)
      ? selected.filter(item => item !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  const toggleAll = () => {
    onChange(selected.length === options.length ? [] : options);
  };

  // Get display text based on selection
  const getDisplayText = () => {
    if (selected.length === 0) return placeholder;
    if (selected.length === options.length) return "All dates selected";
    return `${selected.length} dates selected`;
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && !event.target.closest('.multi-select-container')) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative multi-select-container">
      <div
        className={`relative w-full border rounded-md p-2 cursor-pointer ${className}`}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center justify-between">
          <span className={selected.length === 0 ? "text-muted-foreground" : ""}>
            {getDisplayText()}
          </span>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </div>
      </div>
      {open && (
        <Card className="absolute w-full z-50 mt-1 rounded-md border bg-card shadow-md">
          <div className="p-2">
            <div
              className="flex items-center px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation();
                toggleAll();
              }}
            >
              <Check
                className={`mr-2 h-4 w-4 ${
                  selected.length === options.length ? "opacity-100" : "opacity-0"
                }`}
              />
              <span>Select All</span>
            </div>
            {options.map((option) => (
              <div
                key={option}
                className="flex items-center px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(option);
                }}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${
                    selected.includes(option) ? "opacity-100" : "opacity-0"
                  }`}
                />
                {option}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}