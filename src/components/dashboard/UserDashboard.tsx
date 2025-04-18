import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import TaskList from '@/components/tasks/TaskList';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDateRangePicker } from '@/components/tasks/DateRangePicker';
import { Loader2, CheckSquare, Clock } from 'lucide-react';
import TaskCalendarView from '@/components/tasks/TaskCalendarView';

interface UserDashboardProps {
  userId: string | undefined;
}

export default function UserDashboard({ userId }: UserDashboardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchUserTasks();
    }
  }, [userId]);

  const fetchUserTasks = async () => {
    try {
      setIsLoading(true);
      
      // Improved query to correctly fetch tasks with related user data
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assigned_to:users!assigned_to(username, email),
          assigned_by:users!assigned_by(username, email)
        `)
        .eq('assigned_to', userId)
        .order('due_date', { ascending: true });

      if (error) {
        throw error;
      }

      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch tasks. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', taskId);

      if (error) throw error;

      // Update local state
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status } : task
      ));

      toast({
        title: 'Task Updated',
        description: `Task status changed to ${status}.`,
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task status.',
        variant: 'destructive',
      });
    }
  };

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  
  // Get tasks due soon (within next 3 days)
  const today = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(today.getDate() + 3);
  
  const tasksDueSoon = tasks.filter(task => {
    if (!task.due_date) return false;
    const dueDate = new Date(task.due_date);
    return dueDate <= threeDaysFromNow && dueDate >= today && task.status !== 'completed';
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Tasks</h2>
          <p className="text-muted-foreground">
            View and manage tasks assigned to you.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <CalendarDateRangePicker />
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={fetchUserTasks}
            title="Refresh tasks"
          >
            <Loader2 className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
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
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasks Due Soon
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksDueSoon.length}</div>
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

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
      
        <TabsContent value="list" className="mt-0">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-auth-600" />
            </div>
          ) : (
            <TaskList 
              tasks={tasks} 
              onStatusUpdate={handleStatusUpdate} 
              isAdmin={false}
            />
          )}
        </TabsContent>
      
        <TabsContent value="calendar" className="mt-0">
          <TaskCalendarView tasks={tasks} />
        </TabsContent>
      </Tabs>

      {tasks.length === 0 && !isLoading && (
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
      )}
    </div>
  );
}
