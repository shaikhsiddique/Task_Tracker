# Task Tracker - MERN Stack Website

Task Tracker is a full-featured MERN stack application designed to streamline personal task management and enhance team collaboration with real-time chat, video calls, email notifications, and AI-powered assistance.

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
- [Download](#download)

## Authentication

### Login & Signup
Users can register and log in securely using email and password, with authentication managed via JWT tokens.

## Task Management

### Create Task
Users can create tasks with details like title, description, due date, and priority.

### Search Task
A search feature lets users quickly find tasks based on keywords, status, or deadlines.

### Display Personal Tasks
Tasks are presented on a personal dashboard, enabling users to view and manage their to-do lists.

### Assign Task
Tasks can be delegated to other workspace members for better workload distribution.

### Task Completion & Deadline Notifications
- **Completion:** Mark tasks as complete by clicking a circle; a filled circle indicates completion, while an outlined circle shows pending status.
- **Deadline Notifications:** Email reminders and in-app notifications keep users informed about upcoming deadlines.

## Workspace Management

### Creating a Workspace
When a user creates a workspace, they automatically become its admin, gaining full control over workspace settings.

### Editing & Joining Workspaces
Admins can edit workspace details. To join a workspace, either the admin sends an invitation (which the user must accept) or the user sends a join request (which the admin must approve).

### Adding Members
Admins add members by sending requests; the targeted user receives an in-app notification to accept the invite. Similarly, when a user requests to join, a notification is sent to the admin for approval.

## Collaboration

Within a workspace, users can:
- **Chat:** Engage in real-time conversations.
- **Assign Tasks:** Delegate tasks to colleagues.
- **Video Calls:** Initiate video calls for face-to-face collaboration.

## AI Integration
Workspace chat supports AI assistance. When a message is prefixed with `@ai`, it is directed to the AI, which responds with `@ai` and the sender’s username.

## Account Overview & Productivity
The account page displays:
- Personal details
- Total tasks, assigned tasks, completed tasks, and tasks with met deadlines
- A productivity score (starting at 1000) that updates based on task performance

## Download
You can download the complete Task Tracker repository from the following link:  
[Download Task Tracker](https://github.com/username/task-tracker)
