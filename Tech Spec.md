# Technical Specification

## Assumptions & Constraints
- **Multiple User Account:** I have assumed and built the system to support multiple user accounts. Each user can create and manage their company page.
- **Image Hosting:** In initial stage I was using base64 conversion for Images However, later on to handle larger files and to keep the backend stateless, lightweight, I have offloaded all media storage to Cloudinary.
- **Deployment:** I have hosted the app on two different platforms. Frontend on Netlify (for CDN speed) and Backend on Render (free tier limits apply, so cold starts are expected).
- **Mobile First:** The editor needs to work on desktop or on mobile and the *generated page* will look perfect on mobile since most candidates apply via phone.

## Architecture
- **Pattern:** One repo but two separate deployments.
- **Frontend:** React + Vite. State management is mostly local (useState) with some prop drilling. For a larger app, I'd move to Context or Redux, but it's overkill here.
- **Backend:** Node.js/Express. RESTful API design.
- **Database:** MongoDB. I chose a relational-style embedding for "Branding" but referenced relationships for "Jobs" and "Sections" to keep documents from hitting size limits if a company posts hundreds of jobs.

## Database Schema (Key Models)
1. **User:** Standard auth (email/password (hashed)) with the use JWT and http only cookie ( for security ).
2. **Company:** The core entity. Links to `userId`. Contains `branding` object (colors, logo URL) directly embedded for fast read access on the public page.
3. **Section:** Represents a content block. Fields: `type` (text, video, etc.), `content`, `order` (for drag-and-drop sorting).
4. **Job:** I have used provided sample data for the job posting fields (title, location, salary).

## Test Plan
I focused on manual integration testing rather than unit tests for this iteration:
1. **Auth Flow:** Verify signup/login, cookie persistence, and protected route redirection.
2. **Editor Stability:**
   - Add/Edit/Delete sections.
   - Reordering (drag and drop logic).
   - Image uploads (ensure <5MB files work, larger ones fail gracefully).
3. **Public View:**
   - Access via shared link without login.
   - Verify mobile responsiveness on Chrome DevTools.
4. **Edge Cases:**
   - Broken video URLs (should show placeholder).
   - Empty states (when no jobs are posted).
   - Empty state when no company found on home page.
