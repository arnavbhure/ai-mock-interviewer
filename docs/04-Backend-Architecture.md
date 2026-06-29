# AI Mock Interviewer Platform

# PRD Part 4

# Backend Architecture, API Design, and Project Structure

Version: 1.0
Status: Locked

---

# 1. Backend Philosophy

The backend is not a traditional CRUD API.

The backend acts as:

- Authentication Server
- Resume Processing Service
- AI Orchestrator
- Interview State Manager
- Evaluation Engine
- Report Generator
- Analytics Provider

The backend is responsible for maintaining the entire interview lifecycle.

---

# 2. Technology Stack

Runtime:
Node.js

Framework:
Express.js

Language:
JavaScript

Database:
PostgreSQL

Vector Database:
pgvector

Authentication:
JWT

File Upload:
Multer

AI Framework:
LangChain JS

Workflow Engine:
LangGraph

Real-time Communication:
Socket.IO

Validation:
Zod

ORM:
Prisma

Caching:
Redis (future)

---

# 3. High-Level Backend Architecture

```
            React Frontend
                    |
                    |
               API Gateway
                    |
     ---------------------------------
     |               |              |
     |               |              |
Auth Service    Resume Service   Interview Service
                                     |
                                     |
                              LangGraph Engine
                                     |
                     --------------------------------
                     |              |               |
                     |              |               |
               OpenAI        Vector Search      Evaluation
                                     |
                                     |
                                PostgreSQL
```

---

# 4. Project Folder Structure

backend/

├── src/
│
├── config/
│ ├── db.js
│ ├── openai.js
│ ├── socket.js
│ ├── redis.js
│
├── routes/
│ ├── auth.routes.js
│ ├── user.routes.js
│ ├── resume.routes.js
│ ├── interview.routes.js
│ ├── report.routes.js
│
├── controllers/
│ ├── auth.controller.js
│ ├── user.controller.js
│ ├── resume.controller.js
│ ├── interview.controller.js
│ ├── report.controller.js
│
├── services/
│ ├── auth.service.js
│ ├── resume.service.js
│ ├── interview.service.js
│ ├── evaluation.service.js
│ ├── report.service.js
│
├── ai/
│ ├── prompts/
│ ├── chains/
│ ├── agents/
│ ├── graphs/
│ ├── evaluators/
│
├── repositories/
│ ├── user.repository.js
│ ├── interview.repository.js
│ ├── report.repository.js
│
├── middleware/
│ ├── auth.middleware.js
│ ├── error.middleware.js
│ ├── upload.middleware.js
│
├── validators/
│ ├── auth.validator.js
│ ├── interview.validator.js
│
├── utils/
│ ├── parser.js
│ ├── logger.js
│ ├── embeddings.js
│
├── sockets/
│ ├── interview.socket.js
│
├── prisma/
│ └── schema.prisma
│
└── app.js

---

# 5. Authentication Module

Responsibilities:

- registration
- login
- refresh tokens
- password reset
- logout
- authorization

JWT Payload:

{
"id":"",
"email":"",
"role":"user"
}

Authentication Middleware:

verifyToken()
↓
decodeJWT()
↓
attachUser()
↓
next()

---

# 6. Resume Service

Responsibilities:

- upload resume
- validate file
- extract text
- parse content
- generate embeddings
- build candidate profile

Pipeline:

Upload PDF
↓
Store File
↓
Extract Text
↓
AI Parsing
↓
Create Candidate Profile
↓
Generate Embeddings
↓
Save Database

---

# 7. Resume Parsing Pipeline

Input:

resume.pdf

Step 1:
Extract raw text

Step 2:
Clean text

Step 3:
Send to AI parser

Step 4:
Generate structured JSON

Example:

{
"skills":[],
"projects":[],
"experience":"",
"education":[]
}

---

# 8. Interview Service

Responsibilities:

- create interview
- create interview plan
- manage state
- generate questions
- generate follow-ups
- evaluate answers
- progress rounds

Methods:

createInterview()

startInterview()

getNextQuestion()

submitAnswer()

evaluateAnswer()

generateReport()

endInterview()

---

# 9. LangGraph Workflow Service

Responsibilities:

- interview orchestration
- state management
- conditional routing
- recovery

Workflow:

START
↓
Analyze Resume
↓
Create Interview Plan
↓
Greeting
↓
Project Round
↓
Technical Round
↓
DSA/System Design
↓
Behavioral Round
↓
Evaluation
↓
Report
↓
END

---

# 10. Prompt Service

Folder:

ai/prompts

Files:

resume.prompt.js

planner.prompt.js

greeting.prompt.js

project.prompt.js

technical.prompt.js

dsa.prompt.js

behavioral.prompt.js

evaluation.prompt.js

report.prompt.js

improvement.prompt.js

Purpose:

Separate prompts from business logic.

---

# 11. Question Generation Service

Input:

candidate profile

- difficulty
- round

Output:

{
"question":"",
"difficulty":"",
"expected_topics":[]
}

Example:

Question:
Explain React reconciliation.

Expected Topics:

- Virtual DOM
- Diffing
- Re-rendering

---

# 12. Follow-Up Engine

Input:

question
answer
evaluation

Decision:

Good Answer
↓
Harder Follow-up

Weak Answer
↓
Clarification Question

Example:

Question:
Explain JWT.

Answer:
JWT stores sessions.

Follow-up:
Why is JWT considered stateless?

---

# 13. Evaluation Service

Input:

question
answer
difficulty
round
candidate profile

Output:

{
"technical":8,
"communication":7,
"confidence":6,
"depth":8,
"feedback":"..."
}

---

# 14. Recommendation Service

Input:

all evaluations

Output:

Strong Hire

Hire

Borderline

Weak Hire

No Hire

---

# 15. Improvement Service

Input:

interview history

Output:

{
"strengths":[],
"weaknesses":[],
"learning_plan":[]
}

Example:

Strengths:

- React
- APIs

Weaknesses:

- Docker
- Redis
- Graphs

---

# 16. Report Generation Service

Input:

all interview data

Output:

{
"overall_score":82,
"recommendation":"Hire",
"summary":"",
"strengths":[],
"weaknesses":[],
"roadmap":[]
}

---

# 17. Socket.IO Layer

Purpose:

Real-time interview experience.

Events:

interview:start

question:generated

answer:submitted

answer:evaluated

round:completed

report:generated

interview:end

---

# 18. API Design

Base URL:

/api/v1

---

Authentication

POST /auth/register

POST /auth/login

POST /auth/logout

POST /auth/forgot-password

POST /auth/reset-password

GET /auth/me

---

Resume

POST /resume/upload

GET /resume/:id

DELETE /resume/:id

---

Interview

POST /interview/start

GET /interview/:id

POST /interview/:id/answer

GET /interview/:id/question

POST /interview/:id/end

---

Reports

GET /reports

GET /reports/:id

GET /reports/:id/improvements

---

Analytics

GET /analytics/overview

GET /analytics/progress

GET /analytics/strengths

GET /analytics/weaknesses

---

# 19. Error Handling

Global Error Middleware

Types:

AuthenticationError

ValidationError

AIServiceError

DatabaseError

ResumeParsingError

InterviewError

Example:

{
"success":false,
"message":"Resume parsing failed"
}

---

# 20. Logging

Log:

- API requests
- AI calls
- token usage
- errors
- interview events
- report generation

---

# 21. Cost Optimization

Never send:

- full resume
- full interview history

Instead:

store summaries

retrieve summaries

send only relevant context

---

# 22. Security

Implement:

- bcrypt password hashing
- JWT authentication
- rate limiting
- helmet
- CORS
- request validation
- file validation
- SQL injection protection

---

# 23. Scalability Strategy

Current:

Single server

Future:

Load Balancer
↓
API Servers
↓
Redis
↓
PostgreSQL
↓
AI Workers

---

# Backend Architecture Status

✓ Folder structure finalized

✓ Service layer finalized

✓ API contracts finalized

✓ AI orchestration finalized

✓ Real-time layer finalized

✓ Security strategy finalized

✓ Scaling strategy finalized
