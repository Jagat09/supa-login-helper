
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import TaskList from '@/components/tasks/TaskList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CalendarDateRangePicker } from '@/components/tasks/DateRangePicker';
import { Loader2 } from 'lucide-react';
import TaskCalendarView from '@/components/tasks/TaskCalendarView';
import { TaskStats } from './stats/TaskStats';
import { EmptyTaskState } from './EmptyTaskState';

interface UserDashboardProps {
  userId: string | undefined;
  userRole?: string | null;
}

export default function UserDashboard({ userId, userRole }: UserDashboardProps) {
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
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', userId)
        .order('due_date', { ascending: true });

      if (error) {
        throw error;
      }

      console.log("Tasks fetched successfully:", data);
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

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  
  const today = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(today.getDate() + 3);
  
  const tasksDueSoon = tasks.filter(task => {
    if (!task.due_date) return false;
    const dueDate = new Date(task.due_date);
    return dueDate <= threeDaysFromNow && dueDate >= today && task.status !== 'completed';
  });

  const isAdmin = userRole === 'admin';

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
            className={isLoading ? "animate-spin" : ""}
          >
            <Loader2 className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <TaskStats
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        pendingTasks={pendingTasks}
        inProgressTasks={inProgressTasks}
        tasksDueSoon={tasksDueSoon.length}
        isAdmin={isAdmin}
      />

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
              isAdmin={isAdmin}
            />
          )}
        </TabsContent>
      
        <TabsContent value="calendar" className="mt-0">
          <TaskCalendarView tasks={tasks} />
        </TabsContent>
      </Tabs>

      {tasks.length === 0 && !isLoading && <EmptyTaskState />}
    </div>
  );
}
