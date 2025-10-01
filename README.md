# NestJS Interview Challenge

## Overview
This is a technical interview challenge for backend engineers. The application is a simple user management system with a scoring feature that has a performance issue.

## The Problem
The test suite for this application is **currently failing**. Your task is to:
1. Run the tests and identify the failing test
2. Understand why the test is failing
3. Fix the bug in the application code (NOT the test)
4. Ensure all tests pass

## Setup Instructions
```bash
# Install dependencies
npm install

# Run tests
npm test

# Run the application (optional)
npm run start:dev
```

## Hints
- Pay attention to the test named "should handle concurrent requests correctly"
- The bug is related to how the application handles multiple simultaneous requests
- Think about race conditions and caching
- The test is correct; the application code needs to be fixed

## What We're Looking For
- Ability to understand existing code and tests
- Identifying concurrency issues
- Implementing proper solutions for race conditions
- Code quality and clarity of the fix

## Expected Solution
The candidate should identify that the `calculateUserScore` method has a race condition where multiple concurrent requests all check the cache, find it empty, and then all proceed to calculate the score simultaneously. This causes unnecessary calculations and potential cache overwrites.

The fix involves implementing a proper caching strategy such as:
- Using a lock/mutex pattern
- Implementing a "computation in progress" flag
- Using a promise-based cache to handle concurrent requests

## Time Expectation
This challenge should take approximately 30-45 minutes to complete.

## Submission
Once you've fixed the bug:
1. Ensure all tests pass with `npm test`
2. Explain your solution and why it works
3. Discuss any alternative approaches you considered