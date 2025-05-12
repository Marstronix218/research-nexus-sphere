-- Create researchers table
CREATE TABLE researchers (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  institution TEXT NOT NULL,
  department TEXT,
  interests TEXT[] NOT NULL DEFAULT '{}',
  publications INTEGER NOT NULL DEFAULT 0,
  citations INTEGER NOT NULL DEFAULT 0,
  h_index INTEGER NOT NULL DEFAULT 0,
  bio TEXT NOT NULL,
  photo_url TEXT,
  avatar TEXT,
  cited_by TEXT[] DEFAULT '{}',
  cites TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE researchers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Researchers are viewable by everyone" ON researchers
  FOR SELECT USING (true);

CREATE POLICY "Researchers can insert their own profile" ON researchers
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Researchers can update their own profile" ON researchers
  FOR UPDATE USING (auth.uid() = id);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER handle_researchers_updated_at
  BEFORE UPDATE ON researchers
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at(); 