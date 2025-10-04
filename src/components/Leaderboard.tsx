import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Home, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardEntry {
  id: string;
  email: string;
  score: number;
  total_questions: number;
  time_taken: number;
  created_at: string;
}

const Leaderboard = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from("quiz_attempts")
        .select("*")
        .order("score", { ascending: false })
        .order("time_taken", { ascending: true })
        .limit(100);

      if (error) throw error;

      setEntries(data || []);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-6 h-6 text-warning" />;
      case 1:
        return <Medal className="w-6 h-6 text-muted-foreground" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 text-center font-bold text-muted-foreground">{index + 1}</span>;
    }
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return "1st Place";
    if (index === 1) return "2nd Place";
    if (index === 2) return "3rd Place";
    return `${index + 1}th`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-warning to-amber-600 rounded-2xl mb-6 shadow-lg">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Leaderboard
          </h1>
          <p className="text-xl text-muted-foreground">Top Quiz Masters</p>
        </div>

        <Card className="border-2 shadow-2xl mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Top Scores</span>
              <Badge variant="secondary" className="text-sm">
                {entries.length} {entries.length === 1 ? "Entry" : "Entries"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {entries.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg text-muted-foreground mb-2">No entries yet!</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Be the first to complete the quiz
                </p>
                <Button onClick={() => navigate("/")} className="bg-gradient-to-r from-primary to-accent">
                  Take the Quiz
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry, index) => {
                  const percentage = (entry.score / entry.total_questions) * 100;
                  const isTopThree = index < 3;

                  return (
                    <div
                      key={entry.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isTopThree
                          ? "border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5"
                          : "border-border bg-card"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12">
                          {getRankIcon(index)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold truncate">{entry.email}</span>
                            {isTopThree && (
                              <Badge variant="outline" className="text-xs">
                                {getRankBadge(index)}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{formatDate(entry.created_at)}</span>
                            {entry.time_taken && (
                              <>
                                <span>•</span>
                                <span>{formatTime(entry.time_taken)}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary mb-1">
                            {entry.score}/{entry.total_questions}
                          </div>
                          <Badge
                            variant={percentage >= 80 ? "default" : percentage >= 60 ? "secondary" : "outline"}
                          >
                            {percentage.toFixed(0)}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            onClick={() => navigate("/")}
            size="lg"
            className="bg-gradient-to-r from-primary to-accent"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
