// OddsTableRow.jsx
import { ALL_SPORTSBOOKS } from '../constants/sportsbooks';
import { formatPrice } from '../utils/formatting';

export const OddsTableRow = ({ bet, priceUpdates }) => {
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
      {ALL_SPORTSBOOKS.map(book => {
        // Get the update for this cell if it exists
        const update = betUpdates[`${bet.Market}-${bet.Selection}-${book}`];
        const originalPrice = bet.currentPrices?.[book];
        
        return (
          <td key={book} className="py-2 px-4 text-center font-mono text-sm relative">
            {/* Original price */}
            <div className={update ? 'opacity-50' : ''}>
              {formatPrice(originalPrice)}
            </div>
            
            {/* Updated price */}
            {update && (
              <div 
                className={`
                  mt-1 p-1 rounded animate-pulse
                  ${update > originalPrice 
                    ? 'bg-green-100 text-green-800 font-bold' 
                    : update < originalPrice
                      ? 'bg-red-100 text-red-800 font-bold'
                      : 'bg-gray-100 text-gray-800'
                  }
                `}
              >
                {formatPrice(update)}
              </div>
            )}
          </td>
        );
      })}
      <td className="py-2 px-4 text-right font-mono text-sm">
        {bet.Pinn_Limit || '-'}
      </td>
    </tr>
  );
};