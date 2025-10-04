import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Trophy, Timer } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const QuizStart = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Store email in session storage for quiz
    sessionStorage.setItem("quizEmail", email);
    
    // Simulate loading for better UX
    setTimeout(() => {
      navigate("/quiz");
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/5 to-background p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl mb-6 shadow-lg">
            <Brain className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Quiz Master
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Test your knowledge with 15 challenging questions
          </p>
        </div>

        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Ready to Start?</CardTitle>
            <CardDescription>Enter your email to begin the quiz</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStart} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Brain className="w-8 h-8 text-primary" />
                  <div>
                    <div className="font-semibold">15 Questions</div>
                    <div className="text-sm text-muted-foreground">Various topics</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Timer className="w-8 h-8 text-accent" />
                  <div>
                    <div className="font-semibold">30 Minutes</div>
                    <div className="text-sm text-muted-foreground">Time limit</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Trophy className="w-8 h-8 text-warning" />
                  <div>
                    <div className="font-semibold">Leaderboard</div>
                    <div className="text-sm text-muted-foreground">Top scores</div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all"
                disabled={isLoading}
              >
                {isLoading ? "Starting..." : "Start Quiz"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/leaderboard")}
            className="text-muted-foreground hover:text-foreground"
          >
            View Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizStart;
