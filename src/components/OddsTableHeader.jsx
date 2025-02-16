import { ALL_SPORTSBOOKS } from '../constants/sportsbooks';

export const OddsTableHeader = () => (
  <thead className="bg-gray-50 sticky top-0">
    <tr>
      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">League</th>
      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market</th>
      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selection</th>
      <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
      {ALL_SPORTSBOOKS.map(book => (
        <th key={book} className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
          {book}
        </th>
      ))}
      <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Limit</th>
    </tr>
  </thead>
);