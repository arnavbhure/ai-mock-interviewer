# AI Mock Interviewer Platform

# PRD Part 8

# Infrastructure, Deployment, Security, Cost Estimation & Development Roadmap

Version: 1.0
Status: Locked

---

# 1. Infrastructure Philosophy

The project should be built with:

- production architecture
- minimal operational cost
- maximum scalability
- easy deployment
- simple local development

The architecture should support:

- local development
- portfolio deployment
- future SaaS scaling

---

# 2. Deployment Architecture

```
                Internet
                     |
                     |
                Cloudflare
                     |
                     |
                Frontend CDN
                     |
                     |
                API Server
                     |
        ---------------------------
        |            |            |
        |            |            |
    PostgreSQL     OpenAI      Storage
        |
        |
    pgvector
```

---

# 3. Frontend Hosting

Preferred:

Vercel

Reasons:

- free tier
- React support
- CDN
- easy deployment
- preview deployments

---

# 4. Backend Hosting

Options:

Development:

- localhost

Portfolio:

- Railway
- Render

Production:

- AWS
- GCP
- DigitalOcean

Recommended:

Railway

---

# 5. Database Hosting

Development:

Docker PostgreSQL

Portfolio:

Neon PostgreSQL

Production:

AWS RDS PostgreSQL

---

# 6. File Storage

Store:

- resumes
- audio files
- reports

Options:

Cloudinary

AWS S3

UploadThing

Recommendation:

Cloudinary for V1

---

# 7. Vector Storage

Use:

pgvector

Reason:

No separate vector database required.

---

# 8. Local Development Setup

Required:

Node.js

PostgreSQL

Docker

Git

VS Code

---

# 9. Docker Architecture

Containers:

frontend

↓

backend

↓

postgres

↓

redis (future)

Example:

docker-compose.yml

frontend:
3000

backend:
5000

postgres:
5432

---

# 10. Environment Variables

Frontend:

VITE_API_URL

VITE_SOCKET_URL

VITE_APP_NAME

---

Backend:

PORT

NODE_ENV

DATABASE_URL

JWT_SECRET

JWT_EXPIRES

OPENAI_API_KEY

CLOUDINARY_NAME

CLOUDINARY_KEY

CLOUDINARY_SECRET

FRONTEND_URL

---

# 11. Security Architecture

Authentication:

JWT

Password Storage:

bcrypt

Security Libraries:

helmet

cors

express-rate-limit

hpp

compression

---

# 12. Password Policy

Minimum:

8 characters

Must contain:

uppercase

lowercase

number

special character

---

# 13. API Security

Implement:

rate limiting

request validation

authentication middleware

authorization middleware

payload sanitization

input validation

---

# 14. File Upload Security

Validate:

mime type

file size

extension

virus scan (future)

Allowed:

pdf

Maximum:

10MB

---

# 15. AI Security

Never send:

passwords

tokens

secret keys

payment information

personal sensitive data

---

# 16. Logging

Log:

authentication

uploads

AI requests

interviews

evaluations

reports

errors

---

# 17. Monitoring

Track:

API latency

AI latency

database latency

error rates

token usage

interview completion rate

---

# 18. OpenAI Token Optimization

DO NOT send:

full resume repeatedly

full conversation repeatedly

Instead:

store summaries

retrieve summaries

reuse context

---

Example:

Bad:

send 20-page resume each request

Good:

send summarized profile

---

# 19. AI Cost Strategy

Use:

small model:

resume parsing

evaluation

summarization

---

Use:

large model:

question generation

follow-ups

report generation

---

# 20. Expected Cost

Development:

₹0–500/month

---

Portfolio:

₹500–1500/month

---

Small SaaS:

₹3000–10000/month

---

# 21. Caching Strategy

Cache:

resume analysis

candidate profile

question bank

reports

future:

Redis

---

# 22. Database Backup

Strategy:

daily backup

weekly snapshot

monthly archive

---

# 23. Error Recovery

If AI fails:

retry

↓

fallback prompt

↓

fallback question bank

↓

continue interview

Never crash interview.

---

# 24. Scalability Plan

V1:

Single server

↓

100 users

---

V2:

Load balanced servers

↓

1000 users

---

V3:

Microservices

↓

10000 users

---

# 25. Git Workflow

Branches:

main

develop

feature/\*

bugfix/\*

---

Example:

feature/auth

feature/resume

feature/interview

feature/report

---

# 26. Backend Development Order

1.

Authentication

---

2.

Resume Upload

---

3.

Resume Parser

---

4.

OpenAI Integration

---

5.

Interview Planner

---

6.

Question Generator

---

7.

Evaluation Engine

---

8.

Report Generator

---

9.

Analytics

---

# 27. Frontend Development Order

1.

Authentication

---

2.

Dashboard

---

3.

Resume Upload

---

4.

Interview Setup

---

5.

Interview Session

---

6.

Reports

---

7.

Analytics

---

# 28. AI Development Order

1.

Resume Parser

---

2.

Interview Planner

---

3.

Question Generator

---

4.

Follow-Up Generator

---

5.

Evaluation Engine

---

6.

Recommendation Engine

---

7.

Improvement Engine

---

# 29. Suggested Learning Order

Step 1:

Prompt Engineering

---

Step 2:

OpenAI API

---

Step 3:

Structured Outputs

---

Step 4:

Streaming

---

Step 5:

Embeddings

---

Step 6:

pgvector

---

Step 7:

RAG

---

Step 8:

LangChain JS

---

Step 9:

LangGraph

---

Step 10:

Docker

---

# 30. Estimated Timeline

Learning:

3-4 weeks

---

Backend:

2 weeks

---

AI:

2 weeks

---

Frontend:

2 weeks

---

Testing:

1 week

---

Deployment:

2 days

---

Total:

8-12 weeks

---

# 31. Portfolio Presentation

Project Title:

AI Mock Interviewer Platform

Tech Stack:

React

Node.js

Express

PostgreSQL

pgvector

LangChain

LangGraph

OpenAI

Docker

---

Resume Description:

Developed an AI-powered interview preparation platform that conducts personalized technical interviews using resume analysis, retrieval-augmented generation, and agentic workflows. Implemented adaptive questioning, follow-up generation, candidate evaluation, hiring recommendations, and analytics using LangChain, LangGraph, PostgreSQL, and OpenAI APIs.

---

# 32. Future V2 Features

Voice Interviews

Coding Interviews

Company Specific Interviews

Video Interviews

Team Interviews

Peer Comparison

Multi-Agent Interviewers

Subscription System

---

# 33. Success Criteria

The project succeeds if:

✓ Resume parsing works

✓ AI generates personalized questions

✓ Follow-up questions work

✓ Evaluation feels realistic

✓ Reports are useful

✓ Analytics show improvement

✓ User can conduct multiple interviews

✓ Recruiters understand project complexity

---

# Project Status

Product Design:
LOCKED

AI Architecture:
LOCKED

Database:
LOCKED

Backend:
LOCKED

Frontend:
LOCKED

Evaluation:
LOCKED

Infrastructure:
LOCKED

Roadmap:
LOCKED

Version:
1.0 FINAL
