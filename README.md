<p align="center">
  <a href="#">
    <img src="docs/Logo.png" alt="InterviewAI Brand Logo" width="260" />
  </a>
</p>

<h1 align="center">InterviewAI</h1>

<p align="center">
  <strong>Autonomous Multi-Agent AI Mock Interviewer & Adaptive Technical Evaluation Platform</strong><br>
  <em>Simulate high-stakes Tier-1 engineering interview loops powered by stateful AI agents, real-time voice streaming, and sandboxed code execution.</em>
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-key-features">Key Features</a> •
  <a href="#-platform-walkthrough--screenshots">Screenshots</a> •
  <a href="#-system-architecture">System Architecture</a> •
  <a href="#-langgraph-multi-agent-workflow">Agent Workflow</a> •
  <a href="#-dsa--code-execution-pipeline">Code Sandbox</a> •
  <a href="#-step-by-step-installation--setup">Quickstart</a>
</p>

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript_5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js_20+-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" /></a>
  <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express_5.x-000000?style=flat-square&logo=express&logoColor=white" alt="Express" /></a>
  <a href="https://js.langchain.com/docs/concepts/langgraph/"><img src="https://img.shields.io/badge/LangGraph-StateGraph-FF9900?style=flat-square&logo=langchain&logoColor=black" alt="LangGraph" /></a>
  <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-pgvector-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
  <a href="https://socket.io/"><img src="https://img.shields.io/badge/Socket.IO_4.8-010101?style=flat-square&logo=socketdotio&logoColor=white" alt="Socket.IO" /></a>
</p>

<div align="center">

| 🎙️ Real-Time Voice Streaming | 🧠 Stateful LangGraph Engine | 💻 Sandboxed DSA Execution | 📊 Executive Scorecard |
| :---: | :---: | :---: | :---: |
| Chunked PCM audio & Web Speech STT | Resume RAG with pgvector checkpoints | Multi-language judge & hidden tests | Hiring chance & skill analytics |

</div>

<p align="center">
  <img src="docs/home-page.png" alt="InterviewAI Platform Interface" width="98%" />
</p>

---

## 📌 Table of Contents

- [💡 Overview](#-overview)
- [🚀 Key Features](#-key-features)
- [📸 Platform Walkthrough & Screenshots](#-platform-walkthrough--screenshots)
- [🏗️ System Architecture](#-system-architecture)
- [🤖 LangGraph Multi-Agent Workflow](#-langgraph-multi-agent-workflow)
  - [State Machine Graph Structure](#state-machine-graph-structure)
  - [Detailed Node-by-Node Breakdown](#detailed-node-by-node-breakdown)
  - [State & Checkpointer Resilience](#state--checkpointer-resilience)
- [💻 DSA & Code Execution Pipeline](#-dsa--code-execution-pipeline)
  - [Execution Flowchart](#execution-flowchart)
  - [Public Test Run vs. Hidden Test Evaluation](#public-test-run-vs-hidden-test-evaluation)
  - [Human-in-the-Loop Interruption & Resumption](#human-in-the-loop-interruption--resumption)
- [🔊 Real-Time Audio & Speech Pipeline](#-real-time-audio--speech-pipeline)
- [🗃️ Frontend Caching Architecture](#-frontend-caching-architecture)
- [📊 Database Schema & DDL](#-database-schema--ddl)
- [🔑 Environment Variables](#-environment-variables)
- [🚀 Step-by-Step Installation & Setup](#-step-by-step-installation--setup)
- [🌐 API Route Endpoints](#-api-route-endpoints)
- [🤝 Contributing & License](#-contributing--license)

---

## 💡 Overview

**InterviewAI** is an autonomous, full-stack mock interview platform engineered to simulate high-stakes technical interviews. Built on **LangGraph state machines**, **PostgreSQL with pgvector**, **real-time audio streaming**, and **isolated remote code execution sandboxes**, the system delivers an adaptive, conversational practice environment modeled after Tier-1 engineering interview loops.

The agent parses candidate resumes, vectors experience chunks into a PostgreSQL vector database, synthesizes customized interview plans, conducts conversational rounds via streaming speech, evaluates DSA code against private test suites, and compiles detailed performance reports.

---

## 🚀 Key Features

- **Resume Vectorization & Personalized RAG:** Parses resume PDFs using `pdfjs-dist`, chunks sections with LangChain splitters, and embeds text into `pgvector` (1024-dimension vectors) for targeted retrieval during question generation.
- **Dynamic Multi-Round Planning:** Generates specialized interview plans (Conceptual Q&A, Architecture/System Design, and Live Coding) tailored to the target role and difficulty level.
- **Conversational Voice AI Room:** Real-time Socket.IO bidirectional stream with streaming Text-to-Speech (TTS) audio playback, Web Speech API speech-to-text, and a reactive 3D-styled animated AI Orb.
- **Monaco-Powered DSA Coding Workspace:** In-browser IDE supporting **C++ (GCC 15)**, **Python (3.14)**, **JavaScript (Node 24)**, and **Java (OpenJDK 25)** with automatic boilerplates, public test runners, and hidden test case submission.
- **Stateful LangGraph Checkpointing:** Employs `@langchain/langgraph-checkpoint-postgres` to suspend and resume sessions across network disconnections or server restarts without losing conversation state.
- **Scorecards & Longitudinal Analytics:**
  - **`/reports`**: Detailed executive scorecard, hiring recommendation (*Strong Hire*, *Hire*, *Weak Hire*, *No Hire*), question-by-question candidate transcript debrief, and algorithmic complexity scoring.
  - **`/progress`**: Long-term mastery benchmarks across *Technical Knowledge*, *Problem Solving*, *Communication*, *Code Efficiency*, and *System Design*.
  - **`/interviews`**: Searchable and filterable interview archive.
- **Deduplicated In-Memory API Store (Zustand):** Client-side caching prevents redundant network queries on navigation.

---

## 📸 Platform Walkthrough & Screenshots

### 1. Interactive Simulation Setup & Vector Processing
*Real-time resume vectorization into 1024-d pgvector embeddings with live status milestones, elapsed timer, and dynamic role-aware candidate coaching tips.*

<p align="center">
  <img src="docs/interview-ready.png" alt="Simulation Setup & Preparation Lab" width="96%" />
</p>

---

### 2. Real-Time Conversational Voice Interview Room
*Bidirectional Socket.IO voice stream, pulsing reactive 3D-styled AI Orb, live interim speech-to-text transcriptions, and instant keyboard toggle.*

<p align="center">
  <img src="docs/interview-room.png" alt="Conversational Voice Room" width="96%" />
</p>

---

### 3. Monaco-Powered In-Browser DSA Coding Workspace
*Multi-language code editor supporting C++ (GCC 15), Python (3.14), Java (OpenJDK 25), and JavaScript (Node 24). Includes public test runs and private hidden test suite validation in an isolated online judge sandbox.*

<p align="center">
  <img src="docs/code_editor.png" alt="Monaco Code Editor Workspace" width="96%" />
</p>

---

### 4. Candidate Analytics & Session Management Dashboard
*Live interview readiness metrics, performance trajectory curves, recent mock interviews history, and one-click session creation.*

<p align="center">
  <img src="docs/dashboard.png" alt="Candidate Dashboard" width="96%" />
</p>

---

### 5. Detailed Executive Performance Scorecard (`/reports`)
*Comprehensive evaluation breakdown: Executive hiring recommendation (Strong Hire, Hire, Weak Hire, No Hire), Big-O time and space complexity ratings, strengths, improvement areas, and question transcripts.*

<p align="center">
  <img src="docs/reports.png" alt="Performance Report Scorecard" width="96%" />
</p>

---

### 6. Longitudinal Competency Analytics (`/progress`)
*Long-term competency radar and category benchmarks across Technical Knowledge, Problem Solving, Communication, Code Efficiency, and System Design.*

<p align="center">
  <img src="docs/progress.png" alt="Skill Progress Analytics" width="96%" />
</p>

---

### 7. Interview Archive & Historical Audits (`/interviews`)
*Searchable and filterable record of all completed, active, and past interview sessions.*

<p align="center">
  <img src="docs/interviews.png" alt="Interview History Archive" width="96%" />
</p>

---

## 🏗️ System Architecture

```mermaid
flowchart TB
    subgraph Client["Frontend Client (React 19 + TypeScript + Vite)"]
        UI["Candidate UI (Dashboard / Room / DSA Editor / Reports)"]
        Zustand["Zustand Cache Stores (Dashboard, History, Report, Progress)"]
        Monaco["Monaco Editor (C++, Python, JS, Java)"]
        SocketClient["Socket.IO Client & Web Speech STT"]
    end

    subgraph Server["Backend Server (Node.js + Express 5)"]
        Router["Express REST API & Auth Middleware"]
        SocketServer["Socket.IO Gateway & TTS Streamer"]
        ExecuterService["Code Execution Service"]
    end

    subgraph Agents["LangGraph State Machine Engine"]
        MainGraph["Compiled StateGraph (main_graph.js)"]
        Checkpointer["PostgresSaver Checkpointer"]
        ToolNode["ToolNode (Tavily Search + Resume Vector RAG)"]
        Chains["LangChain Chains (Question Gen, Answer Eval, DSA Eval, Final Eval)"]
    end

    subgraph External["External Cloud Services"]
        LLM["OpenRouter / OpenAI (LLMs & Embeddings)"]
        TTS["OpenAI Audio / TTS Service"]
        Runner["Isolated Online Judge Sandbox"]
    end

    subgraph Database["PostgreSQL (Amazon RDS)"]
        PGVector[("pgvector: resume_embeddings")]
        Tables[("users, interviews, final_evaluations, dsa_evaluations")]
        ProblemsDB[("problems, problem_test_cases")]
        CheckpointsDB[("checkpoints, checkpoint_blobs, checkpoint_writes")]
    end

    UI --> Zustand
    UI --> Monaco
    UI --> SocketClient
    Zustand --> Router
    SocketClient <-->|WebSocket Stream| SocketServer
    Monaco --> Router

    Router --> Tables
    Router --> PGVector
    Router --> ExecuterService
    ExecuterService <-->|Run / Submit Code| Runner

    SocketServer <--> MainGraph
    SocketServer <-->|Chunked Audio| TTS
    MainGraph <--> Checkpointer
    Checkpointer <--> CheckpointsDB
    MainGraph --> ToolNode
    MainGraph --> Chains
    Chains <--> LLM
    ToolNode <--> PGVector
```

---

## 🤖 LangGraph Multi-Agent Workflow

### State Machine Graph Structure

<p align="center">
  <img src="docs/langgraph.png" alt="LangGraph Cyclic State Machine Architecture" width="90%" />
</p>

The entire interview is modeled as a cyclic state machine with persistence and human interrupts:

```mermaid
flowchart TD
    START([__start__]) --> routeInitialRound{Is Initial Round DSA?}
    
    routeInitialRound -->|Yes| dsa_round_node["dsa_round_node<br/><i>(Interrupt: Waits for Candidate Submission)</i>"]
    routeInitialRound -->|No| generate_question["generate_question<br/><i>(Resume RAG + Adaptive Synthesis)</i>"]
    
    generate_question --> routeAfterQuestion{Check Model Output}
    routeAfterQuestion -->|Tool Call Triggered| tools["tools<br/><i>(Web Search / Vector Resume Context)</i>"]
    tools --> generate_question
    routeAfterQuestion -->|Question Finalized| wait_for_answer["wait_for_answer<br/><i>(Interrupt: Waits for Candidate Voice/Text)</i>"]
    
    wait_for_answer --> evaluate_answer["evaluate_answer<br/><i>(Grades 0-10, Strengths, Feedback)</i>"]
    evaluate_answer --> advance_interview["advance_interview<br/><i>(Question & Round Counter)</i>"]
    
    advance_interview --> routeAfterAdvance{Next Interview Phase?}
    routeAfterAdvance -->|Next Question in Round| generate_question
    routeAfterAdvance -->|Next Round is DSA| dsa_round_node
    routeAfterAdvance -->|All Rounds Finished| final_evaluation["final_evaluation<br/><i>(Synthesizes Final Report & Score)</i>"]
    
    dsa_round_node -->|Resumed via Command| advance_interview
    final_evaluation --> END([__end__])
```

### Detailed Node-by-Node Breakdown

| Node Name | Node File | Purpose & Operational Logic |
| :--- | :--- | :--- |
| **`generate_question`** | [`generateQuestion.node.js`](backend/components/langgraph/nodes/generateQuestion.node.js) | Synthesizes adaptive questions based on candidate role, difficulty, and past conversation. Has tools bound to query resume chunks and web search. If the model emits tool calls, routes to `tools`; otherwise emits the question and advances to `wait_for_answer`. |
| **`tools`** | [`tools/index.js`](backend/components/langgraph/tools/index.js) | Executes external tools: `getResumeContext` (performs cosine similarity vector search on `resume_embeddings`) and `webSearch` (queries live engineering documentation via Tavily). Loops results back to `generate_question`. |
| **`wait_for_answer`** | [`waitForCandidate.js`](backend/components/langgraph/nodes/waitForCandidate.js) | Halts graph execution using LangGraph's `interrupt({ type: "wait_for_answer", ... })`. The backend suspends until the candidate submits their spoken or typed response over the socket. |
| **`evaluate_answer`** | [`evaluateAnswer.node.js`](backend/components/langgraph/nodes/evaluateAnswer.node.js) | Invokes `EvaluationAnswerChain` using structured rubrics. Assigns a score (0–10), strengths, weaknesses, and feedback. Appends the evaluation to PostgreSQL table `interview_evaluations`. |
| **`dsa_round_node`** | [`dsaRoundNode.js`](backend/components/langgraph/nodes/dsaRoundNode.js) | Reserves a DSA coding problem from `problems` table matching target difficulty. Suspends execution using `interrupt({ type: "dsa_round", problem })`. Resumes when candidate submits code or skips the problem. |
| **`advance_interview`** | [`advanceInterview.node.js`](backend/components/langgraph/nodes/advanceInterview.node.js) | Increments the question counter. If the current round is complete, advances to the next round; if all rounds are completed, sets `status = 'completed'` and routes to `final_evaluation`. |
| **`final_evaluation`** | [`finalEvaluation.node.js`](backend/components/langgraph/nodes/finalEvaluation.node.js) | Aggregates all question evaluations and DSA evaluations from the database. Prompts `finalEvaluationChain` to determine overall score (0–10), hiring chance (*Strong Hire*, *Hire*, *Weak Hire*, *No Hire*), summary, and recommendations. Saves to `final_evaluations` and marks `interviews.status = 'completed'`. |

### State & Checkpointer Resilience

Interview state is tracked via **`InterviewGraphAnnotation`** and persisted to PostgreSQL using **`PostgresSaver`** (`@langchain/langgraph-checkpoint-postgres`):
- Every interview session has a unique `thread_id` equal to the `interview.id` (UUID).
- State snapshots are persisted after every node execution in tables `checkpoints`, `checkpoint_blobs`, and `checkpoint_writes`.
- When an interrupt occurs (e.g. waiting for voice response or DSA submission), the worker process can restart or handle other traffic without losing state.
- Resuming suspended threads is executed cleanly with LangGraph commands:
  ```javascript
  const { main_graph } = require("../components/langgraph/graph/main_graph");
  const { Command } = require("@langchain/langgraph");

  await main_graph.invoke(
    new Command({ resume: { evaluation, problemId } }),
    { configurable: { thread_id: interviewId } }
  );
  ```

---

## 💻 DSA & Code Execution Pipeline

### Execution Flowchart

```mermaid
sequenceDiagram
    autonumber
    actor Candidate
    participant Workspace as React Monaco Editor (/interview/dsa)
    participant API as Express API (/api/execute-code)
    participant DB as PostgreSQL
    participant Runner as Isolated Compiler Sandbox
    participant Graph as LangGraph Engine (main_graph)

    Note over Candidate,Graph: Candidate enters DSA Coding Round
    Graph-->>API: interrupt({ type: "dsa_round", problem })
    API-->>Workspace: socket.emit("interview:dsa_round", { problem, ... })

    alt Candidate Clicks "Run Code"
        Candidate->>Workspace: Clicks "Run Code" (or Ctrl + Enter)
        Workspace->>API: POST /api/execute-code/run-code
        API->>Runner: Execute against sample public tests
        Runner-->>API: Returns stdout / stderr / test status
        API-->>Workspace: 200 OK (Displays output in Test Results panel)
    else Candidate Clicks "Submit Solution"
        Candidate->>Workspace: Clicks "Submit Solution"
        Workspace->>API: POST /api/execute-code/submit-code
        API->>DB: Fetch hidden test cases from problem_test_cases
        API->>Runner: Execute code against hidden test suite
        Runner-->>API: Execution verdict (passes, runtime, memory)
        API->>API: Prompt dsaEvaluationChain with code + judge verdict
        API->>DB: Save result to dsa_evaluations
        API->>Graph: main_graph.invoke(new Command({ resume: ... }), { thread_id })
        Graph-->>API: Advances interview / fetches next question
        API-->>Workspace: 200 OK (Submission Summary + enables "Next Question")
    else Candidate Clicks "Skip Problem"
        Candidate->>Workspace: Clicks "Skip Problem"
        Workspace->>API: POST /api/execute-code/skip
        API->>DB: Record zero evaluation in dsa_evaluations
        API->>Graph: main_graph.invoke(new Command({ resume: skipEvaluation }))
        Graph-->>API: Advances interview
        API-->>Workspace: 200 OK (Navigates to next question or round)
    end
```

### Public Test Run vs. Hidden Test Evaluation

1. **Run Code (`POST /api/execute-code/run-code`)**:
   - Takes `code`, `language`, `problemId`, and the visible test cases from the client.
   - Dispatches payload to the online compiler sandbox.
   - Returns structured test execution cards showing **Input**, **Expected Output**, **Actual Output**, and execution status (**Passed** / **Failed** / **Error**).
2. **Submit Code (`POST /api/execute-code/submit-code`)**:
   - Fetches up to 8 private test cases from `problem_test_cases` (ordered by `visibility = 'hidden'`).
   - Runs code inside the compiler sandbox with strict execution limits (2.0s time limit, tokens checker).
   - Injects both source code and judge outputs into `dsaEvaluationChain`.
   - Returns full evaluation summary and unlocks progression to the next question or round.

---

## 🔊 Real-Time Audio & Speech Pipeline

1. **Question Audio Streaming**:
   - When `generate_question` emits a text question, [`streamQuestionAudio`](backend/services/tts/tts.service.js) contacts the OpenAI/OpenRouter TTS endpoint.
   - The resulting PCM audio stream is chunked and broadcast over Socket.IO:
     - `interview:audio:start`: Informs client of chunk encoding and sample rate.
     - `interview:audio:chunk`: Array buffer chunk containing audio bytes.
     - `interview:audio:end`: Concludes playback stream.
     - `interview:audio:error`: Fallback to client browser synthesis if TTS fails.
2. **Candidate Voice Input (Web Speech API)**:
   - When candidate speaks, the browser's native `SpeechRecognition` records speech.
   - Real-time interim transcript displays inside the candidate response area.
   - Candidate can seamlessly switch to text editing mode to refine answers before submission.

---

## 🗃️ Frontend Caching Architecture

To prevent redundant API requests when candidates navigate between pages, dedicated in-memory Zustand stores cache responses with automatic time-to-live invalidation:

| Store Name | File Path | Cached Data | Stale Time | Invalidation Triggers |
| :--- | :--- | :--- | :--- | :--- |
| **`useDashboardStore`** | [`dashboard.store.ts`](frontend/src/store/dashboard.store.ts) | Dashboard overview statistics, recent sessions, and readiness indicators | 2 Minutes | `interview:completed`, starting a new interview, or user logout |
| **`useInterviewHistoryStore`** | [`interviewHistory.store.ts`](frontend/src/store/interviewHistory.store.ts) | Complete interview archive, outcome pills, and session timestamps | 2 Minutes | Finishing or creating an interview |
| **`useReportStore`** | [`report.store.ts`](frontend/src/store/report.store.ts) | Detailed scorecards indexed by `reportsById[interviewId]` | 5 Minutes | Cached by ID so switching between report tabs is instantaneous |
| **`useProgressStore`** | [`progress.store.ts`](frontend/src/store/progress.store.ts) | Longitudinal competency ratings and trajectory charts | 2 Minutes | `interview:completed` or user logout |

---

## 📊 Database Schema & DDL

Execute the following script in PostgreSQL to create the complete schema:

```sql
-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    otp TEXT,
    otp_expires_at TIMESTAMPTZ,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Candidate Resumes Table
CREATE TABLE IF NOT EXISTS public.candidate_resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    summary TEXT,
    skills TEXT[] DEFAULT '{}'::TEXT[],
    education TEXT[] DEFAULT '{}'::TEXT[],
    experience TEXT[] DEFAULT '{}'::TEXT[],
    projects TEXT[] DEFAULT '{}'::TEXT[],
    achievements TEXT,
    resume_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Resume Embeddings Table (pgvector)
CREATE TABLE IF NOT EXISTS public.resume_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL REFERENCES public.candidate_resumes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding VECTOR(1024) NOT NULL,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Interviews Table
CREATE TYPE interview_status AS ENUM ('planning', 'active', 'paused', 'completed', 'failed');

CREATE TABLE IF NOT EXISTS public.interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    resume_id UUID NOT NULL REFERENCES public.candidate_resumes(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    status interview_status NOT NULL DEFAULT 'planning',
    current_round INT NOT NULL DEFAULT 1,
    current_question INT NOT NULL DEFAULT 1,
    interview_plan JSONB NOT NULL,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Interview Evaluations Table (Conceptual Q&A)
CREATE TABLE IF NOT EXISTS public.interview_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id UUID NOT NULL UNIQUE REFERENCES public.interviews(id) ON DELETE CASCADE,
    evaluations JSONB NOT NULL DEFAULT '[]'::JSONB,
    overall_score NUMERIC(4,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Problems Table (DSA Challenges)
CREATE TABLE IF NOT EXISTS public.problems (
    id BIGSERIAL PRIMARY KEY,
    source TEXT,
    source_problem_id TEXT,
    slug TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    topics TEXT[],
    source_metadata JSONB,
    source_payload JSONB,
    canonical_tests_source TEXT,
    public_tests_source JSONB,
    import_status TEXT DEFAULT 'ready',
    import_error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Problem Test Cases Table (Hidden Test Suite)
CREATE TABLE IF NOT EXISTS public.problem_test_cases (
    id BIGSERIAL PRIMARY KEY,
    problem_id BIGINT NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
    test_number INT NOT NULL,
    test_source TEXT,
    visibility TEXT DEFAULT 'hidden',
    execution_format TEXT DEFAULT 'function_call',
    input_data JSONB,
    expected_output JSONB,
    stdin_input TEXT,
    expected_stdout TEXT,
    comparison_mode TEXT DEFAULT 'exact',
    comparison_config JSONB,
    source_test TEXT,
    validation_status TEXT DEFAULT 'pending',
    validation_error TEXT,
    validated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. DSA Evaluations Table
CREATE TABLE IF NOT EXISTS public.dsa_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id UUID NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
    problem_id BIGINT NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
    score INT NOT NULL CHECK (score BETWEEN 0 AND 10),
    correctness TEXT NOT NULL,
    time_complexity TEXT NOT NULL,
    space_complexity TEXT NOT NULL,
    strengths JSONB NOT NULL DEFAULT '[]'::JSONB,
    weaknesses JSONB NOT NULL DEFAULT '[]'::JSONB,
    feedback TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Final Evaluations Table (Executive Scorecard)
CREATE TABLE IF NOT EXISTS public.final_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id UUID NOT NULL UNIQUE REFERENCES public.interviews(id) ON DELETE CASCADE,
    overall_score NUMERIC(4,2) NOT NULL CHECK (overall_score BETWEEN 0 AND 10),
    hire_chance VARCHAR(20) NOT NULL CHECK (hire_chance IN ('Strong Hire', 'Hire', 'Weak Hire', 'No Hire')),
    summary TEXT NOT NULL,
    strengths JSONB NOT NULL DEFAULT '[]'::JSONB,
    weaknesses JSONB NOT NULL DEFAULT '[]'::JSONB,
    recommendations JSONB NOT NULL DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Indexes for Query Performance
CREATE INDEX IF NOT EXISTS idx_candidate_resumes_user_id ON public.candidate_resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_embeddings_resume_id ON public.resume_embeddings(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_embeddings_user_id ON public.resume_embeddings(user_id);
CREATE INDEX IF NOT EXISTS idx_interviews_user_created ON public.interviews(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON public.interviews(status);
CREATE INDEX IF NOT EXISTS idx_problem_test_cases_problem_id ON public.problem_test_cases(problem_id);
```

---

## 🔑 Environment Variables

### Backend Configuration (`backend/.env`)

```env
# Server
PORT=3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# Database Connection
DATABASE_URL=postgresql://postgres:password@localhost:5432/interviewai_db
PGSSL=false
PGSSL_REJECT_UNAUTHORIZED=false

# LangGraph Persistence Checkpointer (postgres or memory)
LANGGRAPH_CHECKPOINTER=postgres

# Authentication & JWT
JWT_SECRET_KEY=super_secure_jwt_secret_key_minimum_32_characters
JWT_EXPIRES_IN=7d
EMAIL_USER=your_smtp_sender_email@gmail.com
BREVO_API_KEY=your_brevo_smtp_api_key

# OpenRouter / OpenAI LLM APIs
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=deepseek/deepseek-chat
EMBEDDING_MODEL=text-embedding-3-small

# Live Engineering Web Search
TAVILY_API_KEY=your_tavily_api_key

# Spoken Question TTS Streaming
TTS_MODEL=tts-1
TTS_VOICE=alloy
TTS_RESPONSE_FORMAT=pcm
TTS_SAMPLE_RATE=24000
TTS_CHANNELS=1
OPENROUTER_TTS_URL=https://api.openai.com/v1/audio/speech

# Isolated Remote Code Execution Sandbox
ONLINE_COMPILER_API_KEY=your_compiler_sandbox_api_key
ONLINE_COMPILER_BASE_URL=https://your-compiler-sandbox-url.com
```

### Frontend Configuration (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
VITE_APP_BASE_URL=http://localhost:5173
PROD=false
DEV=true
```

---

## 🚀 Step-by-Step Installation & Setup

### 1. Prerequisites Check
Ensure your environment has:
- **Node.js** `v20.x` or higher (`node -v`)
- **PostgreSQL** `v15.x` or higher with `pgvector` installed (`psql -c "CREATE EXTENSION vector;"`)

### 2. Clone Repository
```bash
git clone https://github.com/arnavbhure/ai-mock-interviewer.git
cd ai-mock-interviewer
```

### 3. Database Initialization
Connect to your local or hosted PostgreSQL instance and execute the schema DDL:
```bash
psql -U postgres -d your_database_name -f docs/Database\ Schema\ \ \(Ai\ mock\ interviewer\).md
```
*(Or paste the DDL block provided in the [Database Schema](#-database-schema--ddl) section).*

### 4. Backend Setup & Startup
```bash
cd backend
npm install

# Verify database connection
node -e "require('./config/db').pool.query('SELECT NOW()').then(r => console.log('DB Connected:', r.rows[0])).catch(console.error)"

# Start server (automatically runs startCheckpointer and binds Socket.IO)
npm start

# For hot-reload development:
npm test
```
*Health check verify: navigate to `http://localhost:3000/ping` (should return `ok`).*

### 5. Frontend Setup & Startup
```bash
cd ../frontend
npm install

# Build check
npm run build

# Start Vite client development server
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🌐 API Route Endpoints

| Category | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/signup` | Register new user account |
| | `POST` | `/api/auth/login` | Authenticate user & issue httpOnly cookie |
| | `POST` | `/api/auth/verify-otp` | Verify 6-digit email OTP |
| | `GET` | `/api/auth/me` | Retrieve authenticated user profile |
| | `POST` | `/api/auth/logout` | Clear session cookie |
| **Resume** | `POST` | `/api/resume/upload-resume` | Upload PDF, extract text, and write vector embeddings |
| **Interview** | `POST` | `/api/interview/create-interview` | Synthesize multi-round interview plan & save session |
| | `GET` | `/api/interview/history` | Fetch complete candidate interview history |
| **Code Runner** | `POST` | `/api/execute-code/run-code` | Execute code against sample test cases |
| | `POST` | `/api/execute-code/submit-code` | Run hidden test cases, grade with LLM & resume LangGraph |
| | `POST` | `/api/execute-code/skip` | Skip current coding problem & advance LangGraph |
| **Analytics** | `GET` | `/api/dashboard` | Fetch overview metrics & recent interview rows |
| | `GET` | `/api/reports` | Fetch detailed evaluation scorecard for an interview |
| | `GET` | `/api/progress` | Fetch skill mastery breakdown & performance growth curve |

---

## 🤝 Contributing & License

1. Fork the Project repository.
2. Create your Feature Branch (`git checkout -b feature/NewFeature`).
3. Commit your Changes (`git commit -m 'feat: Add NewFeature'`).
4. Push to the Branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

Distributed under the **ISC License**.
