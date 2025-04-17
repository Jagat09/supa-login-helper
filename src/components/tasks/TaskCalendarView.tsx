
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, isSameDay } from "date-fns";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  due_date: string;
  assigned_to: {
    username: string;
    email: string;
  } | null;
}

interface TaskCalendarViewProps {
  tasks: Task[];
}

export default function TaskCalendarView({ tasks }: TaskCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Get tasks for the selected date
  const tasksForSelectedDate = selectedDate 
    ? tasks.filter(task => 
        task.due_date && isSameDay(new Date(task.due_date), selectedDate)
      )
    : [];

  // Create a function to get CSS class for dates with tasks
  const getDayClassNames = (date: Date) => {
    // Check if there are tasks due on this date
    const hasTasksDue = tasks.some(task => 
      task.due_date && isSameDay(new Date(task.due_date), date)
    );

    // Check if there are high priority tasks due on this date
    const hasHighPriorityTasks = tasks.some(task => 
      task.due_date && 
      isSameDay(new Date(task.due_date), date) && 
      task.priority === 'high'
    );
    
    if (hasHighPriorityTasks) {
      return "bg-red-100 text-red-900 font-semibold";
    } else if (hasTasksDue) {
      return "bg-blue-50 font-medium";
    }
    
    return "";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-500 hover:bg-red-600';
      case 'medium': return 'bg-amber-500 hover:bg-amber-600';
      case 'low': return 'bg-green-500 hover:bg-green-600';
      default: return '';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      <div className="md:col-span-5">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="border rounded-md p-3"
          modifiersClassNames={{
            selected: 'bg-auth-600 text-white',
            today: 'bg-auth-100 text-auth-800 font-semibold',
          }}
          modifiers={{
            taskDates: (date) => tasks.some(
              task => task.due_date && isSameDay(new Date(task.due_date), date)
            ),
          }}
          styles={{
            day: (date) => {
              return {
                className: getDayClassNames(date),
              };
            },
          }}
          showOutsideDays={false}
        />
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'No date selected'}
            </CardTitle>
            <CardDescription>
              {tasksForSelectedDate.length} tasks due on this date
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tasksForSelectedDate.length > 0 ? (
              <div className="space-y-3">
                {tasksForSelectedDate.map((task) => (
                  <Popover key={task.id}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-3"
                      >
                        <div className="flex items-start gap-2 w-full">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <div className="truncate">
                            <div className="font-medium truncate">{task.title}</div>
                            <div className="text-xs text-muted-foreground mt-1 truncate">
                              {task.status} {task.assigned_to ? `• ${task.assigned_to.username}` : ''}
                            </div>
                          </div>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-semibold">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        )}
                        <div className="text-xs text-muted-foreground pt-1 border-t">
                          <div className="flex justify-between py-1">
                            <span>Status:</span>
                            <span className="font-medium">{task.status}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span>Priority:</span>
                            <span className="font-medium">{task.priority}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span>Assigned to:</span>
                            <span className="font-medium">
                              {task.assigned_to ? task.assigned_to.username : 'Unassigned'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm py-4 text-center">
                No tasks due on this date
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
