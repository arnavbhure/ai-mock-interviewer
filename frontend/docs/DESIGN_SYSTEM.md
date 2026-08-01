# InterviewAI Design System

Version: 1.0

---

# Overview

InterviewAI is a premium AI-powered mock interview platform.

The design language should communicate:

- Professionalism
- Intelligence
- Trust
- Simplicity
- Modern SaaS
- Enterprise Quality

The UI should feel as if it was designed by the teams behind Linear, OpenAI, Vercel, and Notion.

Avoid flashy startup aesthetics.

Never use cyberpunk visuals, glowing neon effects, excessive gradients, or glassmorphism-heavy interfaces.

---

# Design Principles

Every screen must follow these principles.

1. Minimal but not empty.
2. High readability.
3. Plenty of whitespace.
4. Motion should communicate state, never decoration.
5. Components should be reusable.
6. Accessibility comes first.
7. Mobile-first responsive layouts.
8. Pixel-perfect spacing.
9. Fast perceived performance.
10. Consistent visual hierarchy.

---

# Brand Personality

Professional

Modern

Confident

Minimal

Technical

Calm

Premium

Reliable

Intelligent

---

# Color Palette

The InterviewAI design system uses **semantic color tokens** rather than hardcoded colors. Every component should consume semantic tokens so Light and Dark mode can be switched without changing component code.

---

# Brand Colors

The brand color remains identical across both Light and Dark themes.

Primary 50 #EEF4FF
Primary 100 #DCE8FF
Primary 200 #BDD2FF
Primary 300 #94B7FF
Primary 400 #6D99FF
Primary 500 #4F7CFF
Primary 600 #3B68F2
Primary 700 #2F53D6
Primary 800 #2642A8
Primary 900 #1B2F78

Primary Default

#4F7CFF

Use the primary color only for:

- Primary Buttons
- Active Navigation
- Focus States
- Links
- Progress Indicators
- Charts
- Interactive Elements

Never overuse the brand color.

---

# Light Theme

## Background

Background

#F8FAFC

Secondary Background

#F1F5F9

Surface

#FFFFFF

Elevated Surface

#FFFFFF

Hover Surface

#F8FAFC

---

## Text

Primary

#0F172A

Secondary

#334155

Muted

#64748B

Disabled

#94A3B8

Inverse

#FFFFFF

---

## Border

Default

#E2E8F0

Subtle

#F1F5F9

Hover

#CBD5E1

Focus

#4F7CFF

---

# Dark Theme

## Background

Background

#0F172A

Secondary Background

#162033

Surface

#1E293B

Elevated Surface

#273449

Hover Surface

#334155

---

## Text

Primary

#F8FAFC

Secondary

#CBD5E1

Muted

#94A3B8

Disabled

#64748B

Inverse

#0F172A

---

## Border

Default

#334155

Subtle

#273449

Hover

#475569

Focus

#4F7CFF

---

# Semantic Colors

## Success

50 #ECFDF5
100 #D1FAE5
500 #22C55E
600 #16A34A

---

## Warning

50 #FFFBEB
100 #FEF3C7
500 #F59E0B
600 #D97706

---

## Error

50 #FEF2F2
100 #FEE2E2
500 #EF4444
600 #DC2626

---

## Info

50 #EFF6FF
100 #DBEAFE
500 #3B82F6
600 #2563EB

---

# Gradients

Use gradients sparingly.

Primary Gradient

linear-gradient(
135deg,
#4F7CFF 0%,
#6D99FF 100%
)

Hero Background Gradient

linear-gradient(
180deg,
#FFFFFF 0%,
#F8FAFC 100%
)

Dark Hero Gradient

linear-gradient(
180deg,
#0F172A 0%,
#162033 100%
)

Radial Accent

radial-gradient(
circle,
rgba(79,124,255,.08),
transparent 70%
)

Avoid loud multicolor gradients.

---

# Shadows

Light

Card

0 8px 30px rgba(15,23,42,.08)

Hover

0 14px 40px rgba(15,23,42,.12)

Modal

0 25px 60px rgba(15,23,42,.16)

---

Dark

Card

0 10px 35px rgba(0,0,0,.28)

Hover

0 16px 45px rgba(0,0,0,.36)

Modal

0 30px 70px rgba(0,0,0,.50)

---

# Typography

Primary Font

Geist

Fallback

Inter

Monospace Font

JetBrains Mono

---

# Font Usage

Display

Geist Bold

Headings

Geist Semibold

Subheadings

Geist Medium

Body

Geist Regular

Buttons

Geist Medium

Labels

Geist Medium

Code Blocks

JetBrains Mono

---

Never use decorative fonts.

Never mix more than two font families.

Never use italic body text.

Never use font weight above 700.

## Maintain consistent typography across all pages.

# Theme Philosophy

Landing pages should default to Light Theme to create a welcoming first impression.

The application dashboard should default to Dark Theme to improve long-session comfort and focus.

Users must be able to switch themes at any time.

Brand colors, typography, spacing, and component hierarchy must remain identical across both themes.

Only neutral colors (backgrounds, surfaces, borders, and text) should change between themes.

# Font Weights

Regular

400

Medium

500

Semibold

600

Bold

700

---

# Typography Scale

Display XL

64px

Display

56px

Heading XL

48px

Heading L

40px

Heading M

32px

Heading S

24px

Title

20px

Body Large

18px

Body

16px

Body Small

14px

Caption

13px

Micro

12px

---

# Line Height

Display

110%

Headings

120%

Body

150%

Captions

140%

---

# Letter Spacing

Default

0

Display

-2%

Buttons

0

Caps Labels

2%

---

# Border Radius

Button

12px

Input

12px

Card

18px

Modal

20px

Badge

999px

Avatar

999px

---

# Shadows

Card

0 8px 24px rgba(0,0,0,.18)

Hover

0 18px 50px rgba(0,0,0,.28)

Modal

0 24px 80px rgba(0,0,0,.35)

Avoid heavy shadows.

---

# Spacing System

Use only multiples of 4.

4

8

12

16

20

24

32

40

48

56

64

80

96

Never use random spacing values.

---

# Grid

Desktop

12 columns

Tablet

8 columns

Mobile

4 columns

Container Width

1440px

Content Width

1280px

Hero Content

640px

---

# Buttons

Primary

Blue Filled

Secondary

Dark Border

Ghost

Transparent

Danger

Red Filled

Icon

Square

Loading

Spinner inside button

Disabled

50% opacity

---

# Inputs

Height

48px

Padding

16px

Radius

12px

Border

1px

Placeholder

Muted Text

Focus

Blue Border

Blue Glow

---

# Cards

Padding

24px

Radius

18px

Border

1px

Background

Surface

Hover

Lift 4px

Increase shadow slightly

---

# Icons

Library

Lucide React

Stroke Width

1.75

Never mix icon libraries.

---

# Animations

Library

Framer Motion

Default Duration

250ms

Fast

150ms

Slow

500ms

Default Easing

cubic-bezier(.16,1,.3,1)

Never use bounce animations.

Never use exaggerated motion.

---

# Motion Principles

Motion must communicate.

Examples

Loading

Success

Error

Navigation

Hover

State Change

Do not animate purely for decoration.

---

# Hero Animation

The homepage hero should simulate a real AI interview.

Sequence

Browser Appears

↓

Question Appears

↓

AI Avatar Speaks

↓

Recording Starts

↓

Waveform Animates

↓

Transcript Types

↓

Analysis Screen

↓

Score Animation

↓

Report Appears

↓

Loop

---

# Charts

Library

Recharts

Animation

Smooth

Minimal

No rainbow colors.

---

# Progress Bars

Rounded

Animated

Blue

Success Green

Warning Orange

---

# Avatar

Professional

Friendly

Semi-realistic illustration

Business attire

No robots

No cartoons

No anime

No uncanny realism

---

# Navbar

Height

72px

Transparent initially

Blur after scrolling

Sticky

---

# Sections

Hero

Features

How It Works

AI Demo

Interview Report

Testimonials

Pricing

FAQ

CTA

Footer

---

# Accessibility

Minimum contrast ratio WCAG AA.

Keyboard navigation.

Visible focus states.

ARIA labels.

Reduced motion support.

Semantic HTML.

---

# Performance

Lazy load heavy components.

Optimize images.

Avoid unnecessary rerenders.

Use React.memo where appropriate.

Respect Core Web Vitals.

---

# Responsive Breakpoints

Mobile

640px

Tablet

768px

Laptop

1024px

Desktop

1280px

Wide

1536px

---

# UI Components

Button

Input

Textarea

Checkbox

Switch

Radio

Badge

Chip

Tooltip

Popover

Dropdown

Tabs

Accordion

Card

Modal

Drawer

Sidebar

Navbar

Breadcrumb

Pagination

Toast

Alert

Avatar

Progress

Skeleton

Empty State

Loader

---

# AI Components

Interview Window

Question Card

Transcript Panel

Recording Indicator

Waveform

AI Avatar

Analysis Loader

Score Ring

Feedback Card

Recommendation Panel

Interview Timeline

Resume Preview

Interview Plan

---

# Code Style

Use TypeScript.

Functional components only.

Reusable hooks.

Reusable UI primitives.

Avoid duplicated logic.

Keep components small.

Prefer composition over inheritance.

---

# Libraries

React

Vite

Tailwind CSS

Framer Motion

Lucide React

shadcn/ui

React Hook Form

Zod

Recharts

Lenis

clsx

tailwind-merge

---

# Design References

Linear

OpenAI

Vercel

Notion

Raycast

Apple (motion only)

Do not imitate flashy AI startups.

---

# Final Rule

Every new component must answer these questions:

1. Does it look premium?

2. Is it consistent with the design system?

3. Does it improve usability?

4. Can it be reused?

5. Would this feel at home in Linear or OpenAI?

If any answer is "No", redesign the component before implementation.
