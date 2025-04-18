
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Clock } from 'lucide-react';

interface TaskStatsProps {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  tasksDueSoon: number;
  isAdmin: boolean;
}

export function TaskStats({
  totalTasks,
  completedTasks,
  pendingTasks,
  inProgressTasks,
  tasksDueSoon,
  isAdmin
}: TaskStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className={isAdmin ? "border-auth-200" : ""}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Tasks
          </CardTitle>
          <CheckSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTasks}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Completed: {completedTasks} | In Progress: {inProgressTasks} | Pending: {pendingTasks}
          </p>
        </CardContent>
      </Card>
      
      <Card className="border-amber-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tasks Due Soon
          </CardTitle>
          <Clock className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tasksDueSoon}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Tasks due within the next 3 days
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Completion Rate
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {completedTasks} completed out of {totalTasks} total tasks
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
