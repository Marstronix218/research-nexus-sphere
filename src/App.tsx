
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Map from "./pages/Map";
import ResearcherList from "./components/ResearcherList";
import ResearcherProfile from "./components/ResearcherProfile";
import NetworkGraph from "./components/NetworkGraph";
import Articles from "./pages/Articles";
import Events from "./pages/Events";
import Feeds from "./pages/Feeds";
import Mentors from "./pages/Mentors";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Map />} />
              <Route path="/researchers" element={<ResearcherList />} />
              <Route path="/researchers/:id" element={<ResearcherProfile />} />
              <Route path="/network" element={<NetworkGraph />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/events" element={<Events />} />
              <Route path="/feeds" element={<Feeds />} />
              <Route path="/mentors" element={<Mentors />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
