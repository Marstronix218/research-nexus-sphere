import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createSampleResearcher() {
  try {
    // 1. Create a user account
    const email = 'sarah.chen+test@gmail.com';
    const password = 'sample-password-123';
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError && signUpError.message !== 'User already registered') throw signUpError;

    // 2. Sign in as the user to get a session
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) throw signInError;
    const user = signInData.user;
    if (!user) throw new Error('No user found after sign in');

    // 3. Insert the researcher profile as the authenticated user
    const { error: profileError } = await supabase.from('researchers').insert([
      {
        id: user.id,
        name: 'Dr. Sarah Chen',
        institution: 'Stanford University',
        department: 'Computer Science',
        interests: ['Machine Learning', 'Computer Vision', 'Natural Language Processing'],
        publications: 45,
        citations: 3200,
        h_index: 28,
        bio: 'Dr. Sarah Chen is a leading researcher in the field of artificial intelligence, with a focus on computer vision and natural language processing. Her work has been published in top-tier conferences and journals, including NeurIPS, CVPR, and ACL. She leads the Stanford AI Research Lab and has received numerous awards for her contributions to the field.',
        photo_url: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
        avatar: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901'
      }
    ]);

    if (profileError) throw profileError;

    console.log('Sample researcher created successfully!');
    console.log('User ID:', user.id);
  } catch (error) {
    console.error('Error creating sample researcher:', error);
  }
}

createSampleResearcher(); 