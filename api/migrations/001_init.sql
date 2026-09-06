-- Run this once against your Supabase Postgres database
-- (Supabase dashboard -> SQL Editor -> paste and run)

create extension if not exists pgcrypto;

create table if not exists admins (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    role text not null default 'admin',              -- 'god' or 'admin'
    password_hash text,                                -- null until onboarding is completed
    security_question_1 text,
    security_answer_1_hash text,
    security_question_2 text,
    security_answer_2_hash text,
    otp_hash text,
    otp_expires_at timestamptz,
    otp_used boolean not null default false,
    is_active boolean not null default true,
    created_by uuid references admins(id),
    created_at timestamptz not null default now()
);

create table if not exists houses (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    tagline text,
    description text,
    tags text[] default '{}',
    accent_from text default '#4a8fe8',
    accent_to text default '#8b3ce8',
    sort_order int default 0,
    created_by uuid references admins(id),
    created_at timestamptz not null default now()
);

create table if not exists credibility (
    id uuid primary key default gen_random_uuid(),
    person_name text not null,
    company text,
    service_rendered text,
    remark_text text,
    remark_image_url text,
    photo_url text,
    sort_order int default 0,
    created_by uuid references admins(id),
    created_at timestamptz not null default now()
);

create table if not exists faces (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    role text,
    house_id uuid references houses(id) on delete set null,
    photo_url text,
    sort_order int default 0,
    created_by uuid references admins(id),
    created_at timestamptz not null default now()
);
