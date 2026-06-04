# GroundUp — Gen Z Financial Clarity Agent

## What It Does
GroundUp is an AI-powered financial agent designed specifically for Gen Z. It moves beyond traditional budgeting apps by acting as a proactive financial planner that understands the realities of student loans, high rent, and entry-level salaries. It helps users build a personalized "Broke to Stable" roadmap, tracks their financial health score, and executes multi-step planning tasks.

## Live Demo
- Hosted URL: [Insert Hosted URL Here]
- Demo credentials: Use the "Try Demo" button on the landing page to explore the app with pre-loaded data (Alex Chen's profile).

## Tech Stack
- **Frontend**: React 18, Tailwind CSS, Recharts
- **Agent**: Gemini 2.5 Flash via Google Cloud Agent Builder
- **Database**: MongoDB Atlas (integrated via Model Context Protocol - MCP)
- **Hosting**: Firebase Hosting / Cloud Run
- **Infra**: Google Cloud Secret Manager

## Architecture Diagram
User → React Frontend → Gemini Agent (Agent Builder)
           ↕
       MongoDB MCP Server (Cloud Run)
           ↕
       MongoDB Atlas (groundup database)

## Getting Started

### Prerequisites
- Node.js 18+
- Google Cloud account with Vertex AI enabled
- MongoDB Atlas free account

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/groundup.git
cd groundup

# Install dependencies
npm install

# Start the development server
npm start
```

### Environment Variables
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_atlas_connection_string
GOOGLE_CLOUD_PROJECT=your_google_cloud_project_id
API_KEY=your_gemini_api_key
```

## Features
- **Conversational Planning**: Chat naturally to build budgets, audit subscriptions, and plan debt payoffs.
- **Financial Health Score**: Real-time 0-100 score based on debt-to-income, savings rate, and expense coverage.
- **Broke to Stable Roadmap**: A 4-phase visual journey from surviving to thriving.
- **Scenario Simulator**: Ask "what if" questions to see how life changes impact your finances without altering your saved data.
- **Progress Sharing**: Generate beautiful, downloadable PNG cards with AI-generated motivational taglines to share your wins.
- **Guest & Demo Modes**: Try the app friction-free before committing your data.

## Hackathon Submission
- **Event**: Google Cloud Rapid Agent Hackathon 2026
- **Track**: MongoDB Partner Track
- **Built with**: Gemini, Google Cloud Agent Builder, MongoDB MCP Server

## License
MIT License — see LICENSE file
