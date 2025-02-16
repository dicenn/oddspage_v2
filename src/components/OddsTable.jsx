import { useOddsData } from '../hooks/useOddsData';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorDisplay } from './ErrorDisplay';
import { OddsTableHeader } from './OddsTableHeader';
import { OddsTableRow } from './OddsTableRow';

const OddsTable = () => {
  const { bets, loading, error } = useOddsData();
  const priceUpdates = useOddsStream(bets);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Live Bets</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <OddsTableHeader />
          <tbody className="bg-white divide-y divide-gray-200">
            {bets.map((bet, index) => (
              <OddsTableRow key={index} bet={bet} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OddsTable;