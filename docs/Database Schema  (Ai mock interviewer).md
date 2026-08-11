## Database Schema : (Ai mock interviewer)

# users table :

CREATE TABLE IF NOT EXISTS public.users ( id uuid NOT NULL DEFAULT gen_random_uuid(), name text COLLATE pg_catalog."default" NOT NULL, email text COLLATE pg_catalog."default" NOT NULL, otp text COLLATE pg_catalog."default", otp_expires_at timestamp with time zone, is_verified boolean DEFAULT false, created_at timestamp with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now(), CONSTRAINT users_pkey PRIMARY KEY (id), CONSTRAINT users_email_key UNIQUE (email) );

# candidate_resume :

CREATE TABLE IF NOT EXISTS public.candidate_resumes ( id uuid NOT NULL DEFAULT gen_random_uuid(), user_id uuid NOT NULL, full_name text COLLATE pg_catalog."default", phone text COLLATE pg_catalog."default", summary text COLLATE pg_catalog."default", skills text[] COLLATE pg_catalog."default" DEFAULT '{}'::text[], education text[] COLLATE pg_catalog."default" DEFAULT '{}'::text[], experience text[] COLLATE pg_catalog."default" DEFAULT '{}'::text[], projects text[] COLLATE pg_catalog."default" DEFAULT '{}'::text[], achievements text COLLATE pg_catalog."default", created_at timestamp with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now(), CONSTRAINT candidate_resumes_pkey PRIMARY KEY (id), CONSTRAINT candidate_resumes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE ); 

# resume_embeddings : 

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS public.resume_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    resume_id UUID NOT NULL
        REFERENCES public.candidate_resumes(id)
        ON DELETE CASCADE,

    user_id UUID NOT NULL
        REFERENCES public.users(id)
        ON DELETE CASCADE,

    chunk_index INT NOT NULL,

    chunk_text TEXT NOT NULL,

    embedding VECTOR(1024) NOT NULL,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW()
);


# interviews :

CREATE TABLE IF NOT EXISTS public.interviews
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),

    user_id uuid NOT NULL,

    resume_id uuid NOT NULL,

    role text NOT NULL,

    difficulty text NOT NULL,

    status interview_status NOT NULL DEFAULT 'planning',

    current_round integer NOT NULL DEFAULT 1,

    current_question integer NOT NULL DEFAULT 1,

    interview_plan jsonb NOT NULL,

    started_at timestamp with time zone,

    completed_at timestamp with time zone,

    created_at timestamp with time zone DEFAULT now(),

    updated_at timestamp with time zone DEFAULT now(),

    CONSTRAINT interviews_pkey
        PRIMARY KEY (id),

    CONSTRAINT interviews_resume_id_fkey
        FOREIGN KEY (resume_id)
        REFERENCES public.candidate_resumes (id)
        ON DELETE CASCADE,

    CONSTRAINT interviews_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES public.users (id)
        ON DELETE CASCADE
);

# Indexes: 

CREATE INDEX idx_candidate_resumes_user_id
ON candidate_resumes(user_id);

CREATE INDEX idx_resume_embeddings_resume_id
ON public.resume_embeddings(resume_id);

CREATE INDEX idx_resume_embeddings_resume_chunk
ON public.resume_embeddings(resume_id, chunk_index);

CREATE INDEX idx_resume_embeddings_user_id
ON public.resume_embeddings(user_id);

CREATE INDEX idx_interviews_user_id
ON public.interviews(user_id);

CREATE INDEX idx_interviews_resume_id
ON public.interviews(resume_id);

CREATE INDEX idx_interviews_status
ON public.interviews(status);