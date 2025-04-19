
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchTasks, fetchUsersSimple, supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import TaskList from '@/components/tasks/TaskList';
import TaskForm from '@/components/tasks/TaskForm';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDateRangePicker } from '@/components/tasks/DateRangePicker';
import { Loader2, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskCalendarView from '@/components/tasks/TaskCalendarView';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default function Tasks() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [taskView, setTaskView] = useState<'all' | 'mine' | 'unassigned' | 'calendar'>('all');
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      getUserRole();
      loadData();
    }
  }, [user]);

  const getUserRole = async () => {
    try {
      const { data: role, error } = await supabase.rpc('get_user_role');
      
      if (error) {
        throw error;
      }
      
      console.info("User role fetched successfully:", role);
      setUserRole(role);
    } catch (error) {
      console.error("Error fetching user role:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user role. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    await Promise.all([
      loadTasks(),
      loadUsers()
    ]);
    setIsLoading(false);
  };

  const loadTasks = async () => {
    try {
      const { data, error } = await fetchTasks();

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
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await fetchUsersSimple();

      if (error) {
        throw error;
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleTaskCreated = async (newTask: any) => {
    setShowTaskForm(false);
    await loadTasks();
    toast({
      title: 'Task Created',
      description: 'The task has been successfully created.',
    });
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
  
  const getFilteredTasks = () => {
    if (!tasks) return [];
    
    switch (taskView) {
      case 'mine':
        return tasks.filter(task => task.assigned_to?.id === user?.id);
      case 'unassigned':
        return tasks.filter(task => !task.assigned_to);
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();
  const isAdmin = userRole === 'admin';

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <DashboardHeader
        heading="Tasks Management"
        text="Create, assign, and manage tasks for your team."
      />

      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <CalendarDateRangePicker />
          
          {isAdmin && (
            <Button onClick={() => setShowTaskForm(!showTaskForm)} className="gap-2 ml-auto">
              <Plus className="h-4 w-4" />
              Create Task
            </Button>
          )}
        </div>
      </div>

      {showTaskForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Task</CardTitle>
            <CardDescription>Fill out the form to create a new task.</CardDescription>
          </CardHeader>
          <CardContent>
            <TaskForm 
              users={users} 
              currentUserId={user?.id || ''}
              onTaskCreated={handleTaskCreated} 
              onCancel={() => setShowTaskForm(false)}
            />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="list" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Select 
              value={taskView} 
              onValueChange={(value: 'all' | 'mine' | 'unassigned') => setTaskView(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Tasks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="mine">My Tasks</SelectItem>
                {isAdmin && <SelectItem value="unassigned">Unassigned Tasks</SelectItem>}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => loadData()}
              title="Refresh tasks"
            >
              <Loader2 className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      
        <TabsContent value="list" className="mt-0">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-auth-600" />
            </div>
          ) : (
            <TaskList 
              tasks={filteredTasks} 
              onStatusUpdate={handleStatusUpdate}
              isAdmin={isAdmin}
            />
          )}
        </TabsContent>
      
        <TabsContent value="calendar" className="mt-0">
          <TaskCalendarView tasks={filteredTasks} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
