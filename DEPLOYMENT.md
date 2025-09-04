# Deployment Guide

This application is automatically deployed using Vercel with GitHub Actions for CI/CD.

## Deployment Pipeline

1. **GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
   - Runs on every push to `main` branch
   - Installs dependencies and runs linting
   - Builds the application using `npm run build`
   - Runs unit tests with Vitest
   - Runs E2E tests with Playwright
   - Deploys to Vercel if all tests pass

2. **Vercel Configuration** (`vercel.json`):
   - Configures SPA routing (all routes redirect to `/`)
   - Sets up caching headers for assets
   - Adds security headers

## Required Secrets

To enable deployment, add these secrets to your GitHub repository:

- `VERCEL_TOKEN`: Your Vercel deployment token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

## Manual Deployment

To deploy manually:

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

## Build Verification

Before deployment, the pipeline verifies:
- ✅ Code linting passes
- ✅ TypeScript compilation succeeds
- ✅ Application builds successfully
- ✅ Unit tests pass
- ✅ E2E tests pass

## Performance Features

- Static asset caching (1 year)
- Gzip compression
- Security headers
- SPA routing support