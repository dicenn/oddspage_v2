import { formatPrice } from '../../utils/formatting';
import { Badge } from '../ui/badge';
import { ALL_SPORTSBOOKS, getDisplayName } from '../../constants/sportsbooks';

export const createColumns = (priceUpdates) => [
  {
    header: 'Match Info',
    accessorKey: 'matchInfo',
    cell: ({ row }) => {
      const sport = row.original.Sport?.toLowerCase();
      const sportEmoji = {
        soccer: '⚽️',
        basketball: '🏀',
        football: '🏈',
        baseball: '⚾️',
        hockey: '🏒',
        tennis: '🎾',
      }[sport] || '🎮';

      const matchDate = new Date(row.original.Match_Date);
      const formattedDate = matchDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      const matchup = `${row.original.Home_Team} vs ${row.original.Away_Team}`;

      return (
        <div className="space-y-1 min-w-[300px]">
          <div className="flex items-center gap-2 text-sm text-muted-foreground truncate">
            <span>{sportEmoji}</span>
            <span>{formattedDate}</span>
          </div>
          <div className="font-medium truncate">
            {matchup}
          </div>
          <div className="text-sm text-muted-foreground truncate">
            {row.original.League}
          </div>
        </div>
      );
    },
  },
  {
    header: 'Market/Selection',
    accessorKey: 'marketSelection',
    cell: ({ row }) => (
      <div className="space-y-1 min-w-[200px]">
        <div className="text-sm text-muted-foreground truncate">
          {row.original.Market}
        </div>
        <div className="font-medium truncate">
          {row.original.Selection}
        </div>
      </div>
    ),
  },
  ...ALL_SPORTSBOOKS.map(book => {
    const displayName = getDisplayName(book);
    
    return {
      id: book,
      header: () => (
        <div className="w-full h-full flex items-center justify-center p-2">
          <div className="w-full h-[40px] relative flex items-center justify-center">
            <img 
              src={`/images/${displayName}.png`}
              alt={displayName}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        </div>
      ),
      accessorFn: row => row.currentPrices?.[book],
      cell: ({ row, getValue }) => {
        const originalPrice = getValue();
        const betUpdates = priceUpdates[row.original.game_id] || {};
        const update = betUpdates[`${row.original.Market}-${row.original.Selection}-${book}`];
        
        return (
          <div className="text-center font-mono">
            <div className={update ? 'text-muted-foreground' : ''}>
              {formatPrice(originalPrice)}
            </div>
            {update && (
              <Badge 
                variant={update > originalPrice ? 'success' : update < originalPrice ? 'destructive' : 'secondary'}
                className="mt-1 animate-fade-in"
              >
                {formatPrice(update)}
              </Badge>
            )}
          </div>
        );
      },
    };
  }),
  {
    header: 'Limit',
    accessorKey: 'Pinn_Limit',
    cell: ({ getValue }) => (
      <div className="text-right font-mono text-muted-foreground">
        {getValue() || '-'}
      </div>
    ),
  },
];