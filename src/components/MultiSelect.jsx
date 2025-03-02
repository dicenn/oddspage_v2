import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';

export function MultiSelect({
  options = [], // Add default empty array
  selected,
  onChange,
  placeholder = "Filter",
  className = "",
  type = "default"
}) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    // Add defensive checks
    if (!Array.isArray(options)) {
      console.warn('MultiSelect: options is not an array', options);
      setFilteredOptions([]);
      return;
    }

    const filtered = options.filter(option =>
      option && typeof option === 'string' && 
      option.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchQuery, options]);

  const toggleOption = (option) => {
    const newSelected = selected.includes(option)
      ? selected.filter(item => item !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  const toggleAll = () => {
    onChange(selected.length === options.length ? [] : [...options]);
  };

  // Get display text based on selection and type
  const getDisplayText = () => {
    if (!Array.isArray(selected) || selected.length === 0) {
      switch (type) {
        case "dates":
          return "No dates selected";
        case "matchups":
          return "No matches selected";
        case "leagues":
          return "No leagues selected";
        default:
          return "None selected";
      }
    }
    
    if (selected.length === options.length) {
      switch (type) {
        case "dates":
          return "All dates selected";
        case "matchups":
          return "All matches selected";
        case "leagues":
          return "All leagues selected";
        default:
          return "All selected";
      }
    }
    
    switch (type) {
      case "dates":
        return `${selected.length} ${selected.length === 1 ? 'date' : 'dates'} selected`;
      case "matchups":
        return `${selected.length} ${selected.length === 1 ? 'match' : 'matches'} selected`;
      case "leagues":
        return `${selected.length} ${selected.length === 1 ? 'league' : 'leagues'} selected`;
      default:
        return `${selected.length} selected`;
    }
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
          <span className={(!Array.isArray(selected) || selected.length === 0) ? "text-muted-foreground" : ""}>
            {getDisplayText()}
          </span>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </div>
      </div>
      {open && (
        <Card className="absolute w-full z-50 mt-1 rounded-md border bg-card shadow-md">
          <div className="p-2 space-y-2">
            <div className="flex items-center px-2 gap-2 border rounded-md">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="border-0 focus-visible:ring-0 px-0"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div
              className="flex items-center px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation();
                toggleAll();
              }}
            >
              <Check
                className={`mr-2 h-4 w-4 ${
                  Array.isArray(selected) && selected.length === options.length ? "opacity-100" : "opacity-0"
                }`}
              />
              <span>{Array.isArray(selected) && selected.length === options.length ? "Deselect All" : "Select All"}</span>
            </div>
            <div className="max-h-[200px] overflow-y-auto">
              {filteredOptions.map((option) => (
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
                      Array.isArray(selected) && selected.includes(option) ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {option}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}