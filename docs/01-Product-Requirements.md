# AI Mock Interviewer Platform - Product Requirements Document (PRD)

# Version

v1.0

# Status

Architecture Locked

# Project Type

Full Stack + Generative AI + RAG + Agentic Workflow Platform

# Project Name

InterviewAI (working title)

---

# 1. Executive Summary

InterviewAI is an AI-powered mock interview preparation platform designed to simulate realistic technical interviews for software engineering candidates.

The platform conducts personalized interviews based on a candidate's uploaded resume, skills, projects, experience level, and selected interview difficulty.

Unlike traditional chatbot interview systems, InterviewAI aims to replicate the behavior of an actual human interviewer by:

- analyzing the candidate's resume,
- understanding candidate projects,
- generating adaptive interview questions,
- asking contextual follow-up questions,
- evaluating technical and behavioral performance,
- producing hiring recommendations,
- generating personalized improvement plans.

The primary goal of InterviewAI is to help candidates prepare for real-world software engineering interviews while providing measurable performance analytics.

---

# 2. Problem Statement

Current interview preparation methods suffer from several limitations:

- static question banks,
- non-personalized mock interviews,
- lack of realistic interviewer behavior,
- no adaptive questioning,
- poor performance analytics,
- generic feedback.

Candidates often struggle to determine:

- their actual interview readiness,
- their technical strengths,
- their communication weaknesses,
- whether they would pass a real interview.

InterviewAI solves these problems by acting as a personalized AI interviewer.

---

# 3. Product Goals

The system must:

✓ Conduct realistic mock interviews

✓ Generate questions based on candidate resumes

✓ Analyze candidate projects

✓ Ask follow-up questions

✓ Evaluate candidate performance

✓ Simulate real interviewer behavior

✓ Generate detailed interview reports

✓ Track candidate improvement over time

✓ Provide actionable feedback

---

# 4. Target Users

Primary users:

- Computer Science students
- Fresh graduates
- Full-stack developers
- Frontend developers
- Backend developers
- MERN developers
- Software engineering job seekers

Secondary users:

- College placement preparation students
- Bootcamp students
- Self-taught developers

---

# 5. User Journey

User visits website
↓
Create account/login
↓
Dashboard
↓
Start Interview
↓
Upload Resume
↓
Resume Parsing
↓
Select Role
↓
Select Experience
↓
Select Difficulty
↓
AI Generates Interview Plan
↓
Interview Begins
↓
Project Discussion
↓
Technical Round
↓
DSA/System Design Round
↓
Behavioral Round
↓
Evaluation
↓
Report Generation
↓
History Dashboard

---

# 6. Authentication Module

## Features

### Registration

Required fields:

- full_name
- email
- password
- confirm_password

Validation:

- email uniqueness
- password complexity
- password confirmation

---

### Login

Fields:

- email
- password

Features:

- JWT authentication
- refresh tokens
- remember me

---

### Forgot Password

Flow:

forgot password
↓
email verification
↓
reset token
↓
new password

---

# 7. Dashboard Module

Dashboard displays:

## Statistics

- total interviews
- average score
- best score
- weak areas
- strong areas

---

## Quick Actions

Buttons:

- Start New Interview
- View Reports
- Interview History
- Update Resume

---

## Recent Interviews

Display:

Interview ID
Date
Role
Difficulty
Score
Recommendation

Example:

Interview #12
Role: MERN Developer
Difficulty: Medium
Score: 81
Recommendation: Hire

---

# 8. Resume Upload Module

Resume upload is mandatory.

User cannot proceed without uploading a resume.

Accepted formats:

- PDF

Maximum size:

- 10 MB

---

# Upload Flow

Upload Resume
↓
File Validation
↓
Text Extraction
↓
AI Parsing
↓
Structured Candidate Profile

---

# Extracted Information

## Personal Information

- name
- email
- phone
- location

---

## Skills

Examples:

- React
- Node
- Express
- MongoDB
- PostgreSQL
- Docker
- Redis

---

## Projects

Extract:

- project name
- technologies
- description
- architecture
- responsibilities

Example:

Project:
CityLink

Technologies:
React
Node
Socket.IO
PostgreSQL

Description:
A city relocation platform helping students and professionals discover roommates, accommodations, and local services.

---

## Experience

Extract:

- experience level
- internships
- freelance projects
- achievements

---

# Candidate Profile Object

{
"role":"MERN Developer",
"experience":"Fresher",
"skills":[...],
"projects":[...],
"strengths":[...],
"weaknesses":[...]
}

---

# 9. Interview Setup Module

Candidate selects:

## Role

Options:

- Frontend Developer
- Backend Developer
- MERN Developer
- Full Stack Developer

---

## Experience

Options:

- Fresher
- 1-2 Years
- 3-5 Years

---

## Difficulty

Options:

- Easy
- Medium
- Hard

---

# 10. AI Interview Planner

After resume analysis, AI creates an interview roadmap.

Example:

Candidate:
MERN Developer
Fresher

Generated Interview Plan:

Round 1:
Resume Discussion

Round 2:
Technical Round

Round 3:
DSA Round

Round 4:
Behavioral Round

Estimated Duration:
45 minutes

Expected Questions:
25

---

# 11. Interview Greeting

The AI interviewer starts professionally.

Example:

"Hello Arnav.

Welcome to InterviewAI.

My name is Alex, and I will be conducting your interview today.

This interview consists of four rounds:

- Resume Discussion
- Technical Assessment
- DSA Assessment
- Behavioral Assessment

Please answer confidently and explain your thought process whenever possible.

Let's begin."

---

# 12. Resume Discussion Round

Purpose:

Evaluate project understanding.

Topics:

- project architecture
- database design
- technology choices
- tradeoffs
- challenges
- scalability

Example Questions:

- Tell me about CityLink.
- Why did you choose PostgreSQL?
- Why Socket.IO?
- What was the hardest challenge?
- How would you scale this project?
- What would you improve?

---

# 13. Technical Round

Question sources:

- resume skills
- selected role
- difficulty level

Topics:

- React
- Node.js
- Express.js
- MongoDB
- PostgreSQL
- APIs
- Authentication
- WebSockets

Difficulty adapts according to performance.

---

# 14. DSA/System Design Round

Fresher:
DSA

Experienced:
System Design

Topics:

- arrays
- trees
- graphs
- dynamic programming
- complexity analysis

System design topics:

- caching
- load balancing
- database design
- scalability
- distributed systems

---

# 15. Behavioral Round

Topics:

- teamwork
- leadership
- conflict resolution
- failures
- strengths
- weaknesses
- communication

Example:

- Tell me about a failure.
- Describe a conflict.
- Why should we hire you?
- What are your weaknesses?

---
