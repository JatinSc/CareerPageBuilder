# AI Tool Usage Log

## Approach
I have used AI (chatGPT/bolt.AI) primarily as a "smart documentation" and "boilerplate generator" rather than letting it drive the architecture. My goal was to speed up the tedious parts (CSS grids, regex patterns) while keeping control of the business logic.

First I have built the clean structure for frontend and backend. then I have started the planning with chatGPT for the endpoints needed for the CRUD operations on jobs, sections, and branding. after Completing the backend endpoints, I have started working on the frontend. First I have built simple structures for the pages (Home, Editor, Public) with working functionalities. after completing MVP, I have started working on UI enhencements by using bolt.AI for things like adding a loading spinner, error handling with toast messages, and more ways and options for users for making the page unique. 

By taking inspiration from Dribble for UI components, I have asked AI to give similar UI components etc.. However, it was not quiet the exact thing which I wanted to get. So after getting a something similar, I have made manual changes to make exactly how I wanted it.


## Key Prompts & Refinements

### 1. Regex for Video Embeds
*   **Challenge:** I needed to support YouTube, Vimeo, and Google Drive links, and parsing the IDs is prone to error.
*   **Prompt:** "Write a robust regex function to extract video IDs from YouTube (short/long urls), Vimeo, and Google Drive preview links."
*   **Outcome:** The AI gave a solid utility function (`getEmbedUrl`) that I dropped into `Sections.jsx`. It saved me about an hour of testing weird URL formats.

### 2. Mobile Responsiveness
*   **Challenge:** The section actions (edit/delete buttons) were squishing the text on small screens.
*   **Prompt:** "Fix this Tailwind layout: on mobile, stack the actions below the content instead of side-by-side."
*   **Refinement:** The initial fix was a bit clunky (too much vertical space), so I have manually adjusted the padding and flex-gap to make it tighter.

### 3. Deployment Debugging (CORS)
*   **Challenge:** After deploying to Netlify/Render, the frontend couldn't talk to the backend.
*   **Prompt:** "I'm getting CORS errors on the deployed site but not locally."
*   **Learning:** The AI suggested adding the Netlify domain to the CORS origin array. I missed that the `localhost` origin needs to be explicit for Vite, which caused local dev to break briefly until I added both.

## Learnings
- **CSS is tricky:** AI is great at generating Tailwind classes, but it often over-complicates them. I frequently had to simplify `flex-col md:flex-row` logic to keep the DOM clean.
