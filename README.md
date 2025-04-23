# 🌟 CrewSpace | B2B Teams Project Management SaaS

## 🚀 Project Overview

**CrewSpace** is a B2B team-based project management application built with the MERN stack and TypeScript. It allows teams to collaborate efficiently by organizing workspaces, projects, and tasks with robust user authentication and intuitive UI.

## ✨ Key Features

### Authentication & Security

- 🔐 **Multi-provider Authentication** - Google Sign-In, Email + Password
- 🔒 **Secure Session Management** - HTTP-only cookies with proper expiration
- 🚪 **Session Termination** - Robust logout functionality

### Organization & Workspaces

- 🏢 **Multi-tenancy Architecture** - Create and manage separate workspaces
- 👥 **Team Collaboration** - Invite members with customizable roles
- 🛡️ **Role-Based Permissions** - Owner, Admin, and Member role hierarchies

### Project Management

- 📊 **Projects & Epics** - Organize work with hierarchical structures
- ✅ **Task Management** - CRUD operations with status tracking
- 🔄 **Task Workflows** - Custom status, priority, and assignee management

### User Experience

- 🔍 **Advanced Filtering** - Filter by status, priority, assignee
- 📱 **Responsive Design** - Optimized for all device sizes
- 📈 **Analytics Dashboard** - Visual insights into project progress
- 📃 **Pagination & Data Loading** - Efficient resource management

### Developer Experience

- 💾 **Mongoose Transactions** - Ensures data integrity
- 🌱 **Data Seeding** - Quick setup with test data
- 🧪 **Type Safety** - End-to-end TypeScript implementation

## 🛠️ Technology Stack

### Frontend

- **React 18** - Latest React with hooks for state management
- **TypeScript** - Type-safe codebase
- **TailwindCSS** - Utility-first CSS framework
- **Shadcn UI** - Beautiful component library
- **Vite.js** - Lightning-fast build tool
- **React Router** - Client-side routing

### Backend

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Google OAuth** - Authentication integration
- **Redis to store express-session** - Secure authentication

## 📋 Installation & Setup (without Docker)

- Clone the Repository:

     ```bash
     git clone https://github.com/VishalChaudhary01/crew-space.git
     ```

- Navigate to project directory

     ```bash
     cd crew-space
     ```

### 🔧 Backend Setup

  - Navigate to the server directory:

     ```bash
     cd server
     ```

  - Install dependencies:

     ```bash
     npm install
     ```

  - Setup environment variables:

     ```bash
     cp .env.example .env
     ```

  - Fill in the required environment variables in the .env file.

  - Seed Roles:

     ```bash
     npm run seed:role
     ```

  - Run Backend Server:

     ```bash
     npm run dev
     ```

### 💻 Frontend Setup

  - Navigate to the client directory:

     ```bash
     cd client
     ```

  - Install dependencies:

     ```bash
     npm install
     ```

  - Setup environment variables:

     ```bash
     cp .env.example .env
     ```

  - Fill in the required environment variables in the .env file.

  - Run Frontend

     ```bash
     npm run dev
     ```

### Visit the application in your browser:

Open your browser and navigate to http://localhost:5173.

## 🔮 Future Enhancements

- 📊 **Gantt Charts** - Visual timeline for project planning
- 🔔 **Notifications** - Real-time updates for team activities
- 📱 **Mobile Application** - Native mobile experience

## 👨‍💻 About the Developer

CrewSpace is developed as part of my professional portfolio to demonstrate full-stack development capabilities. The project highlights my ability to architect complex systems, implement robust authentication flows, design intuitive user interfaces, and build scalable backend services.
