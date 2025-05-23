
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Calendar, 
  CheckSquare, 
  ChevronDown, 
  ClipboardList,
  User
} from "lucide-react";
import { format } from "date-fns";
import { TaskPriorityBadge } from "./TaskPriorityBadge";

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  due_date: string | null;
  assigned_to: {
    id: string;
    username?: string;
    email?: string;
  } | null;
  assigned_by: {
    id: string;
    username?: string;
    email?: string;
  } | null;
}

interface TaskListProps {
  tasks: Task[];
  onStatusUpdate: (taskId: string, status: string) => void;
  isAdmin: boolean;
}

export default function TaskList({ tasks, onStatusUpdate, isAdmin }: TaskListProps) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-50 rounded-md">
        <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No tasks found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {isAdmin 
            ? "Create a new task to get started."
            : "You don't have any tasks assigned to you yet."
          }
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="border rounded-md overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="w-[300px]">Task</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className="hover:bg-slate-50">
              <TableCell className="font-medium">
                <div>
                  <div className="font-medium">{task.title}</div>
                  {task.description && (
                    <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {task.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <TaskPriorityBadge priority={task.priority} />
              </TableCell>
              <TableCell>{getStatusBadge(task.status)}</TableCell>
              <TableCell>
                {task.due_date ? (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{format(new Date(task.due_date), 'MMM dd, yyyy')}</span>
                  </div>
                ) : (
                  <span className="text-gray-500">No due date</span>
                )}
              </TableCell>
              <TableCell>
                {task.assigned_to ? (
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{task.assigned_to.username || 'User'}</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Unassigned</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      Update <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onStatusUpdate(task.id, 'pending')}>
                      Mark as Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusUpdate(task.id, 'in-progress')}>
                      Mark as In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusUpdate(task.id, 'completed')}>
                      <CheckSquare className="mr-2 h-4 w-4" />
                      Mark as Completed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
