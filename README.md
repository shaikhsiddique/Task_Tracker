
# Task Tracker - MERN Stack Application

Task Tracker is a full-featured MERN stack application that streamlines personal task management and enhances team collaboration with real-time chat, video calls, email notifications, and AI-powered assistance.
<br>
### 🖥️ Home Page (Desktop View)

![Screenshot](https://firebasestorage.googleapis.com/v0/b/ecommerce-ab165.appspot.com/o/Screenshot%202025-04-05%20232047.png?alt=media&token=e6372f9b-7ad4-402d-8280-49b2f47042ba)

---

### 📱 Home Page (Mobile View)

![Screenshot](https://firebasestorage.googleapis.com/v0/b/ecommerce-ab165.appspot.com/o/Screenshot%202025-04-05%20233319.png?alt=media&token=5e503793-ccba-4021-95ca-75544a7cdaf7)


## Live Demo
Access the live demo here: [https://task-tracker-cyan-alpha.vercel.app/](https://task-tracker-cyan-alpha.vercel.app/)

## Table of Contents
- [Authentication](#authentication)
  - [Login & Signup](#login--signup)
- [Task Management](#task-management)
  - [Create Task](#create-task)
  - [Search Task](#search-task)
  - [Display Personal Tasks](#display-personal-tasks)
  - [Assign Task](#assign-task)
  - [Task Completion & Deadline Notifications](#task-completion--deadline-notifications)
- [Workspace Management](#workspace-management)
  - [Creating a Workspace](#creating-a-workspace)
  - [Editing & Joining Workspaces](#editing--joining-workspaces)
  - [Adding Members](#adding-members)
- [Collaboration](#collaboration)
- [AI Integration](#ai-integration)
- [Account Overview & Productivity](#account-overview--productivity)
- [Tutorial / Guide](#tutorial--guide)
- [Download](#download)

## Authentication

### Login & Signup
Users can securely register and log in using their email and password. Authentication is managed via JWT tokens.

### 🔐 Forgot Password

If a user forgets their password, they can easily reset it by following these steps:

1. **Click "Forgot Password"**  
   On the login page, click the **"Forgot Password?"** option below the login form.

2. **Enter Email or Phone Number**  
   You'll be prompted to enter your registered **email** or **phone number**.

3. **Receive OTP**  
   An **OTP (One-Time Password)** will be sent to your email or phone.

4. **Verify OTP**  
   Enter the OTP on the verification screen to proceed.

5. **Reset Password**  
   Once verified, you'll be able to set a **new password**.  
   After resetting, use the new password to log in.

## Task Management

### Create Task
Users can create tasks by providing details such as title, description, due date, and priority.

### Search Task
A search feature allows users to quickly find tasks using keywords, status, or deadlines.

### Display Personal Tasks
All tasks are displayed on a personal dashboard, enabling users to manage their to-do lists efficiently.

### Assign Task
Tasks can be delegated to other workspace members, allowing for better workload distribution.

### Task Completion & Deadline Notifications
- **Task Completion:**  
  Mark tasks as complete by clicking the task circle. A filled circle indicates completion, while an outlined circle shows a pending task.
- **Deadline Notifications:**  
  Receive email reminders and in-app notifications about approaching deadlines.

## Workspace Management

### Creating a Workspace
When a user creates a workspace, they automatically become its admin, gaining full control over workspace settings.

### Editing & Joining Workspaces
- **Editing:**  
  Admins can edit workspace details.
- **Joining:**  
  To join a workspace, the admin sends an invitation or the user sends a join request. Notifications are sent to the appropriate party for acceptance.

### Adding Members
Admins can add members by sending requests. The targeted user receives an in-app notification to accept the invite. Similarly, when a user requests to join a workspace, a notification is sent to the admin for approval.
![Screenshot](https://firebasestorage.googleapis.com/v0/b/ecommerce-ab165.appspot.com/o/Screenshot%202025-04-05%20233240.png?alt=media&token=cc049cb2-2fe4-4332-9197-a13e5ec3ef18)


## Collaboration

Within a workspace, users can:
- **Chat:**  
  Engage in real-time text-based communication.
- **Assign Tasks:**  
  Delegate tasks to colleagues directly.
- **Video Calls:**  
  Initiate video calls for live collaboration and meetings.

## AI Integration

The workspace chat includes AI integration. If a message is prefixed with `@ai`, it is directed to the AI, which responds with `@ai` and the sender’s username.
<br>
![Screenshot](https://firebasestorage.googleapis.com/v0/b/ecommerce-ab165.appspot.com/o/Screenshot%202025-04-05%20234248.png?alt=media&token=590deed5-d135-4026-a413-520fa8a7b3f1)

## Account Overview & Productivity

The account page displays:
- Personal details (e.g., username, email, profile image)
- A summary of tasks: total tasks, assigned tasks, completed tasks, and tasks with met deadlines
- A productivity score (starting at 1000) that adjusts based on task performance

![Screenshot](https://firebasestorage.googleapis.com/v0/b/ecommerce-ab165.appspot.com/o/Screenshot%202025-04-05%20233136.png?alt=media&token=e556a95d-c246-4511-8c2d-8ad1970fb907)


## Tutorial / Guide

### Getting Started
1. **Clone the Repository:**  
   ```bash
   git clone https://github.com/username/task-tracker.git
   ```
2. **Install Dependencies:**  
   Navigate to the project directory and run:
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**  
   Create a `.env` file in the root directory with your configurations (e.g., MongoDB URI, JWT secret).
4. **Run the Application:**  
   Start the server with:
   ```bash
   npm start
   ```
5. **Access the Application:**  
   Open your browser and navigate to [https://task-tracker-cyan-alpha.vercel.app/](https://task-tracker-cyan-alpha.vercel.app/)

### Using the Application
- **Signup & Onboarding:**  
  Sign up by providing your username, unique email, phone number, and password. Once registered, set up your profile and explore your dashboard.
- **Task Operations:**  
  Create new tasks, search through existing ones, assign tasks to colleagues, and mark them as complete by clicking on the task icon.
- **Workspace Collaboration:**  
  Create a workspace to start collaborating. Invite members, accept join requests, and use chat and video call features to communicate in real time.
- **AI Chat Feature:**  
  Use `@ai` in the chat to interact with the AI assistant. The assistant will respond accordingly, adding an extra layer of support within your workspace.

## Download

Clone the repository to get started with Task Tracker:
```bash
git clone https://github.com/shaikhsiddique/Task_Tracker
```

Alternatively, download it directly from GitHub: [Download Task Tracker](https://github.com/shaikhsiddique/Task_Tracker)
