import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, Circle, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  category: string;
  difficulty: string;
  type: string;
}

interface Answer {
  questionIndex: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

const Quiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const email = sessionStorage.getItem("quizEmail");
    if (!email) {
      navigate("/");
      return;
    }

    fetchQuestions();
  }, [navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("https://opentdb.com/api.php?amount=15");
      const data = await response.json();
      
      if (data.results) {
        setQuestions(data.results);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      const next = currentQuestion + 1;
      setCurrentQuestion(next);
      setVisited(new Set([...visited, next]));
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      const prev = currentQuestion - 1;
      setCurrentQuestion(prev);
      setVisited(new Set([...visited, prev]));
    }
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestion(index);
    setVisited(new Set([...visited, index]));
  };

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const email = sessionStorage.getItem("quizEmail");
    
    if (!email) {
      navigate("/");
      return;
    }

    // Calculate score and prepare results
    const results: Answer[] = questions.map((q, index) => ({
      questionIndex: index,
      question: q.question,
      userAnswer: answers[index] || "Not Answered",
      correctAnswer: q.correct_answer,
      isCorrect: answers[index] === q.correct_answer,
    }));

    const score = results.filter((r) => r.isCorrect).length;
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    // Save to database
    try {
      const { error } = await supabase.from("quiz_attempts").insert([{
        email,
        score,
        total_questions: questions.length,
        answers: results as any,
        time_taken: timeTaken,
      }]);

      if (error) throw error;

      // Store results in session storage for results page
      sessionStorage.setItem("quizResults", JSON.stringify({ score, results, timeTaken }));
      navigate("/result");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save results. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  }, [answers, questions, navigate, startTime, isSubmitting]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const decodeHtml = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-lg mb-4">Failed to load questions</p>
            <Button onClick={() => navigate("/")}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const allAnswers = [...currentQ.incorrect_answers, currentQ.correct_answer].sort();
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="max-w-7xl mx-auto py-6">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Quiz Master
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-base px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              {formatTime(timeLeft)}
            </Badge>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-primary to-accent"
            >
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          </div>
        </div>

        <Progress value={progress} className="mb-6 h-2" />

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-2 shadow-lg">
              <CardContent className="pt-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary">{currentQ.category}</Badge>
                    <Badge
                      variant={
                        currentQ.difficulty === "easy"
                          ? "default"
                          : currentQ.difficulty === "medium"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {currentQ.difficulty}
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-semibold mb-6">
                    {decodeHtml(currentQ.question)}
                  </h2>
                </div>

                <div className="space-y-3">
                  {allAnswers.map((answer, index) => {
                    const isSelected = answers[currentQuestion] === answer;
                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswer(answer)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                            }`}
                          >
                            {isSelected && <div className="w-3 h-3 bg-primary-foreground rounded-full" />}
                          </div>
                          <span className="text-base">{decodeHtml(answer)}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    variant="outline"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={currentQuestion === questions.length - 1}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Overview Panel */}
          <div className="lg:col-span-1">
            <Card className="border-2 shadow-lg sticky top-6">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4">Overview</h3>
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>{answeredCount} Answered</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-accent" />
                    <span>{visited.size} Visited</span>
                  </div>
                </div>
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div className="grid grid-cols-4 gap-2">
                    {questions.map((_, index) => {
                      const isAnswered = answers[index] !== undefined;
                      const isVisited = visited.has(index);
                      const isCurrent = index === currentQuestion;

                      return (
                        <button
                          key={index}
                          onClick={() => handleJumpToQuestion(index)}
                          className={`aspect-square rounded-lg border-2 flex items-center justify-center font-semibold transition-all ${
                            isCurrent
                              ? "border-primary bg-primary text-primary-foreground scale-110"
                              : isAnswered
                              ? "border-success bg-success/10 text-success hover:bg-success/20"
                              : isVisited
                              ? "border-accent bg-accent/10 text-accent hover:bg-accent/20"
                              : "border-border hover:border-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
