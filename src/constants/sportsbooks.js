// src/constants/sportsbooks.js

// API identifiers for the sportsbooks
export const SPORTSBOOK_BATCHES = [
  ['Pinnacle', 'BetRivers', 'Betway (Alaska)', 'DraftKings', 'Caesars'],
  ['BetMGM', 'Betfair Exchange', 'Betonline', 'Hard Rock', 'ESPN BET'],
  ['Fanatics', 'Bet365', 'Bovada', 'Betano', 'Bet105']
];

export const ALL_SPORTSBOOKS = SPORTSBOOK_BATCHES.flat();

// Special sportsbooks for filtering
export const KEY_SPORTSBOOKS = ['Pinnacle', 'BetRivers'];

// Display name mapping (for cases where API name differs from display name)
export const SPORTSBOOK_DISPLAY_NAMES = {
  'Betway (Alaska)': 'Fanduel'
};

// Function to get display name for a sportsbook
export const getDisplayName = (sportsbook) => {
  return SPORTSBOOK_DISPLAY_NAMES[sportsbook] || sportsbook;
};

// Function to get API name from display name
export const getApiName = (displayName) => {
  const reverse = Object.entries(SPORTSBOOK_DISPLAY_NAMES)
    .find(([api, display]) => display === displayName);
  
  return reverse ? reverse[0] : displayName;
};