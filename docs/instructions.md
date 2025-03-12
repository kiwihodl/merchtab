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

1. Test locally with development server:

   ```bash
   npm run dev
   ```

   - Verify all changes work as expected
   - Test all affected functionality
   - Check for any console errors

2. Test production build locally:

   ```bash
   npm run build
   ```

   - Ensure build completes successfully
   - Check for any build errors or warnings
   - Verify static generation works as expected

3. Only after both steps above pass:
   - Commit changes to GitHub
   - Push to repository
   - Deploy on Vercel

⚠️ Never skip these steps or push directly to GitHub without local verification.
