import { ALL_SPORTSBOOKS } from '../constants/sportsbooks';
import { formatPrice } from '../utils/formatting';

export const OddsTableRow = ({ bet, priceUpdates }) => {
  // Get updates for this specific bet
  const betUpdates = priceUpdates[bet.game_id] || {};
  
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-2 px-4 text-sm">
        {bet.Home_Team} vs {bet.Away_Team}
      </td>
      <td className="py-2 px-4 text-sm text-gray-600">
        {bet.League}
      </td>
      <td className="py-2 px-4 text-sm">
        {bet.Market}
      </td>
      <td className="py-2 px-4 text-sm">
        {bet.Selection}
      </td>
      <td className="py-2 px-4">
        <span className="inline-flex justify-center w-full">
          <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 text-xs rounded">
            {bet.Grade}
          </span>
        </span>
      </td>
      {ALL_SPORTSBOOKS.map(book => (
        <td key={book} className="py-2 px-4 text-center font-mono text-sm">
          {/* Original price */}
          <div>
            {formatPrice(bet.currentPrices?.[book])}
          </div>
          
          {/* Updated price if exists */}
          {betUpdates[`${bet.Market}-${bet.Selection}-${book}`] && (
            <div className={`mt-1 p-1 rounded ${
              betUpdates[`${bet.Market}-${bet.Selection}-${book}`] > (bet.currentPrices?.[book] || 0)
                ? 'bg-green-100 text-green-800' 
                : betUpdates[`${bet.Market}-${bet.Selection}-${book}`] < (bet.currentPrices?.[book] || 0)
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
            }`}>
              {formatPrice(betUpdates[`${bet.Market}-${bet.Selection}-${book}`])}
            </div>
          )}
        </td>
      ))}
      <td className="py-2 px-4 text-right font-mono text-sm">
        {bet.Pinn_Limit || '-'}
      </td>
    </tr>
  );
};