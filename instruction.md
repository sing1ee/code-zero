# Chat App Instructions

## Core Features

- User Authentication (Sign up, Login)
- Chat Sessions Management
- Real-time Chat with AI Assistant
- Multi-session Types Support (Text, Mermaid Diagram, SVG Card, Development)
- Expandable Sidebar for Code/Diagram Preview
- Message History & Session Management
- Dark/Light Theme Toggle
- Mobile Responsive Design

## Goals & Objectives

- Create an intuitive and user-friendly chat interface
- Support multiple specialized AI assistants
- Enable real-time visualization of diagrams and code
- Provide seamless session management
- Ensure secure user authentication
- Deliver responsive design for all devices

## Tech Stack & Packages

### Frontend

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui Components
- Lucide Icons
- Mermaid.js (Diagram Rendering)

### Backend

- NextAuth.js (Authentication)
- Drizzle ORM
- PostgreSQL
- OpenAI API Integration
- bcrypt (Password Hashing)
- JWT (Token Management)

### Development Tools

- pnpm
- ESLint
- Prettier
- PostCSS
- TypeScript
- Drizzle Kit

## Project Structure

```
chat-app/
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── chat/             # Chat interface
│   ├── components/       # Reusable components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilities & configurations
│   ├── types/            # TypeScript types
│   └── welcome/          # Landing page
```

## Database Design

### Tables

1. users

   - id: serial (PK)
   - email: varchar
   - password: varchar
   - created_at: timestamp
   - updated_at: timestamp

2. chat_sessions

   - id: uuid (PK)
   - name: text
   - system_prompt: text
   - type: enum
   - created_by: integer (FK)
   - created_at: timestamp
   - updated_at: timestamp

3. chat_messages

   - id: serial (PK)
   - session_id: uuid (FK)
   - messages: jsonb
   - created_at: timestamp
   - updated_at: timestamp

4. system_cmds
   - id: uuid (PK)
   - name: text
   - system_prompt: text
   - type: enum
   - created_at: timestamp
   - updated_at: timestamp

## Landing Page Components

### Desktop Layout

- Side Navigation
  - Logo
  - New Chat Button
  - History Button
  - Feedback Button
  - Settings Button (Theme Toggle, Logout)

### Mobile Layout

- Hamburger Menu
- Collapsible Sidebar
- Responsive Chat Interface

## Color Palette

### Light Theme

```css
--background: 0 0% 100%;
--foreground: 240 10% 3.9%;
--primary: 240 5.9% 10%;
--secondary: 240 4.8% 95.9%;
--accent: 240 4.8% 95.9%;
--muted: 240 4.8% 95.9%;
```

### Dark Theme

```css
--background: 240 10% 3.9%;
--foreground: 0 0% 98%;
--primary: 0 0% 98%;
--secondary: 240 3.7% 15.9%;
--accent: 240 3.7% 15.9%;
--muted: 240 3.7% 15.9%;
```

## Copywriting

### Welcome Messages

- "Welcome to Chat App"
- "Innovate by Zero Code"
- "Your AI Assistant for Text, Diagrams, and Development"

### Button Labels

- "New Chat"
- "History"
- "Settings"
- "Feedback"
- "Light/Dark Mode"
- "Log Out"

### Placeholders

- "Type your message... (Cmd/Ctrl + Enter to send)"
- "Session Name"
- "System Prompt"

### Error Messages

- "Invalid credentials"
- "User already exists"
- "Internal Server Error"
- "Session not found"
