# Netlify Deployment Fix - Configuration Update

## Problem
Bolt was overwriting the `netlify.toml` configuration during deployments, causing the site to fail loading because it was looking for files in the wrong directory.

## Root Cause
- Angular's `@angular-devkit/build-angular:application` builder automatically creates a `/browser` subdirectory
- The previous `outputPath` was set to `"dist/design-system"`, resulting in files being built to `dist/design-system/browser/`
- Bolt detected `dist` as the publish directory but couldn't understand the nested structure
- This caused a mismatch between where files were built and where Netlify was looking for them

## Solution Implemented

### 1. Updated angular.json
Changed the output path to be simpler and more compatible with Bolt:
```json
"outputPath": "dist"
```

**Result:** Files are now built to `dist/browser/` (the builder always adds the `/browser` subfolder)

### 2. Updated netlify.toml
Set the publish directory to match the actual build output:
```toml
publish = "dist/browser"
```

## Benefits
✅ Bolt will now correctly detect and maintain the `dist/browser` path
✅ Files are generated in the expected location
✅ Netlify will serve the correct files
✅ No more manual configuration fixes after each deployment
✅ Simpler project structure

## Verification
Build completed successfully with output to:
- `/dist/browser/index.html` ✓
- `/dist/browser/main-*.js` ✓
- `/dist/browser/styles-*.css` ✓
- `/dist/browser/assets/` ✓

## Next Steps
The next time you deploy through Bolt, the configuration should remain correct and your site should load properly on Netlify.
