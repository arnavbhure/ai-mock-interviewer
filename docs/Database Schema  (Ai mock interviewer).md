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

# Indexes: 

CREATE INDEX idx_candidate_resumes_user_id
ON candidate_resumes(user_id);

CREATE INDEX idx_resume_embeddings_resume_id
ON public.resume_embeddings(resume_id);

CREATE INDEX idx_resume_embeddings_resume_chunk
ON public.resume_embeddings(resume_id, chunk_index);

CREATE INDEX idx_resume_embeddings_user_id
ON public.resume_embeddings(user_id);