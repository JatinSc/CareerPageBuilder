# Career Page Builder

A no-code tool that helps companies build and host simple, branded career pages. I built this to solve the problem of complex CMSs being too heavy for simple hiring needs.

## How to Run

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas URI)
- Cloudinary Account (for uploading company branding images)

### Setup
1. **Clone the repo**
2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create .env file with: PORT, MONGO_URI, JWT_SECRET, CLIENT_URL
   npm start
   ```
3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   # Create .env file with: VITE_API_URL, VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET
   npm run dev
   ```

## What I Built
- **Visual Editor:** we can see real-time preview of changes, as all the changes will be saved in database just after one click.
- **Custom Branding:** Users can pick primary colors, font-colors, and upload logos, banners.
- **Dynamic Sections:** User can hide or unhide sections, reorder sections, and the best part is that a user can choose different layouts (video left, image right, etc.). which will give user a chance to create a unique layout for their career page. As it is our responsibility to provide options to the user so that they don't need to think about the layout.
- **Job Board:** Simple listing management and currently I am using sample data provided in the assignment for the job board, which I have seeded in the database.

## Improvement Plan (Future Work)
If I had more time, here's what I'd tackle next:
1. **Analytics Dashboard:** Track page views, "Apply" clicks, rating system (currently it is static) for job postings so that a company can see how well their job postings are performing.
2. **Custom Domains:** Allow users to map `careers.theircompany.com` via CNAME records.
3. **Rich Text Editor:** Currently using a simple textarea; a WYSIWYG editor would be better for formatting job descriptions.
4. **AI Writing Assistant:** Integrate OpenAI to help users write job descriptions.
5. **UI enhancements:** I would have worked more on UX/UI part to make it more user-friendly and intuitive. so that a user would have more options to make their career page look unique.
6. **Post Jobs:** I would have added a API and a form to post jobs. so that a user can post jobs on their career page.
7. **Unit testing:** I would have added unit testing for the backend API and frontend components.

## User Guide
1. **Sign Up:** Create an account for your company.
2. **Branding:** Go to the "Branding" tab first. Create your own unique branding theme by choosing background color, font-color, and upload your logo and banner. add a company name and a tagline. Add Company cultural videos to make your career page more unique. if you don't have banner image.. don't worry, I have created 6 banner imager for you which will dynamically change based on the theme you will create.
3. **Add Content:** Use the "Sections" tab to tell your story. Try the "Video Split" layout and Full Width layout (for Images) it looks too good. Reorder sections as per your needs. hide or unhide sections or delete sections as per your needs.
5. **Publish:** Toggle the "Published" switch in Settings. Share your link!
