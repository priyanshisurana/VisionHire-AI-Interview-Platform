# VisionHire - Mermaid Diagrams for Presentation

## 1. System Architecture Diagram

```mermaid
graph TB
    subgraph Frontend["Frontend Layer (React + Vite)"]
        A[Home Page] --> B[Login/Register]
        B --> C[Interview Page]
        C --> D[Guidelines Page]
        D --> E[Setup Page]
        E --> F[Interview Start]
        F --> G[Result Page]
        
        H[Services Layer<br/>api.jsx] --> F
        H --> G
        
        I[Browser APIs<br/>Speech Recognition<br/>MediaDevices] --> F
    end
    
    subgraph Backend["Backend Layer (Express.js)"]
        J[Middleware<br/>CORS, JSON, JWT] --> K[Auth Routes]
        J --> L[Interview Routes]
        
        K --> M[Auth Controller<br/>register, login]
        L --> N[Interview Controller<br/>startInterview<br/>sendAnswer<br/>getResult]
    end
    
    subgraph External["External Services"]
        O[(MongoDB<br/>Database)]
        P[Google Gemini AI<br/>Question Generation<br/>Answer Evaluation]
        Q[Cloudinary<br/>File Storage]
    end
    
    F -->|HTTP/REST<br/>JWT Auth| J
    G -->|HTTP/REST<br/>JWT Auth| J
    
    M --> O
    N --> O
    N --> P
    N --> Q
    
    style Frontend fill:#e1f5ff
    style Backend fill:#fff4e1
    style External fill:#ffe1f5
```

## 2. User Flow Diagram

```mermaid
flowchart TD
    Start([User Visits Site]) --> Home[Home Page]
    Home --> Login{User Logged In?}
    Login -->|No| Register[Register Page]
    Login -->|Yes| Interview[Interview Page]
    Register --> Auth[Authentication]
    Auth --> Interview
    
    Interview --> Resume[Upload Resume<br/>Optional]
    Resume --> Guidelines[Guidelines Page]
    Guidelines --> Setup[Setup Page]
    
    Setup --> Camera[Request Camera/Mic<br/>Permissions]
    Camera --> Domain[Select Domain]
    Domain --> StartInterview[Start Interview]
    
    StartInterview --> Q1[Question 1<br/>Timer: 60s]
    Q1 --> Input{Input Method}
    Input -->|Type| TextInput[Text Answer]
    Input -->|Voice| VoiceInput[Voice Recognition]
    
    TextInput --> Submit[Submit Answer]
    VoiceInput --> Submit
    
    Submit --> Evaluate[Backend: Evaluate Answer<br/>via Gemini AI]
    Evaluate --> Score[Get Score 0-5<br/>+ Reason]
    Score --> Check{More Questions?}
    
    Check -->|Yes q < 15| NextQ[Next Question]
    NextQ --> Q1
    
    Check -->|No q >= 15| Complete[Interview Complete]
    Complete --> Result[Result Page]
    
    Result --> Display[Display Results<br/>Total Score<br/>Q&A History<br/>Score Reasons]
    
    style Start fill:#90EE90
    style Complete fill:#FFB6C1
    style Result fill:#87CEEB
```

## 3. Component Structure

```mermaid
graph TD
    App[App.jsx<br/>Root Router] --> Home[Home.jsx]
    App --> Login[Login.jsx]
    App --> Register[Register.jsx]
    App --> Interview[Interview.jsx]
    App --> Guidelines[Guidelines.jsx]
    App --> Setup[Setup.jsx]
    App --> InterviewStart[InterviewStart.jsx]
    App --> Result[Result.jsx]
    
    Home --> Navbar1[Navbar.jsx]
    Login --> Navbar2[Navbar.jsx]
    Register --> Navbar3[Navbar.jsx]
    Interview --> Navbar4[Navbar.jsx]
    Guidelines --> Navbar5[Navbar.jsx]
    Setup --> Navbar6[Navbar.jsx]
    Setup --> CameraHandler[Camera/Mic Handler]
    Setup --> DomainGrid[Domain Selection Grid]
    
    InterviewStart --> Navbar7[Navbar.jsx]
    InterviewStart --> QuestionDisplay[Question Display]
    InterviewStart --> AnswerInput[Answer Input Section]
    InterviewStart --> Timer[Timer Component]
    InterviewStart --> Progress[Progress Bar]
    InterviewStart --> Controls[Control Buttons]
    
    AnswerInput --> Textarea[Textarea<br/>Manual Input]
    AnswerInput --> VoiceRec[Voice Recognition<br/>WebKit API]
    
    Result --> Navbar8[Navbar.jsx]
    Result --> ScoreCard[Score Summary Card]
    Result --> QAList[Q&A History List]
    QAList --> QAItem[Q&A Item<br/>Question, Answer<br/>Score, Reason]
    
    style App fill:#FFE4B5
    style InterviewStart fill:#E0FFFF
    style Result fill:#F0E68C
```

## 4. Data Flow - Interview Process

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant MongoDB
    participant Gemini
    
    User->>Frontend: Click "Start Interview"
    Frontend->>Backend: POST /api/interview/start-stream<br/>{domain, level}
    Backend->>Backend: Verify JWT Token
    Backend->>MongoDB: Create Interview Document
    Backend->>Gemini: Generate Question<br/>(Domain-specific prompt)
    Gemini-->>Backend: Question Text
    Backend->>MongoDB: Save Interview with Question
    Backend-->>Frontend: {interviewId, question, ...}
    Frontend->>Frontend: Store interviewId<br/>Display Question<br/>Start Timer
    
    User->>Frontend: Type/Speak Answer
    Frontend->>Frontend: Voice Recognition<br/>(if enabled)
    User->>Frontend: Click "Next"
    Frontend->>Backend: POST /api/interview/sendAnswer<br/>{interviewId, answer, question}
    Backend->>Backend: Verify JWT Token
    Backend->>MongoDB: Find Interview
    Backend->>Gemini: Evaluate Answer<br/>(Evaluation prompt)
    Gemini-->>Backend: {score, reason, keywords}
    Backend->>MongoDB: Update Interview History<br/>{question, answer, score, reason}
    
    alt Interview Not Complete
        Backend->>Gemini: Generate Next Question
        Gemini-->>Backend: Next Question
        Backend-->>Frontend: {score, reason, question, finished: false}
        Frontend->>Frontend: Display Score<br/>Show Next Question<br/>Reset Timer
    else Interview Complete
        Backend-->>Frontend: {score, reason, finished: true}
        Frontend->>Frontend: Navigate to /result
        Frontend->>Backend: GET /api/interview/:interviewId
        Backend->>MongoDB: Fetch Interview Data
        Backend->>Backend: Calculate Total Score
        Backend-->>Frontend: {totalScore, history, ...}
        Frontend->>Frontend: Display Results
    end
```

## 5. API Architecture

```mermaid
graph LR
    subgraph Auth["Authentication APIs"]
        A1[POST /api/auth/register<br/>Register User] --> A2[Auth Controller<br/>register]
        A3[POST /api/auth/login<br/>Login User] --> A4[Auth Controller<br/>login]
        A2 --> A5[(MongoDB<br/>Users)]
        A4 --> A5
    end
    
    subgraph Interview["Interview APIs"]
        I1[GET /api/interview/ping<br/>Health Check] --> I2[No Auth Required]
        I3[POST /api/interview/start-stream<br/>Start Interview] --> I4[Interview Controller<br/>startInterviewStream]
        I5[POST /api/interview/sendAnswer-stream<br/>Submit Answer] --> I6[Interview Controller<br/>sendAnswerStream]
        I7[GET /api/interview/:interviewId<br/>Get Results] --> I8[Interview Controller<br/>getInterviewResult]
        
        I4 --> I9[(MongoDB<br/>Interviews)]
        I6 --> I9
        I8 --> I9
        
        I4 --> I10[Gemini AI<br/>Question Generation]
        I6 --> I11[Gemini AI<br/>Answer Evaluation]
    end
    
    style Auth fill:#E6F3FF
    style Interview fill:#FFF4E6
```

## 6. Database Schema

```mermaid
erDiagram
    USER ||--o{ INTERVIEW : has
    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        date createdAt
        date updatedAt
    }
    INTERVIEW {
        ObjectId _id PK
        ObjectId userId FK
        array history
        object metadata
        date createdAt
        date updatedAt
    }
    HISTORY_ENTRY {
        string question
        string answer
        number score
        number maxScore
        string scoreReason
        date timestamp
    }
    METADATA {
        string level
        string domain
        number maxQuestions
    }
    
    INTERVIEW ||--o{ HISTORY_ENTRY : contains
    INTERVIEW ||--|| METADATA : has
```

## 7. Security Flow

```mermaid
flowchart TD
    User[User] --> Login[Login Request]
    Login --> Validate[Validate Credentials]
    Validate -->|Valid| Generate[Generate JWT Token]
    Validate -->|Invalid| Error[Return Error]
    Generate --> Store[Store Token in localStorage]
    
    Store --> Request[Make API Request]
    Request --> Header[Add Authorization Header<br/>Bearer token]
    Header --> Middleware[Auth Middleware]
    
    Middleware --> Extract[Extract Token]
    Extract --> Verify[Verify Token Signature]
    Verify -->|Valid| CheckExp[Check Expiration]
    Verify -->|Invalid| Unauthorized[401 Unauthorized]
    
    CheckExp -->|Not Expired| Attach[Attach User ID to req.user]
    CheckExp -->|Expired| Unauthorized
    
    Attach --> Controller[Controller Logic]
    Controller --> Resource[Check Resource Ownership]
    Resource -->|Owned| Allow[Allow Access]
    Resource -->|Not Owned| Forbidden[403 Forbidden]
    
    style Generate fill:#90EE90
    style Allow fill:#87CEEB
    style Unauthorized fill:#FFB6C1
    style Forbidden fill:#FFB6C1
```

## 8. AI Integration Flow

```mermaid
flowchart LR
    subgraph QuestionGen["Question Generation"]
        Q1[Interview Start] --> Q2[Build Prompt<br/>Domain + Level + Context]
        Q2 --> Q3[Call Gemini API]
        Q3 --> Q4[Receive Question]
        Q4 --> Q5[Store in MongoDB]
    end
    
    subgraph AnswerEval["Answer Evaluation"]
        A1[Answer Submitted] --> A2[Build Evaluation Prompt<br/>Question + Answer]
        A2 --> A3[Call Gemini API]
        A3 --> A4[Parse JSON Response<br/>score, reason, keywords]
        A4 --> A5[Normalize Score<br/>0-5 range]
        A5 --> A6[Store in History]
    end
    
    subgraph RateLimit["Rate Limiting"]
        R1[API Call Request] --> R2{Wait Period<br/>Elapsed?}
        R2 -->|No| R3[Wait 1.5s]
        R3 --> R2
        R2 -->|Yes| R4[Execute API Call]
        R4 --> R5[Update Last Call Time]
    end
    
    Q3 -.->|Throttled| RateLimit
    A3 -.->|Throttled| RateLimit
    
    style QuestionGen fill:#E6F3FF
    style AnswerEval fill:#FFF4E6
    style RateLimit fill:#FFE6F3
```

## 9. Interview Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Registration: New User
    Registration --> Login: Account Created
    Login --> Authenticated: Credentials Valid
    Authenticated --> ResumeUpload: Navigate to Interview
    ResumeUpload --> Guidelines: Resume Uploaded/Optional
    Guidelines --> Setup: Read Instructions
    Setup --> DomainSelection: Camera/Mic Ready
    DomainSelection --> InterviewStart: Domain Selected
    InterviewStart --> QuestionDisplay: Interview Started
    QuestionDisplay --> AnswerInput: Question Shown
    AnswerInput --> AnswerSubmitted: User Submits
    AnswerSubmitted --> Evaluation: Answer Sent to Backend
    Evaluation --> Scored: Gemini Evaluates
    Scored --> CheckComplete: Score Stored
    CheckComplete --> QuestionDisplay: More Questions
    CheckComplete --> InterviewComplete: All Questions Done
    InterviewComplete --> Results: Navigate to Results
    Results --> [*]: Results Displayed
```

## 10. Technology Stack Overview

```mermaid
mindmap
  root((VisionHire))
    Frontend
      React 19
      Vite 7
      React Router DOM
      CSS3 Glassmorphism
      WebKit Speech Recognition
      MediaDevices API
    Backend
      Node.js
      Express.js 5
      JWT Authentication
      bcrypt
      CORS
    Database
      MongoDB 6
      Mongoose 8
      User Model
      Interview Model
    AI Services
      Google Gemini AI
      Question Generation
      Answer Evaluation
      Score Assignment
    Development
      npm
      Nodemon
      ESLint
      Vite Dev Server
```

---

## How to Convert to Images

### Option 1: Mermaid Live Editor (Recommended)
1. Go to https://mermaid.live
2. Copy any diagram code (between ```mermaid and ```)
3. Paste into the editor
4. Click "Actions" → "Download PNG" or "Download SVG"

### Option 2: VS Code Extension
1. Install "Markdown Preview Mermaid Support" extension
2. Open this file in VS Code
3. Right-click on the preview → "Export as PNG/SVG"

### Option 3: Online Converters
- https://mermaid.ink (for direct image URLs)
- https://kroki.io (supports Mermaid)

### Option 4: Command Line (if you have Node.js)
```bash
npm install -g @mermaid-js/mermaid-cli
mmdc -i DIAGRAMS_MERMAID.md -o output.png
```

---

**Note**: Each diagram above can be copied individually and converted to an image. The diagrams are optimized for presentation use with clear labels and professional styling.

