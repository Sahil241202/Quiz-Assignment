# Quiz Master 🧠

A full-stack quiz application built with React, TypeScript, and Supabase (PostgreSQL database).

## Features

✅ **Email Collection**: Users start by entering their email address  
✅ **15 Trivia Questions**: Fetched from Open Trivia Database API  
✅ **30-Minute Timer**: Countdown timer with auto-submit  
✅ **Question Navigation**: Jump to any question with overview panel  
✅ **Progress Tracking**: Visual indicators for answered and visited questions  
✅ **Results Page**: Detailed comparison of user answers vs correct answers  
✅ **Leaderboard**: Top scores with ranking system  
✅ **Responsive Design**: Beautiful UI with smooth animations  
✅ **Play Again**: Restart the quiz anytime  

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui
- **Routing**: React Router v6
- **State Management**: React Hooks
- **API**: Open Trivia Database

## Routes

- `/` - Start page with email collection
- `/quiz` - Quiz interface with questions and timer
- `/result` - Results page with detailed answer review
- `/leaderboard` - Global leaderboard with top scores

## Database Schema

### quiz_attempts
```sql
- id: UUID (Primary Key)
- email: TEXT (User's email)
- score: INTEGER (Correct answers count)
- total_questions: INTEGER (Total questions = 15)
- answers: JSONB (Array of answer objects)
- time_taken: INTEGER (Time in seconds)
- created_at: TIMESTAMP (Submission time)
```

## Design System

### Colors
- **Primary**: Purple gradient (262° 83% 58%)
- **Accent**: Blue (220° 90% 56%)
- **Success**: Green (142° 76% 36%)
- **Warning**: Amber (38° 92% 50%)
- **Destructive**: Red (0° 84% 60%)

### Animations
- Fade-in effects
- Smooth transitions
- Hover states
- Progress animations

## Features Breakdown

### Quiz Interface
- Real-time countdown timer (30 minutes)
- Question counter and progress bar
- Multiple choice options
- Previous/Next navigation
- Overview panel with:
  - Question status indicators
  - Jump-to-question functionality
  - Visual progress tracking

### Results Page
- Score summary with percentage
- Time taken display
- Question-by-question review
- Side-by-side answer comparison
- Play Again and Leaderboard buttons

### Leaderboard
- Sorted by score (descending) and time (ascending)
- Top 3 with special badges and icons
- Email masking for privacy
- Responsive card layout
- Real-time updates

## How to Use

1. **Start**: Enter your email address on the home page
2. **Quiz**: Answer 15 questions within 30 minutes
3. **Navigate**: Use Next/Previous or click question numbers
4. **Submit**: Click "Submit Quiz" or wait for auto-submit
5. **Review**: Check your results and see correct answers
6. **Compete**: View your ranking on the leaderboard
7. **Retry**: Click "Play Again" to take another quiz

## Development

The app uses Supabase for backend functionality:
- No separate backend server needed
- PostgreSQL database with Row Level Security
- Automatic API generation
- Real-time data updates

## Security

- Public RLS policies (no authentication required)
- Email validation
- Input sanitization
- HTML entity decoding for safe rendering

## Future Enhancements

- User authentication
- Category selection
- Difficulty levels
- Time attack mode
- Social sharing
- Achievement badges
- Personal statistics

---

Built with ❤️ using React and Supabase
