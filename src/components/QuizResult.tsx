import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, CheckCircle2, XCircle, RotateCcw, Award } from "lucide-react";

interface Answer {
  questionIndex: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface QuizResults {
  score: number;
  results: Answer[];
  timeTaken: number;
}

const QuizResult = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<QuizResults | null>(null);

  useEffect(() => {
    const storedResults = sessionStorage.getItem("quizResults");
    if (!storedResults) {
      navigate("/");
      return;
    }

    setResults(JSON.parse(storedResults));
  }, [navigate]);

  const handlePlayAgain = () => {
    sessionStorage.removeItem("quizResults");
    sessionStorage.removeItem("quizEmail");
    navigate("/");
  };

  const decodeHtml = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const percentage = (results.score / results.results.length) * 100;
  const passed = percentage >= 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Score Card */}
        <Card className="border-2 shadow-2xl mb-8 overflow-hidden">
          <div className={`h-2 ${passed ? "bg-gradient-to-r from-success to-success" : "bg-gradient-to-r from-destructive to-warning"}`} />
          <CardHeader className="text-center pb-4">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mx-auto mb-6 ${
              passed ? "bg-gradient-to-br from-success to-success/80" : "bg-gradient-to-br from-destructive to-warning"
            }`}>
              {passed ? (
                <Trophy className="w-12 h-12 text-white" />
              ) : (
                <Award className="w-12 h-12 text-white" />
              )}
            </div>
            <CardTitle className="text-4xl font-bold mb-2">
              {passed ? "Congratulations!" : "Good Effort!"}
            </CardTitle>
            <p className="text-muted-foreground text-lg">
              {passed ? "You've passed the quiz!" : "Keep practicing to improve!"}
            </p>
          </CardHeader>
          <CardContent className="text-center space-y-6 pb-8">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-primary">{results.score}</div>
                <div className="text-sm text-muted-foreground mt-1">Correct</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-accent">{percentage.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground mt-1">Score</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-foreground">{formatTime(results.timeTaken)}</div>
                <div className="text-sm text-muted-foreground mt-1">Time</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button
                onClick={handlePlayAgain}
                size="lg"
                className="bg-gradient-to-r from-primary to-accent"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Again
              </Button>
              <Button
                onClick={() => navigate("/leaderboard")}
                variant="outline"
                size="lg"
              >
                View Leaderboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card className="border-2 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Review Your Answers</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                {results.results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-lg border-2 ${
                      result.isCorrect
                        ? "border-success/30 bg-success/5"
                        : "border-destructive/30 bg-destructive/5"
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      {result.isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Question {index + 1}</Badge>
                          <Badge variant={result.isCorrect ? "default" : "destructive"}>
                            {result.isCorrect ? "Correct" : "Incorrect"}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold mb-4">
                          {decodeHtml(result.question)}
                        </h3>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Your Answer:</div>
                            <div className={`p-3 rounded-lg ${
                              result.isCorrect
                                ? "bg-success/10 text-success font-medium"
                                : "bg-destructive/10 text-destructive font-medium"
                            }`}>
                              {decodeHtml(result.userAnswer)}
                            </div>
                          </div>
                          
                          {!result.isCorrect && (
                            <div>
                              <div className="text-sm text-muted-foreground mb-1">Correct Answer:</div>
                              <div className="p-3 rounded-lg bg-success/10 text-success font-medium">
                                {decodeHtml(result.correctAnswer)}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizResult;
