
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Restaurant } from "@/types/restaurant";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "Restaurant name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Please provide a more detailed description." }),
  menu: z.string().min(2, { message: "Please add at least one menu item." }),
  kitchenExperience: z.string().min(5, { message: "Please describe your research experience." }),
  requirements: z.string().min(5, { message: "Please add requirements to join." })
});

interface CreateRestaurantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (restaurant: Restaurant) => void;
}

const CreateRestaurantDialog = ({ open, onOpenChange, onSubmit }: CreateRestaurantDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      menu: "",
      kitchenExperience: "",
      requirements: ""
    }
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    const newRestaurant: Restaurant = {
      id: `restaurant-${Date.now()}`,
      name: values.name,
      description: values.description,
      menu: values.menu.split(',').map(item => item.trim()),
      kitchenExperience: values.kitchenExperience.split('\n').filter(exp => exp.trim() !== ''),
      requirements: values.requirements.split('\n').filter(req => req.trim() !== ''),
      members: [
        {
          id: `member-${Date.now()}`,
          name: "You (Chef)",
          role: "Chef",
          institution: "Your Institution"
        }
      ],
      dishes: [],
      badges: []
    };
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(newRestaurant);
      form.reset();
      
      toast({
        title: "Restaurant Created!",
        description: `Your research restaurant "${values.name}" is now open for collaboration.`,
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Open a New Research Restaurant</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restaurant Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Neuro-Image Pizza" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your research focus and goals" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="menu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu (Research Topics)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Deep Learning, NLP, Computer Vision (comma separated)" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="kitchenExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kitchen Experience (Research Background)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter each item on a new line, e.g.&#10;Specialized in computer vision&#10;Experience with neural networks" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirements to Join</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter each requirement on a new line, e.g.&#10;Basic knowledge of ML&#10;Collaborative mindset" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="mt-2"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-research-purple hover:bg-research-light-purple mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Restaurant"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRestaurantDialog;
