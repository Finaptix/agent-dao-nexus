// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://adypjhkyblaqirfmlzvy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkeXBqaGt5YmxhcWlyZm1senZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MjE1NTUsImV4cCI6MjA1OTk5NzU1NX0.1FA5ZEJkFF8pM49USJA4Ke9E7jL2VEu7GwYxXyPqO58";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);