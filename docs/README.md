# WanderLust React Migration

## Rollback note

The Express app now serves the React production build from `frontend/dist` and preserves the backend JSON API under `/api`.

To roll back to the former EJS frontend, restore the deleted EJS route files and `views/` templates from git history, then remount the old frontend routers in `app.js` before the SPA fallback.

Keep the `/api` routers mounted first so React and EJS rollback paths do not change API behavior.
