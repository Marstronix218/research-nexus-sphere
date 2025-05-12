import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function CreateResearcher() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    institution: '',
    interests: '',
    bio: '',
    photoUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // 2. Create researcher profile
      const { error: profileError } = await supabase.from('researchers').insert([
        {
          id: authData.user?.id,
          name: formData.name,
          institution: formData.institution,
          interests: formData.interests.split(',').map(i => i.trim()),
          bio: formData.bio,
          photoUrl: formData.photoUrl,
          publications: 0,
          citations: 0,
          hIndex: 0,
        },
      ]);

      if (profileError) throw profileError;

      toast.success('Registration successful!');
      router.push('/researchers');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-research-blue mb-8">Create Researcher Profile</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="institution">Institution</Label>
            <Input
              id="institution"
              name="institution"
              required
              value={formData.institution}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="interests">Research Interests (comma-separated)</Label>
            <Input
              id="interests"
              name="interests"
              required
              value={formData.interests}
              onChange={handleChange}
              placeholder="e.g. Machine Learning, Computer Vision, NLP"
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              required
              value={formData.bio}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="photoUrl">Profile Photo URL</Label>
            <Input
              id="photoUrl"
              name="photoUrl"
              type="url"
              value={formData.photoUrl}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating Profile...' : 'Create Profile'}
        </Button>
      </form>
    </div>
  );
} 