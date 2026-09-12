# Trao — AI Interview Preparation Kit

Trao is an AI-powered interview preparation platform that creates personalized interview preparation kits from a job description, company URL, and available preparation time.

The application researches the company, identifies important role requirements, generates categorized interview questions, creates flashcards, analyzes requirement coverage, and builds a day-by-day preparation schedule.

---

## Live Demo

- Frontend: `Add deployed frontend URL`
- Backend API: `Add deployed backend URL`

> The live URLs will be added after deployment.

---

## Features

### Authentication

- User registration
- User login
- Session-based authentication
- Protected interview-kit routes
- User-specific kit access

### Interview Kit Generation

Users provide:

- Job description
- Company URL
- Number of preparation days

The system then generates:

- Company research summary
- Company sources
- Role information
- Categorized interview questions
- Answer outlines
- Flashcards
- Coverage analysis
- Daily preparation schedule

### Kit Management

- View previously generated kits
- Edit interview questions
- Edit answer outlines
- Add custom questions
- Delete questions
- Move questions up or down within a category
- Save changes to MongoDB
- Regenerate questions
- Regenerate flashcards
- Regenerate the preparation schedule

### Learning Modes

- Question Practice Mode
- Flashcard Study Mode
- Reveal model answers
- Navigate between questions or flashcards
- Track current practice progress

### User Experience

- Loading states
- Error states
- Empty states
- Responsive design
- Mobile-friendly layouts
- Research source links
- Clear section-based interview preparation interface

---

## Technology Stack

### Frontend

- Next.js
- React
- JavaScript
- Tailwind CSS
- Next.js App Router
- Fetch API

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Express Session
- CORS
- dotenv

### AI and Research

- Google Gemini API
- Tavily API
- Structured JSON-based generation pipeline

---

## System Architecture

```text
                    ┌──────────────────────┐
                    │       User           │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Next.js Frontend    │
                    │  React + Tailwind    │
                    └──────────┬───────────┘
                               │
                    HTTP Requests + Cookies
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Express Backend    │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
   ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
   │ Authentication   │ │ Kit Generation  │ │ Kit Management  │
   └─────────────────┘ └────────┬────────┘ └─────────────────┘
                                │
                 ┌──────────────┼──────────────┐
                 │              │              │
                 ▼              ▼              ▼
       ┌────────────────┐ ┌────────────┐ ┌───────────────┐
       │ Tavily Research│ │ Gemini API │ │ MongoDB        │
       └────────────────┘ └────────────┘ └───────────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │ Structured Interview │
                    │ Preparation Kit      │
                    └──────────────────────┘
```

---

## Application Workflow

```text
Register or Login
       │
       ▼
Enter Job Description
       │
       ▼
Enter Company URL
       │
       ▼
Select Preparation Days
       │
       ▼
Generate Interview Kit
       │
       ├── Research Company
       ├── Extract Role Requirements
       ├── Generate Interview Questions
       ├── Generate Flashcards
       ├── Calculate Coverage
       └── Generate Daily Schedule
       │
       ▼
View and Edit Kit
       │
       ├── Practice Questions
       ├── Study Flashcards
       ├── Review Schedule
       ├── Regenerate Sections
       └── Save Changes
```

---

## Project Structure

```text
trao-interview-kit/
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   └── error.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Kit.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── kit.routes.js
│   │
│   ├── services/
│   │   ├── research.service.js
│   │   ├── retrieval.service.js
│   │   ├── validation.service.js
│   │   ├── question-generation.service.js
│   │   ├── question-pipeline.service.js
│   │   ├── flashcard.service.js
│   │   ├── coverage.service.js
│   │   ├── schedule.service.js
│   │   └── regenerate.service.js
│   │
│   ├── tests/
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   │
│   ├── app/
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── kits/
│   │   │   ├── new/
│   │   │   └── [kitId]/
│   │   │       ├── page.jsx
│   │   │       ├── practice/
│   │   │       └── flashcards/
│   │   ├── layout.js
│   │   └── page.js
│   │
│   ├── src/
│   │   └── lib/
│   │       └── api.js
│   │
│   ├── public/
│   ├── package.json
│   └── .env.local
│
├── .gitignore
└── README.md
```

> File names may vary slightly depending on the final project structure.

---

## Prerequisites

Before running the project, install or create the following:

- Node.js 18 or later
- npm
- MongoDB Atlas or a local MongoDB instance
- Google Gemini API key
- Tavily API key

---

## Environment Variables

### Backend Environment Variables

Create a `.env` file inside the `backend` directory.

```env
PORT=5000
NODE_ENV=development

FRONTEND_URL=http://localhost:3000

MONGODB_URI=your_mongodb_connection_string

SESSION_SECRET=your_secure_session_secret

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

TAVILY_API_KEY=your_tavily_api_key
```

### Frontend Environment Variables

Create a `.env.local` file inside the `frontend` directory.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Environment Variable Description

| Variable | Description |
|---|---|
| `PORT` | Port used by the Express backend |
| `FRONTEND_URL` | Frontend origin allowed by the backend |
| `MONGODB_URI` | MongoDB connection string |
| `SESSION_SECRET` | Secret used to sign session data |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GEMINI_MODEL` | Gemini model used for generation |
| `TAVILY_API_KEY` | Tavily API key for company research |
| `NEXT_PUBLIC_API_URL` | Backend URL used by the frontend |

> Never commit `.env` or `.env.local` files to GitHub.

---

## Installation

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd trao-interview-kit
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

## Run the Project Locally

### Start the Backend

From the `backend` directory:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

### Start the Frontend

From the `frontend` directory:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:3000
```

Open the application in your browser:

```text
http://localhost:3000
```

---

## API Documentation

All kit routes require an authenticated session unless stated otherwise.

### Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login an existing user |
| `POST` | `/api/auth/logout` | Logout the current user |
| `GET` | `/api/auth/me` | Get the current authenticated user |

### Interview Kit APIs

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/kits/generate` | Generate and save a new interview kit |
| `GET` | `/api/kits` | Get all kits belonging to the current user |
| `GET` | `/api/kits/:kitId` | Get one interview kit |
| `PUT` | `/api/kits/:kitId` | Update an interview kit |
| `DELETE` | `/api/kits/:kitId` | Delete an interview kit |
| `POST` | `/api/kits/:kitId/regenerate` | Regenerate a selected kit section |

---

## Generate Kit API

### Request

```http
POST /api/kits/generate
Content-Type: application/json
```

### Request Body

```json
{
  "jd": "Job description text goes here...",
  "company_url": "https://example.com",
  "days": 5
}
```

### Example Response Structure

```json
{
  "kit": {
    "source": {},
    "company_brief": {},
    "role": {},
    "questions": [],
    "flashcards": [],
    "schedule": {},
    "coverage": {}
  }
}
```

---

## Update Kit API

### Request

```http
PUT /api/kits/:kitId
Content-Type: application/json
```

### Request Body

```json
{
  "questions": [
    {
      "id": "question-1",
      "category": "technical",
      "prompt": "Explain REST APIs.",
      "answer_outline": "Discuss HTTP methods, resources, and statelessness.",
      "source": "user",
      "edited": true
    }
  ]
}
```

The update API supports fields such as:

- `source`
- `company_brief`
- `role`
- `questions`
- `flashcards`
- `schedule`
- `coverage`

---

## Regenerate Section API

### Request

```http
POST /api/kits/:kitId/regenerate
Content-Type: application/json
```

### Request Body

```json
{
  "section": "questions"
}
```

Supported sections:

```text
questions
flashcards
schedule
```

The question regeneration flow is designed to preserve manually edited or user-created questions.

---

## Data Model Overview

An interview kit may contain the following sections:

### Source

Contains the original input and source metadata:

- Company
- Company URL
- Role
- Location
- Job description information
- Research timestamp

### Company Brief

Contains researched company information:

- Company summary
- What the company does
- Important topics
- Research sources
- Confidence notes

### Role

Contains role-related information extracted from the job description.

### Questions

Each question may include:

- Unique question ID
- Category
- Prompt
- Answer outline
- Difficulty
- Requirement IDs
- Source
- Edited status
- Pinned status

### Flashcards

Flashcards contain a question or concept and its corresponding answer or explanation.

### Schedule

The schedule contains:

- Number of preparation days
- Daily focus
- Time allocation
- Question IDs assigned to each day

### Coverage

Coverage analysis describes how generated questions map to the identified job requirements.

---

## Testing

The backend includes API test scripts for validating important application flows.

From the `backend` directory, run:

```bash
npm test
```

The test flow should cover:

1. User registration
2. User login
3. Interview kit generation
4. Fetching all kits
5. Fetching a single kit
6. Updating a kit
7. Regenerating questions
8. Regenerating flashcards
9. Regenerating the schedule
10. Deleting a kit
11. Authentication and protected-route behavior

> Make sure the backend environment variables and database connection are configured before running integration tests.

---

## Error Handling

The application handles common failure scenarios, including:

- Missing job description
- Missing or invalid input fields
- Invalid preparation-day values
- Authentication failures
- Unauthorized kit access
- Kit not found
- Database errors
- AI generation failures
- Research API failures
- Empty question sections
- Empty flashcard sections
- Empty schedule sections
- Invalid or unexpected API responses

The frontend displays loading, error, and empty states to improve usability.

---

## Security Considerations

- API keys are stored only on the backend.
- Secrets are managed through environment variables.
- Session-based authentication protects private routes.
- Kit queries are scoped to the authenticated user.
- Users cannot update or delete another user's kit.
- The frontend communicates with the backend using credentialed requests.
- Environment files are excluded from version control.

---

## Deployment

### Backend Deployment

The backend can be deployed on platforms such as:

- Render
- Railway
- Fly.io

Configure the following production environment variables:

```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
MONGODB_URI=your_production_mongodb_uri
SESSION_SECRET=your_production_session_secret
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
TAVILY_API_KEY=your_tavily_api_key
```

After deployment, verify the backend health endpoint or an available API endpoint.

### Frontend Deployment

The frontend can be deployed on Vercel.

Set the following environment variable in the deployment settings:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

Then:

1. Import the repository into Vercel.
2. Set the project root to `frontend`.
3. Configure the environment variable.
4. Deploy the application.
5. Update the backend `FRONTEND_URL` with the deployed frontend URL.

### Production Checklist

- [ ] MongoDB connection works in production
- [ ] Backend environment variables are configured
- [ ] Frontend environment variable points to the deployed backend
- [ ] CORS allows the deployed frontend origin
- [ ] Session cookies work across frontend and backend
- [ ] API endpoints return JSON responses
- [ ] Login and registration work
- [ ] Kit generation works
- [ ] Kit updates persist
- [ ] Regeneration works
- [ ] Kit deletion works

---

## Known Limitations

- AI-generated content may require user review.
- Research quality depends on the availability and quality of public company information.
- API rate limits may affect generation requests.
- Generation time depends on external research and AI API response times.
- Production deployment requires correct cross-origin session-cookie configuration.

---

## Future Improvements

- PDF export for complete interview kits
- Resume-based personalization
- Interview performance analytics
- Audio-based mock interviews
- Spaced-repetition flashcards
- Streaming generation progress
- More advanced requirement-to-question mapping
- Calendar integration for preparation schedules
- Saved practice history
- Role-specific interview templates

---

## License

This project was developed as part of a technical assignment for evaluation purposes.