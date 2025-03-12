# Development Instructions

## ⚠️ CRITICAL REQUIREMENTS

### 1. Server Components

- **THE NAVBAR MUST REMAIN A SERVER COMPONENT**
- DO NOT convert the Navbar to a client component under any circumstances
- DO NOT create new client components to replace Navbar functionality
- If client-side interactivity is needed, modify existing client components or add minimal client components within the server component

### 2. Component Styling

- **PRESERVE ALL EXISTING COMPONENT STYLING**
- Modify existing components instead of creating new ones
- Keep all current CSS classes and styling patterns
- DO NOT replace existing components with new implementations
- Add functionality within the existing component structure

## General Guidelines

1. Follow the existing architecture patterns
2. Maintain type safety throughout
3. Keep performance in mind
4. Write clean, maintainable code
5. Document significant changes

## Deployment Workflow

Before pushing any changes to GitHub and deploying to Vercel, always follow these steps in order:

1. Run Automated Tests:

   ```bash
   npm test
   ```

   - All tests must pass
   - No skipped or pending tests
   - Check test coverage for new features
   - ⚠️ DO NOT proceed if any tests fail

2. Build Production Version:

   ```bash
   npm run build
   ```

   - Build must complete without errors
   - Address all build warnings
   - Verify static generation
   - ⚠️ DO NOT proceed if build fails

3. Manual QA Testing:

   First, provide a clear QA testing plan that includes:

   - List of features to test
   - Expected behaviors
   - Edge cases to verify
   - Specific user interactions to test
   - Any known limitations or areas of concern

   Then run development server:

   ```bash
   npm run dev
   ```

   Execute the QA plan, checking:

   - All modified features work as expected
   - No regressions in existing functionality
   - Client and server components behave correctly
   - Console is free of errors and warnings
   - Performance is acceptable
   - Mobile and desktop views work correctly

4. User Confirmation:

   - Present QA results to user
   - List any issues found and their resolutions
   - Get explicit user approval to proceed
   - ⚠️ DO NOT proceed without user confirmation

5. Only after user approval:
   - Commit changes to GitHub
   - Push to repository
   - Deploy on Vercel

⚠️ CRITICAL CHECKPOINTS:

- Tests MUST pass before building
- Build MUST succeed before QA
- QA MUST be completed with a clear test plan
- User MUST approve before pushing to GitHub
- NEVER skip steps or push without verification
