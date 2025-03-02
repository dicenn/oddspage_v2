import React from 'react';
import OddsTable from './components/OddsTable';
import { useOddsData } from './hooks/useOddsData';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';
import { AlertTriangle } from 'lucide-react';

function App() {
  const { bets, loading, error, priceUpdates, streamStatus, invalidLeagues } = useOddsData();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* League validation warning removed as requested */}
      
      <OddsTable 
        bets={bets} 
        priceUpdates={priceUpdates} 
        streamStatus={streamStatus}
      />
    </div>
  );
}

export default App;