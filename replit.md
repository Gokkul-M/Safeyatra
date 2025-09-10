# Overview

SafeYatra is an AI-powered safety system designed for the Simhastha 2028 pilgrimage event. This MERN stack web application provides comprehensive emergency response and crowd monitoring capabilities through two distinct portals: a Pilgrim App for attendees and a Command Center for emergency response teams. The system integrates real-time crowd density monitoring, emergency alert management, drone surveillance coordination, and inter-team communication to ensure pilgrim safety during the sacred gathering.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application uses React with TypeScript as the primary frontend framework, leveraging Wouter for client-side routing instead of React Router. The UI is built with shadcn/ui components and styled using Tailwind CSS with a custom design system. State management is handled through React Query for server state and React Context for authentication state. The application follows a component-based architecture with clear separation between pilgrim and command center interfaces.

## Backend Architecture
The server is built using Express.js with TypeScript in ESM format. The application uses a custom storage interface pattern to abstract database operations, allowing for flexible backend implementations. The server handles authentication via OTP verification, manages real-time alerts, and provides REST APIs for both pilgrim and command center functionalities. Routes are organized by user type (pilgrim vs. admin) with appropriate access controls.

## Data Storage Solutions
The application uses a hybrid approach with both PostgreSQL (via Neon) and Firebase Realtime Database. PostgreSQL handles structured data like user accounts, alerts, and lost-and-found reports through Drizzle ORM, while Firebase Realtime Database manages real-time features like communication feeds and live heatmap updates. This dual-database approach optimizes for both data consistency and real-time performance.

## Authentication and Authorization
Authentication is implemented using OTP (One-Time Password) verification sent via SMS/email. The system supports role-based access with distinct user types: pilgrims, administrators, police, medical staff, and coordinators. Sessions are managed through local storage with JWT-like user objects. Each role has specific dashboard views and API access permissions based on their responsibilities in the emergency response hierarchy.

## External Dependencies
Firebase integration provides real-time database capabilities and authentication services. The system uses Neon as the PostgreSQL provider for primary data storage. Frontend dependencies include comprehensive Radix UI components through shadcn/ui, React Query for API state management, and various utility libraries for form handling and date operations. The build process uses Vite for development and production bundling with custom Replit integration plugins.