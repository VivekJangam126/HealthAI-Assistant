import { formatDistanceToNow } from 'date-fns';
import { Star, Trash2, Activity, Pill, Brain, FileText, MessageSquare, Scan, Camera, Users } from 'lucide-react';
import { HistoryListItem } from '../../api/historyApi';

interface HistoryItemProps {
  item: HistoryListItem;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleBookmark: (id: string) => void;
}

const featureIcons: Record<string, any> = {
  symptoms: Activity,
  drugs: Pill,
  terms: Brain,
  reports: FileText,
  chat: MessageSquare,
  'medical-image': Scan,
  medicine: Camera,
  policy: Users,
};

const featureColors: Record<string, string> = {
  symptoms: 'text-blue-600 dark:text-blue-400',
  drugs: 'text-green-600 dark:text-green-400',
  terms: 'text-purple-600 dark:text-purple-400',
  reports: 'text-orange-600 dark:text-orange-400',
  chat: 'text-indigo-600 dark:text-indigo-400',
  'medical-image': 'text-pink-600 dark:text-pink-400',
  medicine: 'text-teal-600 dark:text-teal-400',
  policy: 'text-cyan-600 dark:text-cyan-400',
};

export default function HistoryItem({ item, onSelect, onDelete, onToggleBookmark }: HistoryItemProps) {
  const Icon = featureIcons[item.feature] || MessageSquare;
  const colorClass = featureColors[item.feature] || 'text-gray-600';

  return (
    <div
      onClick={() => onSelect(item._id)}
      className="group p-2 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${colorClass}`} />
          <h3 className="text-xs font-medium text-gray-900 dark:text-white truncate">
            {item.title}
          </h3>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(item._id);
            }}
            className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <Star
              className={`w-3 h-3 ${
                item.bookmarked
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-400 hover:text-yellow-400'
              }`}
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Delete this conversation?')) {
                onDelete(item._id);
              }
            }}
            className="p-0.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
        <span className="capitalize">{item.feature.replace('-', ' ')}</span>
        <span>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
      </div>
    </div>
  );
}
