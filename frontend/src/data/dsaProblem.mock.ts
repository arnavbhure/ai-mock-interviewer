import type { DSAProblem, DSALanguage, DSAInterviewStage, DSADialogueStep } from "@/types/dsaInterview.types";

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
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  // Write your solution here
  let maxLength = 0;
  let left = 0;
  const seen = new Map();

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (seen.has(char) && seen.get(char) >= left) {
      left = seen.get(char) + 1;
    }
    seen.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Write your solution here
        seen = {}
        left = 0
        max_len = 0
        
        for right, char in enumerate(s):
            if char in seen and seen[char] >= left:
                left = seen[char] + 1
            seen[char] = right
            max_len = max(max_len, right - left + 1)
            
        return max_len`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>

class Solution {
public:
    int lengthOfLongestSubstring(std::string s) {
        // Write your solution here
        std::unordered_map<char, int> seen;
        int left = 0;
        int maxLen = 0;

        for (int right = 0; right < s.length(); ++right) {
            char c = s[right];
            if (seen.find(c) != seen.end() && seen[c] >= left) {
                left = seen[c] + 1;
            }
            seen[c] = right;
            maxLen = std::max(maxLen, right - left + 1);
        }

        return maxLen;
    }
};`,
      java: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your solution here
        Map<Character, Integer> seen = new HashMap<>();
        int left = 0;
        int maxLen = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (seen.containsKey(c) && seen.get(c) >= left) {
                left = seen.get(c) + 1;
            }
            seen.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }

        return maxLen;
    }
}`,
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
    aiText: "Let's work through a coding problem. I'll first ask you to explain your approach before you start coding.",
    stateLabel: "AI Interviewer Speaking",
    orbState: "speaking",
    requiresCandidateResponse: false,
  },
  APPROACH_DISCUSSION: {
    aiText: "Take a moment to understand the problem. When you're ready, walk me through how you would approach it.",
    stateLabel: "Listening for Candidate Approach",
    orbState: "listening",
    requiresCandidateResponse: true,
    candidatePromptPlaceholder: "Explain your proposed algorithm (e.g., sliding window with two pointers)...",
    suggestedAnswers: [
      "I'll use a sliding window with two pointers (left & right) and a Hash Map to store character indexes.",
      "A brute force approach would check all O(n²) substrings, but sliding window optimizes this to O(n).",
    ],
  },
  APPROACH_EVALUATION: {
    aiText: "Good. Now let's think about the complexity of that approach. What would be the time and space complexity?",
    stateLabel: "Listening for Complexity Analysis",
    orbState: "listening",
    requiresCandidateResponse: true,
    candidatePromptPlaceholder: "State your expected time and space complexity (e.g., O(n) time, O(k) space)...",
    suggestedAnswers: [
      "Time complexity is O(n) because each character is visited at most twice. Space complexity is O(min(m, n)) for the hash set.",
      "O(n) linear time with O(k) space, where k is the size of the charset.",
    ],
  },
  CODING: {
    aiText: "Good. Go ahead and implement your approach. I'll be here if you need clarification.",
    stateLabel: "Candidate Implementing Solution",
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
    aiText: "Nice! All sample test cases passed. Ensure your logic covers edge cases like empty string and repeating characters, then submit.",
    stateLabel: "Sample Test Cases Passed",
    orbState: "speaking",
    requiresCandidateResponse: false,
  },
  SUBMITTING: {
    aiText: "Evaluating your solution against all 25 hidden benchmark test suites...",
    stateLabel: "Evaluating Submission",
    orbState: "thinking",
    requiresCandidateResponse: false,
  },
  POST_SUBMISSION_DISCUSSION: {
    aiText: "Your solution passes the test cases! Before we move on, explain the time and space complexity.",
    stateLabel: "Listening for Final Complexity Verification",
    orbState: "listening",
    requiresCandidateResponse: true,
    candidatePromptPlaceholder: "Confirm time & space complexity of your final code...",
    suggestedAnswers: [
      "Time: O(n) single pass with hash lookup in O(1); Space: O(min(m, n)) storing unique characters.",
      "Optimal O(n) runtime and O(1) space if the alphabet is constrained to 128 ASCII symbols.",
    ],
  },
  COMPLETED: {
    aiText: "Outstanding work! Your algorithmic reasoning, edge case handling, and implementation were top notch.",
    stateLabel: "Round Completed",
    orbState: "speaking",
    requiresCandidateResponse: false,
  },
};

export const LANGUAGE_OPTIONS: { id: DSALanguage; label: string; monacoLang: string }[] = [
  { id: "javascript", label: "JavaScript (Node 20)", monacoLang: "javascript" },
  { id: "python", label: "Python (3.11)", monacoLang: "python" },
  { id: "cpp", label: "C++ (GCC 14)", monacoLang: "cpp" },
  { id: "java", label: "Java (OpenJDK 21)", monacoLang: "java" },
];
