import React from 'react';
import OddsTable from './components/OddsTable';
import { useOddsData } from './hooks/useOddsData';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';

function App() {
  const { bets, loading, error, priceUpdates, streamStatus } = useOddsData();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <OddsTable 
        bets={bets} 
        priceUpdates={priceUpdates} 
        streamStatus={streamStatus}
      />
    </div>
  );
}

export default App;