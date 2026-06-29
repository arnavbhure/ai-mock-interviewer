# AI Mock Interviewer Platform

# PRD Part 2

# AI Engine, Agent Workflow, and Interview Orchestration

Version: 1.0
Status: Locked

---

# 1. AI System Overview

The AI subsystem is responsible for:

- resume understanding,
- candidate profiling,
- interview planning,
- question generation,
- follow-up generation,
- answer evaluation,
- scoring,
- recommendation generation,
- improvement planning.

The AI system must behave similarly to a real technical interviewer.

---

# 2. AI Technology Stack

## Core LLM

OpenAI API

Responsibilities:

- resume analysis
- question generation
- answer evaluation
- report generation
- recommendation generation

---

## Framework

LangChain JS

Responsibilities:

- prompt management
- chains
- output parsing
- retrieval
- memory

---

## Workflow Engine

LangGraph

Responsibilities:

- state management
- interview flow
- conditional routing
- evaluation pipeline

---

## Vector Database

PostgreSQL + pgvector

Responsibilities:

- resume embeddings
- interview history embeddings
- question embeddings
- skill embeddings
- retrieval

---

# 3. AI Architecture

System:

Frontend
|
|
Backend API
|
|
Interview Orchestrator
|
|
LangGraph Workflow
|
|
OpenAI API
|
|
PostgreSQL + pgvector

---

# 4. Interview State Machine

Every interview exists as a state machine.

States:

INITIALIZED

↓

RESUME_ANALYSIS

↓

INTERVIEW_PLANNING

↓

PROJECT_ROUND

↓

TECHNICAL_ROUND

↓

DSA_OR_SYSTEM_DESIGN

↓

BEHAVIORAL_ROUND

↓

EVALUATION

↓

REPORT_GENERATION

↓

COMPLETED

---

# 5. LangGraph Workflow

START

↓

Load Resume

↓

Extract Candidate Profile

↓

Generate Interview Plan

↓

Greeting

↓

Resume Discussion

↓

Technical Round

↓

DSA/System Design

↓

Behavioral Round

↓

Final Evaluation

↓

Generate Report

↓

END

---

# 6. Candidate Profile Builder

Input:

Resume

Output:

{
"candidate_name":"",
"role":"",
"experience":"",
"skills":[],
"projects":[],
"strengths":[],
"weaknesses":[]
}

Example:

{
"candidate_name":"Arnav",
"role":"MERN Developer",
"experience":"Fresher",
"skills":[
"React",
"Node",
"Express",
"MongoDB",
"PostgreSQL"
],
"projects":[
"CityLink",
"ClinicSync"
]
}

---

# 7. Interview Planner Agent

Purpose:

Create interview structure.

Input:

- role
- experience
- difficulty
- resume
- projects

Output:

{
"rounds":[
"project",
"technical",
"dsa",
"behavioral"
],
"duration":45,
"questions":25
}

---

# 8. Greeting Agent

Purpose:

Act as a professional interviewer.

Example:

Hello Arnav.

Welcome to InterviewAI.

Today we will conduct a medium difficulty MERN developer interview.

The interview consists of:

- Resume Discussion
- Technical Round
- DSA Round
- Behavioral Round

Please explain your answers whenever possible.

Let's begin.

---

# 9. Resume Discussion Agent

Goal:

Determine whether candidate genuinely understands projects.

Evaluate:

- architecture
- database
- API design
- authentication
- deployment
- challenges
- scalability

Example:

Question:

Tell me about CityLink.

Candidate:

It is a roommate finding platform.

Follow-up:

Why did you choose PostgreSQL instead of MongoDB?

Follow-up:

Why did you use Socket.IO?

Follow-up:

How would you scale the chat system?

---

# 10. Technical Interview Agent

Input:

skills

Example:

[
"React",
"Node",
"MongoDB",
"PostgreSQL"
]

Generate questions from:

- React
- Node
- Express
- APIs
- JWT
- Databases
- System internals

Difficulty:

easy
medium
hard

---

# 11. DSA Agent

Purpose:

Evaluate algorithmic thinking.

Topics:

- arrays
- strings
- linked list
- trees
- graphs
- recursion
- DP

Example:

Easy:
Two Sum

Medium:
Longest Substring Without Repeating Characters

Hard:
Word Ladder

---

# 12. System Design Agent

Used only when:

experience > fresher

Topics:

- scalability
- load balancing
- caching
- database design
- microservices

Example:

Design WhatsApp.

Design URL Shortener.

Design Notification Service.

---

# 13. Behavioral Agent

Evaluate:

- communication
- confidence
- leadership
- teamwork
- decision making

Questions:

Tell me about yourself.

Describe a conflict.

Describe a failure.

What are your weaknesses?

Why should we hire you?

---

# 14. Follow-up Question Agent

This is the most important agent.

Purpose:

Act like a real interviewer.

Example:

Question:
Explain JWT.

Candidate:
JWT stores sessions.

AI:

You mentioned sessions.

Can you explain why JWT is considered stateless?

---

Question:

Explain useEffect.

Candidate:
It runs after rendering.

AI:

What causes infinite re-render loops?

---

# 15. Evaluation Agent

Input:

question
answer
candidate profile
difficulty
round

Evaluate:

Technical Knowledge

0-10

Communication

0-10

Confidence

0-10

Problem Solving

0-10

Depth

0-10

Project Understanding

0-10

Behavior

0-10

---

# 16. Hiring Recommendation Agent

Generate:

Strong Hire

Hire

Borderline

Weak Hire

No Hire

Never output:

Selected
Rejected

---

# 17. Improvement Agent

Generate:

Strengths:

✓ React
✓ APIs

Weaknesses:

✗ Docker
✗ Redis
✗ DSA

Roadmap:

Week 1:
Learn Redis

Week 2:
Practice Graph Problems

Week 3:
Learn Docker

Week 4:
Conduct Mock Interviews

---

# 18. Interview Memory

Store:

Question

Answer

Evaluation

Confidence

Mistakes

Skills

Round

Difficulty

Timestamp

---

# 19. AI Failure Handling

If LLM fails:

- retry
- fallback prompt
- fallback question bank
- continue interview

Never terminate interview.

---

# 20. Token Optimization

To reduce costs:

Store:

- summarized interview history
- summarized resume
- summarized previous answers

Avoid sending:

- full resume
- full conversation history

on every request.

---

# 21. RAG Usage

Retrieve:

- previous interviews
- previous mistakes
- candidate strengths
- candidate weaknesses
- previous reports

Purpose:

Generate personalized interviews.

---

# 22. AI Objective

The AI should simulate:

70% Technical Interviewer

20% Behavioral Interviewer

10% Career Coach

The AI should NEVER behave like:

- ChatGPT assistant
- friend
- tutor
- mentor

The AI must behave as a professional interviewer.
