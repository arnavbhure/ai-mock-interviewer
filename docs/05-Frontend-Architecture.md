# AI Mock Interviewer Platform

# PRD Part 5

# Frontend Architecture, UI/UX Design System, Pages, and User Flows

Version: 1.0
Status: Locked

---

# 1. Frontend Philosophy

The frontend should feel like:

- a professional hiring platform,
- a coding assessment platform,
- a technical interview environment.

The UI should NOT feel like:

- ChatGPT,
- a chatbot,
- a social media app,
- an AI toy/demo project.

Design principles:

- minimal
- professional
- enterprise-grade
- distraction-free
- responsive
- accessible

---

# 2. Technology Stack

Framework:
React.js

Routing:
React Router DOM

State Management:
Zustand

Server State:
React Query

Forms:
React Hook Form

Validation:
Zod

Styling:
Tailwind CSS

Icons:
Lucide React

Charts:
Recharts

Real-Time:
Socket.IO Client

Animations:
Framer Motion (minimal usage)

---

# 3. Design System

Primary Color:
#2563EB

Success:
#16A34A

Warning:
#F59E0B

Danger:
#DC2626

Background:
#F8FAFC

Surface:
#FFFFFF

Border:
#E5E7EB

Primary Text:
#111827

Secondary Text:
#6B7280

Border Radius:
6px

---

# 4. Typography

Font:
Inter

Headings:

H1:
36px

H2:
30px

H3:
24px

Body:
16px

Small:
14px

---

# 5. Application Structure

/

↓

Authentication

↓

Dashboard

↓

Interview Setup

↓

Interview Session

↓

Report

↓

Analytics

---

# 6. Pages Overview

Public Pages:

- Landing Page
- Login
- Register
- Forgot Password
- Reset Password

Private Pages:

- Dashboard
- Profile
- Interview Setup
- Interview Session
- Reports
- Report Detail
- Analytics
- Settings

---

# 7. Landing Page

Purpose:

Convert visitors into users.

Sections:

Hero Section

↓

Features

↓

How It Works

↓

Benefits

↓

Testimonials

↓

Footer

---

Hero:

Headline:

"Practice Real Technical Interviews with AI"

Subheadline:

"Personalized interviews generated from your resume, skills, and projects."

CTA:

Start Interview

---

# 8. Authentication Pages

Login Fields:

- email
- password

Actions:

- login
- forgot password
- register

---

Registration Fields:

- full name
- email
- password
- confirm password

---

# 9. Dashboard

Layout:

Sidebar

- Top Navbar
- Main Content

  ***

Sidebar:

Dashboard

New Interview

Reports

Analytics

Profile

Settings

Logout

---

Dashboard Cards:

Total Interviews

Average Score

Best Score

Hire Rate

Weak Areas

Strong Areas

---

Recent Interviews Table:

Date

Role

Difficulty

Score

Recommendation

Actions

---

# 10. Interview Setup Page

Step 1:

Upload Resume

---

Step 2:

Select Role

Options:

- Frontend
- Backend
- MERN
- Full Stack

---

Step 3:

Experience

Options:

- Fresher
- 1-2 Years
- 3-5 Years

---

Step 4:

Difficulty

Options:

- Easy
- Medium
- Hard

---

Step 5:

Review Information

---

Step 6:

Start Interview

---

# 11. Resume Upload Component

Features:

- drag and drop
- browse file
- upload progress
- validation
- upload preview

States:

idle

uploading

processing

completed

failed

---

# 12. Resume Processing Screen

Display:

Uploading Resume

↓

Extracting Information

↓

Analyzing Skills

↓

Analyzing Projects

↓

Building Candidate Profile

↓

Generating Interview Plan

---

# 13. Interview Preparation Screen

Display:

Candidate Name

Role

Experience

Difficulty

Rounds

Estimated Time

Example:

Resume Discussion

Technical Round

DSA Round

Behavioral Round

Button:

Begin Interview

---

# 14. Interview Session Layout

Layout:

---

Header

---

Question Area

---

Answer Area

---

Navigation Footer

---

---

# 15. Header Component

Display:

Interview Timer

Current Round

Question Number

Interview Status

Example:

Technical Round

Question 7 of 25

18:34

---

# 16. Question Card

Display:

Round Name

Question

Difficulty

Optional Notes

Example:

Technical Round

Explain React Reconciliation.

Difficulty:

Medium

---

# 17. Answer Section

Features:

Large text area

Character count

Submit button

Loading state

Autosave

---

# 18. Follow-Up Question UI

Display:

Original Question

↓

Candidate Answer

↓

AI Follow-Up

Example:

Question:

Explain JWT.

Your Answer:

JWT stores sessions.

Follow-Up:

Why is JWT considered stateless?

---

# 19. Round Completion Screen

Display:

Round Completed

Questions Answered

Round Score

Next Round

Example:

Technical Round Complete

Score:
82%

Proceed to DSA Round

---

# 20. Interview Completion Screen

Display:

Interview Completed Successfully

Generating Report...

Loading Steps:

Analyzing Answers

↓

Calculating Scores

↓

Generating Feedback

↓

Generating Recommendations

↓

Preparing Report

---

# 21. Final Report Page

Sections:

Overview

↓

Performance Breakdown

↓

Strengths

↓

Weaknesses

↓

Recommendations

↓

Improvement Plan

---

# 22. Overall Summary Card

Display:

Overall Score

Hiring Recommendation

Interview Duration

Difficulty

Example:

Overall Score:
84/100

Recommendation:
Hire

Duration:
42 minutes

Difficulty:
Medium

---

# 23. Score Breakdown

Categories:

Technical Knowledge

Communication

Problem Solving

Project Understanding

Behavioral Skills

Confidence

---

# 24. Strengths Section

Example:

Strong Areas:

✓ React

✓ Node.js

✓ APIs

✓ PostgreSQL

---

# 25. Weaknesses Section

Example:

Weak Areas:

✗ Redis

✗ Docker

✗ DSA

✗ System Design

---

# 26. Improvement Roadmap

Example:

Week 1:
Redis

Week 2:
Docker

Week 3:
Graph Algorithms

Week 4:
Mock Interviews

---

# 27. Interview History Page

Display:

All Previous Interviews

Columns:

Date

Role

Difficulty

Score

Recommendation

Action

---

# 28. Analytics Page

Display:

Total Interviews

Average Score

Best Score

Progress Trend

Strong Skills

Weak Skills

Recommendations

---

# 29. Profile Page

Display:

Profile Information

Uploaded Resume

Interview Statistics

Achievements

Settings

---

# 30. Settings Page

Options:

Update Profile

Change Password

Delete Account

Notification Preferences

Privacy Settings

---

# 31. Loading States

Every page must have:

- skeleton loading
- spinner fallback
- error state
- empty state

---

# 32. Error States

Examples:

Resume Upload Failed

Interview Generation Failed

AI Service Unavailable

Network Error

---

# 33. Responsive Design

Desktop:
1920px+

Laptop:
1366px+

Tablet:
768px+

Mobile:
375px+

---

# 34. Accessibility

Implement:

- keyboard navigation
- focus indicators
- ARIA labels
- semantic HTML
- screen reader support

---

# 35. Frontend Folder Structure

src/

components/

pages/

layouts/

hooks/

services/

store/

contexts/

routes/

utils/

constants/

assets/

types/

styles/

---

# 36. Component Categories

UI Components:

- Button
- Input
- Modal
- Dialog
- Toast
- Loader

Business Components:

- ResumeUploader
- InterviewCard
- QuestionCard
- AnswerBox
- ScoreCard
- ReportCard

Page Components:

- Dashboard
- InterviewSetup
- InterviewSession
- Reports
- Analytics

---

# Frontend Architecture Status

✓ Design system finalized

✓ User flows finalized

✓ Page hierarchy finalized

✓ Component architecture finalized

✓ Dashboard finalized

✓ Interview experience finalized

✓ Report UI finalized

✓ Analytics UI finalized
