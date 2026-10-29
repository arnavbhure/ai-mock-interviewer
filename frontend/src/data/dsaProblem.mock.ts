import type { DSAProblem, DSALanguage, DSAInterviewStage, DSADialogueStep } from "@/types/dsaInterview.types";

export const DEFAULT_LANGUAGE_BOILERPLATES: Record<DSALanguage, string> = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // your code here
    
    return 0;
}`,
  javascript: `const fs = require('fs');

function main() {
    // your code here
    
}

main();`,
  python: `import sys

def main():
    # your code here
    pass

if __name__ == "__main__":
    main()`,
  java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // your code here
        
    }
}`,
};

export const MOCK_DSA_PROBLEMS: DSAProblem[] = [
  {
    id: "dsa_001",
    title: "Longest Substring Without Repeating Characters",
    roundTitle: "Round 2 · DSA Coding Interview",
    questionNumber: 1,
    totalQuestions: 2,
    difficulty: "Medium",
    tags: ["Hash Table", "String", "Sliding Window", "Two Pointers"],
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.

A **substring** is a contiguous non-empty sequence of characters within a string.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: 'The answer is "b", with the length of 1.',
      },
      {
        input: 's = "pwwkew"',
        output: "3",
        explanation: 'The answer is "wke", with the length of 3. Note that the answer must be a substring, "pwke" is a subsequence and not a substring.',
      },
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces.",
    ],
    hints: [
      "Consider using a sliding window approach with two pointers (left and right).",
      "A hash map or array can store the most recent index of each character to jump the left pointer forward in O(1) time.",
      "Track the maximum length observed so far: maxLen = max(maxLen, right - left + 1).",
    ],
    starterCode: {
      ...DEFAULT_LANGUAGE_BOILERPLATES,
    },
    testCases: [
      {
        id: 1,
        input: 's = "abcabcbb"',
        expectedOutput: "3",
      },
      {
        id: 2,
        input: 's = "bbbbb"',
        expectedOutput: "1",
      },
      {
        id: 3,
        input: 's = "pwwkew"',
        expectedOutput: "3",
      },
      {
        id: 4,
        input: 's = ""',
        expectedOutput: "0",
      },
    ],
  },
];

export const DSA_STAGE_DIALOGUES: Record<DSAInterviewStage, DSADialogueStep> = {
  INTRO: {
    aiText: "Let's work through a coding problem.",
    stateLabel: "Candidate Ready",
    orbState: "idle",
    requiresCandidateResponse: false,
  },
  APPROACH_DISCUSSION: {
    aiText: "Coding phase active.",
    stateLabel: "Coding",
    orbState: "idle",
    requiresCandidateResponse: false,
  },
  APPROACH_EVALUATION: {
    aiText: "Coding phase active.",
    stateLabel: "Coding",
    orbState: "idle",
    requiresCandidateResponse: false,
  },
  CODING: {
    aiText: "Implement your solution below. Run your tests or submit when ready.",
    stateLabel: "Coding Workspace",
    orbState: "idle",
    requiresCandidateResponse: false,
  },
  RUNNING_CODE: {
    aiText: "Running your solution against the sample test cases...",
    stateLabel: "Compiling & Running Test Cases",
    orbState: "thinking",
    requiresCandidateResponse: false,
  },
  TEST_RESULTS: {
    aiText: "Sample test execution finished. Review the results below.",
    stateLabel: "Test Results",
    orbState: "idle",
    requiresCandidateResponse: false,
  },
  SUBMITTING: {
    aiText: "Evaluating your solution against all hidden benchmark test suites...",
    stateLabel: "Evaluating Submission",
    orbState: "thinking",
    requiresCandidateResponse: false,
  },
  POST_SUBMISSION_DISCUSSION: {
    aiText: "Your solution evaluation is complete.",
    stateLabel: "Submission Evaluated",
    orbState: "idle",
    requiresCandidateResponse: false,
  },
  COMPLETED: {
    aiText: "DSA Round Completed.",
    stateLabel: "Round Completed",
    orbState: "idle",
    requiresCandidateResponse: false,
  },
};

export const LANGUAGE_OPTIONS: { id: DSALanguage; label: string; monacoLang: string }[] = [
  { id: "cpp", label: "C++ (GCC 14)", monacoLang: "cpp" },
  { id: "python", label: "Python (3.11)", monacoLang: "python" },
  { id: "java", label: "Java (OpenJDK 21)", monacoLang: "java" },
  { id: "javascript", label: "JavaScript (Node 20)", monacoLang: "javascript" },
];
