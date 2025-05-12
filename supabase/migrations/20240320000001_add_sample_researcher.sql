-- Insert a sample researcher
INSERT INTO researchers (
  id,
  name,
  institution,
  department,
  interests,
  publications,
  citations,
  h_index,
  bio,
  photo_url,
  avatar
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- This is a placeholder UUID, you'll need to replace it with a real user ID
  'Dr. Sarah Chen',
  'Stanford University',
  'Computer Science',
  ARRAY['Machine Learning', 'Computer Vision', 'Natural Language Processing'],
  45,
  3200,
  28,
  'Dr. Sarah Chen is a leading researcher in the field of artificial intelligence, with a focus on computer vision and natural language processing. Her work has been published in top-tier conferences and journals, including NeurIPS, CVPR, and ACL. She leads the Stanford AI Research Lab and has received numerous awards for her contributions to the field.',
  'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
  'https://images.unsplash.com/photo-1582562124811-c09040d0a901'
); 