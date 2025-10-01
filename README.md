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