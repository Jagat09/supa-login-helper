
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import TaskList from '@/components/tasks/TaskList';
import TaskForm from '@/components/tasks/TaskForm';
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
import { Loader2, Plus, Users } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TaskCalendarView from '@/components/tasks/TaskCalendarView';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AdminDashboardProps {
  userId: string | undefined;
}

export default function AdminDashboard({ userId }: AdminDashboardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [taskView, setTaskView] = useState<'all' | 'unassigned' | 'calendar'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assigned_to:users!assigned_to(username, email),
          assigned_by:users!assigned_by(username, email)
        `)
        .order('created_at', { ascending: false });

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

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, email')
        .order('username');

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
    await fetchTasks();
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
  
  const filteredTasks = taskView === 'unassigned' 
    ? tasks.filter(task => !task.assigned_to) 
    : tasks;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Manage and assign tasks to your team members.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <CalendarDateRangePicker />
          
          <Button onClick={() => setShowTaskForm(!showTaskForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
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
              currentUserId={userId || ''}
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
              onValueChange={(value: 'all' | 'unassigned' | 'calendar') => setTaskView(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Tasks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="unassigned">Unassigned Tasks</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => fetchTasks()}
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
              isAdmin={true}
            />
          )}
        </TabsContent>
      
        <TabsContent value="calendar" className="mt-0">
          <TaskCalendarView tasks={filteredTasks} />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </CardTitle>
          <CardDescription>Manage and assign tasks to your team.</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map(user => (
                <Card key={user.id} className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="flex flex-col space-y-1.5">
                      <h3 className="font-semibold text-lg">{user.username}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs mt-2">
                        Tasks assigned: {tasks.filter(task => task.assigned_to?.id === user.id).length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No team members available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
