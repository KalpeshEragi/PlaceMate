'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Question {
  id: string
  question: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

interface InterviewSession {
  id: string
  date: string
  score: number
  questionsAnswered: number
}

const INTERVIEW_QUESTIONS: Question[] = [
  {
    id: '1',
    question: "Tell me about yourself",
    category: 'General',
    difficulty: 'easy',
  },
  {
    id: '2',
    question: "What are your strengths?",
    category: 'General',
    difficulty: 'easy',
  },
  {
    id: '3',
    question: "What are your weaknesses?",
    category: 'General',
    difficulty: 'medium',
  },
  {
    id: '4',
    question: "Why do you want this job?",
    category: 'Motivation',
    difficulty: 'medium',
  },
  {
    id: '5',
    question: "Describe a time you overcame a challenge",
    category: 'Behavioral',
    difficulty: 'medium',
  },
  {
    id: '6',
    question: "How do you handle conflicts with colleagues?",
    category: 'Behavioral',
    difficulty: 'hard',
  },
  {
    id: '7',
    question: "What's your biggest professional achievement?",
    category: 'Motivation',
    difficulty: 'medium',
  },
  {
    id: '8',
    question: "Where do you see yourself in 5 years?",
    category: 'Motivation',
    difficulty: 'medium',
  },
]

export default function InterviewPracticePage() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<InterviewSession[]>([])
  const [isInterviewing, setIsInterviewing] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [sessionScore, setSessionScore] = useState(0)

  useEffect(() => {
    // Load sessions from localStorage
    const saved = localStorage.getItem(`interview-sessions-${user?.id}`)
    if (saved) {
      setSessions(JSON.parse(saved))
    }
  }, [user?.id])

  const startInterview = () => {
    setIsInterviewing(true)
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setCurrentAnswer('')
    setSessionScore(0)
  }

  const handleAnswerSubmit = () => {
    if (currentAnswer.trim()) {
      setUserAnswers([...userAnswers, currentAnswer])
      setCurrentAnswer('')

      // Simple scoring logic (in a real app, this would use AI)
      if (currentAnswer.length > 50) {
        setSessionScore(sessionScore + 10)
      }

      if (currentQuestionIndex < INTERVIEW_QUESTIONS.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        endInterview()
      }
    }
  }

  const endInterview = () => {
    const newSession: InterviewSession = {
      id: Math.random().toString(),
      date: new Date().toLocaleDateString(),
      score: sessionScore,
      questionsAnswered: userAnswers.length,
    }
    const updatedSessions = [newSession, ...sessions]
    setSessions(updatedSessions)
    localStorage.setItem(`interview-sessions-${user?.id}`, JSON.stringify(updatedSessions))

    setIsInterviewing(false)
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setCurrentAnswer('')
  }

  if (isInterviewing) {
    const currentQuestion = INTERVIEW_QUESTIONS[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / INTERVIEW_QUESTIONS.length) * 100

    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Interview Practice</h1>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Question {currentQuestionIndex + 1} of {INTERVIEW_QUESTIONS.length}
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-muted rounded text-sm text-muted-foreground">
                {currentQuestion.category}
              </span>
              <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                {currentQuestion.difficulty}
              </span>
            </div>
            <CardTitle className="text-2xl mt-4">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="answer" className="text-sm font-medium text-foreground">
                Your Answer
              </label>
              <textarea
                id="answer"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Provide a thoughtful answer..."
                className="w-full p-3 rounded-md border border-input bg-background text-foreground min-h-[200px]"
              />
            </div>
            <div className="flex gap-4">
              <Button onClick={handleAnswerSubmit} className="flex-1">
                Next Question
              </Button>
              <Button variant="outline" onClick={endInterview}>
                End Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Interview Practice</h1>
        <p className="text-muted-foreground">
          Practice common interview questions with AI feedback
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sessions Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{sessions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {sessions.length > 0
                ? Math.round(
                    sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length
                  )
                : 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Questions Practiced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {sessions.reduce((sum, s) => sum + s.questionsAnswered, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={startInterview} size="lg" className="mb-8 w-full md:w-auto">
        🎤 Start New Interview Session
      </Button>

      {sessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Previous Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div>
                    <p className="font-medium text-foreground">{session.date}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.questionsAnswered} questions answered
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{session.score}</p>
                    <p className="text-sm text-muted-foreground">Score</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Interview Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
            <li>✓ Speak clearly and maintain a steady pace</li>
            <li>✓ Provide specific examples from your experience</li>
            <li>✓ Listen carefully to the question before answering</li>
            <li>✓ Take a moment to think before responding</li>
            <li>✓ Keep your answers concise but comprehensive</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
