# AI Mock Interviewer Platform

# PRD Part 3

# Database Architecture and Schema Design

Version: 1.0
Status: Locked

---

# 1. Database Technology

Primary Database:
PostgreSQL

Vector Database:
pgvector

Reasons:

- ACID compliance
- relational data support
- vector search support
- scalability
- JSON support
- excellent indexing

---

# 2. Database Overview

Tables:

users

↓

resumes

↓

candidate_profiles

↓

interviews

↓

interview_rounds

↓

questions

↓

answers

↓

evaluations

↓

reports

↓

improvement_plans

↓

embeddings

---

# 3. Users Table

Purpose:

Store platform users.

Table:

users

Columns:

id UUID PK

full_name VARCHAR(100)

email VARCHAR(255) UNIQUE

password_hash TEXT

profile_image TEXT

email_verified BOOLEAN

verification_token TEXT

reset_token TEXT

reset_token_expiry TIMESTAMP

last_login TIMESTAMP

created_at TIMESTAMP

updated_at TIMESTAMP

Indexes:

email

---

# 4. Resumes Table

Purpose:

Store uploaded resumes.

Table:

resumes

Columns:

id UUID PK

user_id UUID FK

file_name TEXT

file_url TEXT

file_size INTEGER

mime_type TEXT

raw_text TEXT

parsed BOOLEAN

uploaded_at TIMESTAMP

Indexes:

user_id

---

# 5. Candidate Profiles Table

Purpose:

Store AI-generated candidate profile.

Table:

candidate_profiles

Columns:

id UUID PK

user_id UUID FK

resume_id UUID FK

target_role VARCHAR

experience_level VARCHAR

skills JSONB

projects JSONB

certifications JSONB

education JSONB

strengths JSONB

weaknesses JSONB

created_at TIMESTAMP

Example:

{
"skills":[
"React",
"Node",
"PostgreSQL"
]
}

---

# 6. Interviews Table

Purpose:

Store interview sessions.

Table:

interviews

Columns:

id UUID PK

user_id UUID FK

candidate_profile_id UUID FK

role VARCHAR

experience VARCHAR

difficulty VARCHAR

status VARCHAR

started_at TIMESTAMP

completed_at TIMESTAMP

duration INTEGER

overall_score DECIMAL

recommendation VARCHAR

Indexes:

user_id

status

created_at

---

# 7. Interview Rounds Table

Purpose:

Store rounds.

Table:

interview_rounds

Columns:

id UUID PK

interview_id UUID FK

round_name VARCHAR

round_order INTEGER

status VARCHAR

started_at TIMESTAMP

completed_at TIMESTAMP

score DECIMAL

Example:

Resume Discussion

Technical

DSA

Behavioral

---

# 8. Questions Table

Purpose:

Store generated questions.

Table:

questions

Columns:

id UUID PK

interview_round_id UUID FK

question_text TEXT

question_type VARCHAR

difficulty VARCHAR

source VARCHAR

follow_up BOOLEAN

created_at TIMESTAMP

Examples:

question_type:

technical

behavioral

project

dsa

system_design

---

# 9. Answers Table

Purpose:

Store candidate answers.

Table:

answers

Columns:

id UUID PK

question_id UUID FK

answer_text TEXT

audio_url TEXT

answer_duration INTEGER

submitted_at TIMESTAMP

---

# 10. Evaluations Table

Purpose:

Store AI evaluations.

Table:

evaluations

Columns:

id UUID PK

answer_id UUID FK

technical_score DECIMAL

communication_score DECIMAL

confidence_score DECIMAL

problem_solving_score DECIMAL

depth_score DECIMAL

project_score DECIMAL

behavior_score DECIMAL

feedback TEXT

strengths JSONB

weaknesses JSONB

created_at TIMESTAMP

---

# 11. Reports Table

Purpose:

Store final reports.

Table:

reports

Columns:

id UUID PK

interview_id UUID FK

overall_score DECIMAL

technical_score DECIMAL

communication_score DECIMAL

problem_solving_score DECIMAL

behavior_score DECIMAL

project_score DECIMAL

recommendation VARCHAR

summary TEXT

generated_at TIMESTAMP

---

# 12. Improvement Plans Table

Purpose:

Store improvement roadmap.

Table:

improvement_plans

Columns:

id UUID PK

report_id UUID FK

strong_areas JSONB

weak_areas JSONB

learning_plan JSONB

estimated_duration VARCHAR

Example:

{
"week1":"Redis",
"week2":"Docker",
"week3":"Graphs"
}

---

# 13. Interview History Table

Purpose:

Track progress.

Table:

interview_history

Columns:

id UUID PK

user_id UUID FK

interview_id UUID FK

score DECIMAL

recommendation VARCHAR

completed_at TIMESTAMP

---

# 14. Embeddings Table

Purpose:

Store vector embeddings.

Table:

embeddings

Columns:

id UUID PK

entity_type VARCHAR

entity_id UUID

embedding VECTOR(1536)

created_at TIMESTAMP

Entity Types:

resume

question

answer

report

skill

project

Indexes:

HNSW index

---

# 15. Resume Embeddings

Store embeddings for:

skills

projects

experience

education

certifications

Example:

React Developer Resume

↓

1536 dimension vector

---

# 16. Question Embeddings

Store embeddings for:

technical questions

behavioral questions

DSA questions

project questions

Purpose:

semantic retrieval

---

# 17. Answer Embeddings

Store:

candidate answers

Purpose:

future analysis

Example:

Strong React answers

Weak DSA answers

---

# 18. Report Embeddings

Store:

previous reports

Purpose:

generate personalized improvement plans

---

# 19. Audit Logs Table

Purpose:

track user activity

Table:

audit_logs

Columns:

id UUID PK

user_id UUID FK

action VARCHAR

metadata JSONB

created_at TIMESTAMP

Examples:

LOGIN

UPLOAD_RESUME

START_INTERVIEW

END_INTERVIEW

GENERATE_REPORT

---

# 20. Future Tables (Not V1)

company_profiles

coding_rounds

voice_sessions

subscriptions

payments

notifications

teams

organizations

---

# 21. Database Relationships

users

↓

resumes

↓

candidate_profiles

↓

interviews

↓

interview_rounds

↓

questions

↓

answers

↓

evaluations

↓

reports

↓

improvement_plans

---

# 22. Database Principles

Rules:

- Never delete interviews.
- Never delete reports.
- Never overwrite evaluations.
- Store every answer.
- Store every score.
- Store every recommendation.
- Store timestamps everywhere.

Reason:

Interview history is the product.

---

# 23. Estimated Database Growth

1000 users

↓

10000 interviews

↓

250000 questions

↓

250000 answers

↓

250000 evaluations

↓

10000 reports

PostgreSQL can easily handle this scale.

---

# Database Architecture Status

✓ Relational schema finalized

✓ Vector schema finalized

✓ Embedding strategy finalized

✓ History tracking finalized

✓ Analytics support finalized
