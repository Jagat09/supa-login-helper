
import { Card, CardContent } from '@/components/ui/card';
import { CheckSquare } from 'lucide-react';

export function EmptyTaskState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          <CheckSquare className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Tasks Assigned</h3>
        <p className="text-muted-foreground text-center max-w-md">
          You don't have any tasks assigned to you yet. They will appear here once an administrator assigns them to you.
        </p>
      </CardContent>
    </Card>
  );
}
