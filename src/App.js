import React, { useState } from 'react';
import OddsTable from './components/OddsTable';
import { useOddsData } from './hooks/useOddsData';
import { ErrorDisplay } from './components/ErrorDisplay';
import { Loader2 } from 'lucide-react';

function App() {
  const { bets, loading, error, priceUpdates, streamStatus } = useOddsData();
  // Add this state at the App level
  const [showOnlyKeyBooks, setShowOnlyKeyBooks] = useState(true);
  
  console.log("App render - setShowOnlyKeyBooks:", typeof setShowOnlyKeyBooks);

  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {loading && (
        <div className="fixed top-0 left-0 right-0 bg-primary/10 p-2 text-center z-50 flex justify-center items-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm font-medium">Loading odds data...</span>
        </div>
      )}
      
      <OddsTable 
        bets={bets} 
        priceUpdates={priceUpdates} 
        streamStatus={streamStatus}
        loading={loading}
        showOnlyKeyBooks={showOnlyKeyBooks}
        setShowOnlyKeyBooks={setShowOnlyKeyBooks}
      />
    </div>
  );
}

export default App;