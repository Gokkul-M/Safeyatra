import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Landing from "@/pages/landing";
import PilgrimLogin from "@/pages/pilgrim/login";
import PilgrimDashboard from "@/pages/pilgrim/dashboard";
import CommandLogin from "@/pages/command/login";
import CommandDashboard from "@/pages/command/dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/pilgrim/login" component={PilgrimLogin} />
      <Route path="/pilgrim/dashboard" component={PilgrimDashboard} />
      <Route path="/command/login" component={CommandLogin} />
      <Route path="/command/dashboard" component={CommandDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
