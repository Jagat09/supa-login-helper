
import { createClient } from '@supabase/supabase-js'

// Using the actual Supabase URL and anon key from our connected project
const supabaseUrl = 'https://okowpojqlredwewbenzq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rb3dwb2pxbHJlZHdld2JlbnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NzYyMTIsImV4cCI6MjA2MDM1MjIxMn0.psDXOLYLjytp9FhXdW7BNjVijh-qe9SmPaT45-ohF5s'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Function to safely get user data without triggering infinite recursion
export const fetchUsersSimple = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, role')
      .order('username');
    
    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
    
    console.log('Users fetched:', data);
    return { data, error };
  } catch (error) {
    console.error('Error in fetchUsersSimple:', error);
    return { data: null, error };
  }
}

// Function to safely get task data with user information
export const fetchTasks = async (filterBy = null) => {
  try {
    console.log('Fetching tasks...');
    
    // First fetch all tasks
    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Apply filter if provided (like user ID)
    if (filterBy && filterBy.userId) {
      query = query.eq('assigned_to', filterBy.userId);
    }
    
    const { data: tasks, error } = await query;
    
    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
    
    console.log('Tasks fetched:', tasks);
    
    // If we have tasks, fetch user data separately
    if (tasks && tasks.length > 0) {
      // Get unique user IDs from tasks
      const userIds = [...new Set([
        ...tasks.map(task => task.assigned_to).filter(Boolean),
        ...tasks.map(task => task.assigned_by).filter(Boolean)
      ])];
      
      if (userIds.length > 0) {
        const { data: users, error: userError } = await supabase
          .from('users')
          .select('id, username, email')
          .in('id', userIds);
        
        if (userError) {
          console.error('Error fetching users for tasks:', userError);
        }
        
        // Create a map for quick lookup
        const userMap = {};
        if (users && users.length > 0) {
          users.forEach(user => { userMap[user.id] = user; });
        }
        
        // Manually join the data
        const enhancedTasks = tasks.map(task => ({
          ...task,
          assigned_to: task.assigned_to ? userMap[task.assigned_to] || { id: task.assigned_to } : null,
          assigned_by: task.assigned_by ? userMap[task.assigned_by] || { id: task.assigned_by } : null
        }));
        
        return { data: enhancedTasks, error: null };
      }
    }
    
    // Return tasks without user data if we couldn't fetch users
    return { data: tasks, error: null };
  } catch (error) {
    console.error('Error in fetchTasks:', error);
    return { data: null, error };
  }
}

// Function to update task status
export const updateTaskStatus = async (taskId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', taskId)
      .select();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating task status:', error);
    return { data: null, error };
  }
}
