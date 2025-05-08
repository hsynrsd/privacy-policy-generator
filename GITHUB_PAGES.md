# Deploying to GitHub Pages (hsynrsd.github.io/privacy-policy-generator)

This project is configured to deploy automatically to GitHub Pages using GitHub Actions.

## Prerequisites

1. Push your code to a GitHub repository
2. Enable GitHub Pages for your repository:
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Under "Build and deployment", select "GitHub Actions" as the source

## How it works

The deployment is handled by the GitHub Actions workflow in `.github/workflows/deploy.yml`. It will:

1. Build the Next.js application with `npm run build`
2. Deploy the static output to GitHub Pages

## Configuration details

The following configurations have been made to support GitHub Pages:

1. **next.config.ts**: 
   - `output: "export"` - Generates static HTML files
   - `basePath: "/privacy-policy-generator"` - Sets the base path to match the repository name
   - `images: { unoptimized: true }` - Required for static export

2. **GitHub Actions workflow**:
   - Configured to build and deploy on pushes to the main branch
   - Also supports manual deployment via workflow_dispatch

## Manual deployment

If you need to trigger a manual deployment:

1. Go to your repository on GitHub
2. Navigate to the "Actions" tab
3. Select the "Deploy to GitHub Pages" workflow
4. Click "Run workflow" and select the branch to deploy from

## Troubleshooting

- If you see 404 errors for assets, check that the `basePath` in `next.config.ts` matches your repository name exactly.
- For image loading issues, ensure all image imports use the Next.js Image component or relative paths that account for the base path.
- Check the Actions tab on GitHub for any build or deployment errors. 