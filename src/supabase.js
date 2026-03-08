import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pkrokkrcluymaitpcmaq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrcm9ra3JjbHV5bWFpdHBjbWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MzE1MTQsImV4cCI6MjA4ODUwNzUxNH0.naL6-Cc3cFsJyLG7G9adbBlL206KN0cp03VTRhWt0xM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
