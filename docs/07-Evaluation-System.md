# AI Mock Interviewer Platform

# PRD Part 7

# Evaluation Engine, Scoring System, Hiring Recommendation & Analytics

Version: 1.0
Status: Locked

---

# 1. Evaluation Philosophy

The AI should evaluate candidates similarly to a real interview panel.

The system must evaluate:

- technical competency
- communication
- problem-solving ability
- project understanding
- behavioral skills
- confidence
- depth of knowledge

The evaluation system should prioritize:

Knowledge > Reasoning > Communication

---

# 2. Evaluation Pipeline

Question Asked
↓
Candidate Response
↓
Answer Analysis
↓
Score Generation
↓
Strength Identification
↓
Weakness Identification
↓
Store Evaluation
↓
Generate Follow-Up
↓
Proceed

---

# 3. Evaluation Dimensions

Every answer receives scores for:

Technical Knowledge

Communication

Confidence

Problem Solving

Depth of Knowledge

Project Understanding

Behavioral Skills

---

# 4. Technical Knowledge Score

Purpose:

Evaluate correctness.

Range:

0-10

Examples:

0-2:
Incorrect

3-5:
Basic understanding

6-7:
Good understanding

8-9:
Strong understanding

10:
Expert-level response

---

# 5. Communication Score

Purpose:

Evaluate clarity.

Factors:

- organization
- sentence structure
- explanation quality
- terminology usage

Range:

0-10

---

# 6. Confidence Score

Purpose:

Evaluate delivery confidence.

Factors:

- certainty
- hesitation
- clarity
- consistency

Range:

0-10

---

# 7. Problem Solving Score

Purpose:

Evaluate reasoning.

Factors:

- analytical thinking
- decomposition
- trade-offs
- decision making

Range:

0-10

---

# 8. Depth Score

Purpose:

Evaluate conceptual understanding.

Factors:

- internals
- edge cases
- tradeoffs
- advanced knowledge

Range:

0-10

---

# 9. Project Understanding Score

Purpose:

Evaluate ownership.

Factors:

- architecture
- technology choices
- challenges
- scalability
- implementation

Range:

0-10

---

# 10. Behavioral Score

Purpose:

Evaluate soft skills.

Factors:

- teamwork
- leadership
- ownership
- communication
- conflict management

Range:

0-10

---

# 11. Score Weighting

Resume Discussion:

Project Understanding:
50%

Technical:
30%

Communication:
20%

---

Technical Round:

Technical:
50%

Problem Solving:
25%

Depth:
15%

Communication:
10%

---

DSA Round:

Problem Solving:
45%

Technical:
30%

Depth:
15%

Communication:
10%

---

Behavioral Round:

Behavior:
50%

Communication:
30%

Confidence:
20%

---

# 12. Difficulty Adjustment

Easy:

Final Score × 0.8

Medium:

Final Score × 1.0

Hard:

Final Score × 1.2

Example:

Raw Score:
75

Difficulty:
Hard

Final Score:
90

---

# 13. Follow-Up Question Logic

If score ≥ 8:

Ask advanced follow-up.

Example:

Explain JWT.

↓

Excellent answer.

↓

Ask:

How would you implement JWT refresh token rotation?

---

If score 5-7:

Ask clarification.

Example:

What is React reconciliation?

↓

Partial answer.

↓

Ask:

How does React determine which DOM nodes to update?

---

If score < 5:

Move to another question.

---

# 14. Round Score Calculation

Round Score =

Σ Question Scores
/
Total Questions

Example:

Q1 = 80

Q2 = 85

Q3 = 75

Q4 = 90

Round Score:

82.5

---

# 15. Final Interview Score

Weights:

Resume Round:
20%

Technical:
35%

DSA/System Design:
30%

Behavioral:
15%

Example:

Resume:
85

Technical:
80

DSA:
75

Behavior:
90

Final:

81.75

---

# 16. Hiring Recommendation Engine

Input:

Final Score

Technical Score

Communication Score

Behavior Score

Confidence Score

Weakness Count

---

# 17. Recommendation Matrix

90-100:

Strong Hire

---

80-89:

Hire

---

70-79:

Borderline

---

60-69:

Weak Hire

---

0-59:

No Hire

---

# 18. Override Rules

Example:

Technical:
95

Communication:
20

Result:

Borderline

---

Example:

Technical:
50

Behavior:
95

Result:

Weak Hire

---

Example:

Technical:
85

Problem Solving:
90

Behavior:
85

Result:

Strong Hire

---

# 19. Strength Identification

Rule:

Score > 8

Example:

Strengths:

✓ React

✓ APIs

✓ PostgreSQL

✓ Authentication

---

# 20. Weakness Identification

Rule:

Score < 6

Example:

Weaknesses:

✗ Docker

✗ Redis

✗ DSA

✗ Scalability

---

# 21. Pattern Recognition

Analyze:

Previous interviews

Identify:

Repeated mistakes

Example:

Interview 1:

Weak:
Docker

Interview 2:

Weak:
Docker

Interview 3:

Weak:
Docker

Conclusion:

Docker is persistent weakness.

---

# 22. Improvement Plan Generation

Input:

Weak areas

Output:

Learning roadmap.

Example:

Week 1:

Redis

Week 2:

Docker

Week 3:

Graphs

Week 4:

System Design

---

# 23. Analytics Engine

Track:

Total Interviews

Average Score

Highest Score

Lowest Score

Improvement Rate

Hire Rate

---

# 24. Skill Analytics

Store:

React:
85

Node:
82

MongoDB:
79

Docker:
45

Redis:
40

DSA:
50

---

# 25. Progress Analytics

Generate:

Interview #1:
65

Interview #2:
70

Interview #3:
78

Interview #4:
84

Progress:
+19 points

---

# 26. Interview History Analytics

Store:

Date

Role

Difficulty

Score

Recommendation

Duration

Weaknesses

Strengths

---

# 27. Confidence Analytics

Track:

Communication

Confidence

Behavior

Example:

Interview 1:
45

Interview 5:
78

Improvement:
+33

---

# 28. AI Confidence Score

Internal metric:

How confident is the evaluator?

Scale:

0-100

Example:

95:
Reliable evaluation

60:
Moderately reliable

30:
Low confidence

---

# 29. Evaluation Storage

Store:

Question

Answer

Evaluation

Score

Recommendation

Feedback

Strengths

Weaknesses

Timestamp

Never overwrite.

---

# 30. Report Generation

Sections:

Executive Summary

↓

Performance Breakdown

↓

Round Analysis

↓

Strengths

↓

Weaknesses

↓

Recommendations

↓

Learning Roadmap

↓

Final Hiring Decision

---

# 31. Example Report

Candidate:
Arnav Bhure

Role:
MERN Developer

Difficulty:
Medium

Score:
82

Recommendation:
Hire

---

Strengths:

✓ React

✓ Node

✓ PostgreSQL

✓ APIs

---

Weaknesses:

✗ Redis

✗ Docker

✗ Graph Algorithms

---

Roadmap:

Week 1:
Redis

Week 2:
Docker

Week 3:
Graphs

Week 4:
System Design

---

# 32. Evaluation Rules

The AI must NEVER:

- randomly score
- always give high scores
- always give low scores
- reveal scoring logic
- reveal evaluation prompts

The AI must:

- remain consistent
- remain objective
- justify every score internally

---

# Evaluation System Status

✓ Scoring engine finalized

✓ Recommendation engine finalized

✓ Follow-up logic finalized

✓ Analytics finalized

✓ Improvement plan finalized

✓ Report generation finalized
