# React Migration Phase 1

## Feature Parity Map

| Feature | Existing EJS route | API route added | Status |
| --- | --- | --- | --- |
| Listings index | `GET /listings` | `GET /api/listings` | Parallel JSON endpoint added |
| Listing show | `GET /listings/:id` | `GET /api/listings/:id` | Parallel JSON endpoint added |
| Create listing | `POST /listings` | `POST /api/listings` | Session auth, upload, Joi validation preserved |
| Edit listing | `PUT /listings/:id` | `PUT /api/listings/:id` | Session auth, owner check, upload, Joi validation preserved |
| Delete listing | `DELETE /listings/:id` | `DELETE /api/listings/:id` | Session auth and owner check preserved |
| Create review | `POST /listings/:id/reviews` | `POST /api/listings/:id/reviews` | Session auth and Joi validation preserved |
| Delete review | `DELETE /listings/:id/reviews/:reviewId` | `DELETE /api/listings/:id/reviews/:reviewId` | Session auth and author check preserved |
| Signup | `POST /signup` | `POST /api/auth/signup` | Passport session login preserved |
| Login | `POST /login` | `POST /api/auth/login` | Passport local strategy preserved |
| Logout | `GET /logout` | `POST /api/auth/logout` | Passport session logout preserved |
| Current user | EJS `res.locals.currUser` | `GET /api/auth/me` | JSON session probe added |

## Migration Notes

- EJS routes remain mounted and are not retired in this phase.
- API responses follow `{ success: true, data }` and `{ success: false, message, details? }`.
- React requests use `credentials: "include"` through `frontend/src/services/api.js`.
- CORS allows `CLIENT_ORIGINS`, `CLIENT_ORIGIN`, or `http://localhost:5173` by default.
- Listing image upload continues to use the existing multer/cloudinary field name: `listing[image]`.

## Rollback

1. Remove the `/api` route mounts from `app.js`.
2. Remove `routes/apiListings.js`, `routes/apiReviews.js`, `routes/apiUsers.js`, and `utils/apiResponse.js`.
3. Revert the JSON-aware branches in `middleware.js` and `app.js`.
4. Remove the `/frontend` directory if the React scaffold is not being kept.
5. Keep the existing EJS route files and views; they were left in place throughout this phase.

## Next Step

Complete the listings index/show React slice against real data, then add signup/login/logout screens before enabling write workflows.
