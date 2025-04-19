
import { createClient } from '@supabase/supabase-js'

// Using the actual Supabase URL and anon key from our connected project
const supabaseUrl = 'https://okowpojqlredwewbenzq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rb3dwb2pxbHJlZHdld2JlbnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NzYyMTIsImV4cCI6MjA2MDM1MjIxMn0.psDXOLYLjytp9FhXdW7BNjVijh-qe9SmPaT45-ohF5s'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Function to safely get user data without triggering infinite recursion
export const fetchUsersSimple = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, email, role')
    .order('username');
  
  return { data, error };
}

// Function to safely get task data without complex joins
export const fetchTasks = async (filterBy = null) => {
  let query = supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
  
  // Apply filter if provided (like user ID)
  if (filterBy && filterBy.userId) {
    query = query.eq('assigned_to', filterBy.userId);
  }
  
  const { data, error } = await query;
  
  // If we have tasks and user data, manually join the data
  if (data && data.length > 0) {
    // Get unique user IDs from tasks
    const userIds = [...new Set([
      ...data.map(task => task.assigned_to).filter(Boolean),
      ...data.map(task => task.assigned_by).filter(Boolean)
    ])];
    
    if (userIds.length > 0) {
      const { data: users } = await supabase
        .from('users')
        .select('id, username, email')
        .in('id', userIds);
      
      // Create a map for quick lookup
      const userMap = {};
      if (users) {
        users.forEach(user => { userMap[user.id] = user; });
      }
      
      // Manually join the data
      return { 
        data: data.map(task => ({
          ...task,
          assigned_to: task.assigned_to ? userMap[task.assigned_to] || null : null,
          assigned_by: task.assigned_by ? userMap[task.assigned_by] || null : null
        })),
        error 
      };
    }
  }
  
  return { data, error };
}
