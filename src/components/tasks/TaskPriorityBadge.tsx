
import { AlertTriangle, Flag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TaskPriorityBadgeProps {
  priority: string;
}

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  switch (priority.toLowerCase()) {
    case 'high':
      return (
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <Badge className="bg-red-500 hover:bg-red-600">High</Badge>
        </div>
      );
    case 'medium':
      return (
        <div className="flex items-center gap-1.5">
          <Flag className="h-4 w-4 text-amber-500" />
          <Badge className="bg-amber-500 hover:bg-amber-600">Medium</Badge>
        </div>
      );
    case 'low':
      return (
        <div className="flex items-center gap-1.5">
          <Flag className="h-4 w-4 text-green-500" />
          <Badge className="bg-green-500 hover:bg-green-600">Low</Badge>
        </div>
      );
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
}
