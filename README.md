# Yapper Frontend

A production-grade, enterprise-scale social media platform frontend built with Nuxt 4. Yapper delivers a Twitter-like experience with sophisticated architecture, real-time capabilities, and comprehensive feature modules following industry-leading design patterns and best practices.

**[Live Demo](https://yapper.cmp27.space/auth)** - Experience it live!

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture & Design Patterns](#architecture--design-patterns)
- [Tech Stack](#tech-stack)
- [System Design](#system-design)
- [Project Structure](#project-structure)
- [Module Architecture](#module-architecture)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Related Repositories](#related-repositories)
- [Contributors](#contributors)
- [License](#license)

## Overview

Yapper Frontend is an enterprise-level social media application that showcases modern frontend architecture and engineering excellence. Built as a scalable, maintainable, and performant solution, it implements advanced design patterns and follows domain-driven design principles to handle complex business logic and user interactions.

### Key Highlights

- **Enterprise-Scale Architecture** - Modular, scalable design supporting rapid feature development
- **Feature-Driven Development** - Domain-driven modular organization
- **Advanced State Management** - Multi-layer state handling with global and module-specific stores
- **Performance Optimized** - Lazy loading, code splitting, and optimistic updates
- **Type-Safe** - Full TypeScript implementation for reliability
- **Accessible** - WCAG compliant with responsive design
- **Production Ready** - Docker support, CI/CD ready, and monitoring integrated

## Features

### Core Functionality
- **Authentication & Authorization** - Secure user authentication with reCAPTCHA integration
- **Tweet Management** - Create, edit, delete, like, and retweet posts with rich media
- **Real-time Chat** - Instant messaging powered by Socket.IO
- **Live Notifications** - Real-time notification system with WebSocket integration
- **User Profiles** - Comprehensive user profiles with customizable themes
- **Advanced Search** - Full-text search across users, tweets, and hashtags
- **Bookmarks System** - Save and organize favorite content
- **Internationalization** - Multi-language support (English & Arabic)
- **Responsive Design** - Mobile-first, fully responsive UI across all devices
- **Theming System** - Dynamic theme customization

### Advanced Features
- **Media Management** - Image and video uploads with optimized delivery
- **Rich Content** - Emoji picker, mentions, hashtags, and URL parsing
- **Infinite Scrolling** - Virtualized lists with pagination
- **Media Lightbox** - Full-screen media viewer with gestures
- **Video Streaming** - Integrated video player with controls
- **Optimistic UI** - Instant feedback with automatic rollback on errors
- **Analytics Ready** - Event tracking and user behavior monitoring
- **Security First** - XSS protection, CSRF tokens, and secure headers

## Architecture & Design Patterns

Yapper Frontend implements a sophisticated architectural approach combining multiple enterprise design patterns:

### Service Registry Pattern
A centralized service registry manages all API interactions, providing:
- **Dependency Injection** - Services are registered and injected where needed
- **Single Responsibility** - Each service handles one domain of business logic
- **Testability** - Easy mocking and testing of service layer
- **Reusability** - Services shared across modules without duplication

### Query & Mutation Layer (Data Access Pattern)
Implements TanStack Query for sophisticated data management:
- **Caching Strategy** - Intelligent cache invalidation and updates
- **Optimistic Updates** - Immediate UI feedback with automatic rollback
- **Background Refetching** - Keeps data fresh automatically
- **Request Deduplication** - Prevents unnecessary network calls
- **Error Handling** - Centralized error management and retry logic

### Global State Management
Multi-tier state architecture using Pinia:
- **Global Store** - Application-wide state (auth, theme, settings)
- **Module Stores** - Feature-specific state management
- **Computed State** - Derived state with automatic reactivity
- **Persistence** - State hydration and persistence strategies
- **DevTools Integration** - Full debugging capabilities

### Feature-Driven (Domain-Driven) Design
Modular architecture organized by business domains:
- **Module Autonomy** - Self-contained feature modules
- **Clear Boundaries** - Well-defined interfaces between modules
- **Shared Kernel** - Common utilities and components
- **Scalability** - Easy to add new features without affecting existing code
- **Team Collaboration** - Multiple teams can work on different modules

### Layered Architecture
Clean separation of concerns across layers:

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│     (Views, Components, Composables)    │
├─────────────────────────────────────────┤
│          Application Layer              │
│        (Stores, State Management)       │
├─────────────────────────────────────────┤
│            Domain Layer                 │
│      (Business Logic, Services)         │
├─────────────────────────────────────────┤
│         Infrastructure Layer            │
│    (API Clients, Query Layer, Utils)    │
└─────────────────────────────────────────┘
```

### Additional Patterns
- **Repository Pattern** - Abstraction over data sources
- **Factory Pattern** - Dynamic component and service creation
- **Observer Pattern** - Event-driven communication via Socket.IO
- **Facade Pattern** - Simplified interfaces for complex subsystems
- **Singleton Pattern** - Single instance services and utilities
- **Strategy Pattern** - Pluggable algorithms for sorting, filtering, etc.
- **Decorator Pattern** - Middleware for API calls and route guards

## Tech Stack

### Core Framework
- **[Nuxt 4](https://nuxt.com/)** - The intuitive Vue framework for production
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework with Composition API
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development environment

### UI & Styling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide Icons](https://lucide.dev/)** - Beautiful, consistent icon library
- **[Swiper](https://swiperjs.com/)** - Modern mobile-first slider component

### State & Data Management
- **[Pinia](https://pinia.vuejs.org/)** - Intuitive, type-safe Vue store
- **[TanStack Query (Vue Query)](https://tanstack.com/query)** - Powerful asynchronous state management
- **[Axios](https://axios-http.com/)** - Promise-based HTTP client with interceptors

### Real-time Features
- **[Socket.IO Client](https://socket.io/)** - Real-time bidirectional event-based communication

### Form & Validation
- **[VeeValidate](https://vee-validate.logaretm.com/)** - Form validation library
- **[Yup](https://github.com/jquense/yup)** - Schema validation

### Development & Testing
- **[Vitest](https://vitest.dev/)** - Next generation testing framework
- **[Testing Library](https://testing-library.com/)** - Simple testing utilities
- **[ESLint](https://eslint.org/)** - Pluggable linting utility
- **[Prettier](https://prettier.io/)** - Opinionated code formatter
- **[Commitlint](https://commitlint.js.org/)** - Lint commit messages
- **[Husky](https://typicode.github.io/husky/)** - Git hooks made easy
- **[SonarQube](https://www.sonarqube.org/)** - Code quality and security scanner

### Additional Libraries
- **[@nuxtjs/i18n](https://i18n.nuxtjs.org/)** - Internationalization module
- **[Day.js](https://day.js.org/)** - Lightweight date manipulation
- **[Twitter Text](https://github.com/twitter/twitter-text)** - Tweet text processing
- **[reCAPTCHA](https://www.google.com/recaptcha/)** - Bot protection
- **[vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)** - Efficient list rendering

### DevOps & Deployment
- **[Docker](https://www.docker.com/)** - Containerization platform
- **[Nginx](https://nginx.org/)** - High-performance web server
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD automation

## System Design

The architecture diagram above illustrates the comprehensive system design:

### Key Architectural Components

**Commons Layer**
- **Global Store** - Application-wide state management
- **General Components** - Reusable UI components
- **Services & Utils** - Shared business logic and utilities
- **Types** - TypeScript type definitions and interfaces

**Module Architecture**
- **Views** - Page-level components and routing
- **High-order Components** - Smart components with business logic
- **Sub Components** - Presentational components
- **Module Store** - Feature-specific state management

**Backend Integration**
- **Services Layer** - Business logic and API abstraction
- **Query Layer** - Data fetching, caching, and synchronization

For detailed information about system architecture, module interactions, and data flow, refer to the [System Modules Diagrams PDF](./System%20Modules%20Diagrams.pdf).

## Project Structure

```
yapper-frontend/
├── app/
│   ├── modules/              # Feature modules (domain-driven)
│   │   ├── auth/            # Authentication module
│   │   │   ├── components/  # Module-specific components
│   │   │   ├── composables/ # Reusable composition functions
│   │   │   ├── queries/     # TanStack Query hooks
│   │   │   ├── services/    # API service layer
│   │   │   ├── stores/      # Pinia stores
│   │   │   ├── types/       # TypeScript definitions
│   │   │   └── views/       # Page components
│   │   ├── chat/            # Real-time messaging module
│   │   ├── timeline/        # Tweet feed module
│   │   ├── profile/         # User profile module
│   │   ├── notifications/   # Notification module
│   │   ├── search/          # Search & explore module
│   │   └── bookmarks/       # Bookmarks module
│   ├── pages/               # Nuxt pages (routing)
│   ├── layouts/             # Layout components
│   ├── components/          # Global shared components
│   ├── composables/         # Global composition functions
│   ├── plugins/             # Nuxt plugins
│   ├── middleware/          # Route middleware
│   ├── assets/              # Static assets
│   │   ├── css/            # Global styles
│   │   └── images/         # Images
│   └── lib/                 # Core utilities
│       ├── api/            # API client configuration
│       ├── utils/          # Helper functions
│       └── constants/      # Application constants
├── i18n/                    # Internationalization
│   ├── locales/            # Translation files
│   └── config.ts           # i18n configuration
├── docker/                  # Docker configuration
│   ├── Dockerfile
│   └── nginx.conf
├── tests/                   # Test files
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── e2e/                # End-to-end tests
├── public/                  # Public static files
├── nuxt.config.ts          # Nuxt configuration
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## Module Architecture

Each feature module follows a consistent structure ensuring maintainability and scalability:

### Module Structure Template
```
module-name/
├── components/           # UI components specific to this module
│   ├── ModuleComponent.vue
│   └── NestedComponent.vue
├── composables/         # Composition API logic
│   ├── useModuleFeature.ts
│   └── useModuleState.ts
├── queries/             # TanStack Query definitions
│   ├── useModuleQuery.ts
│   ├── useModuleMutation.ts
│   └── queryKeys.ts
├── services/            # Business logic and API calls
│   ├── moduleService.ts
│   └── moduleApi.ts
├── stores/              # Pinia state management
│   └── moduleStore.ts
├── types/               # TypeScript interfaces
│   ├── module.types.ts
│   └── module.interfaces.ts
├── views/               # Page-level components
│   └── ModuleView.vue
├── utils/               # Module-specific utilities
│   └── moduleHelpers.ts
└── index.ts             # Module exports
```

### Module Responsibilities

**Services Layer**
- API communication
- Business logic implementation
- Data transformation
- Error handling

**Queries Layer**
- Data fetching with caching
- Optimistic updates
- Background synchronization
- Query invalidation strategies

**Stores Layer**
- Module-specific state
- Computed properties
- Actions and mutations
- State persistence

**Composables**
- Reusable reactive logic
- Component lifecycle management
- Event handling
- UI state management

**Components**
- Presentational logic
- User interactions
- Accessibility features
- Responsive behavior

**Views**
- Page-level orchestration
- Route management
- Layout composition
- Data loading coordination

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or yarn 1.22.x
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/yapper-frontend.git

# Navigate to project directory
cd yapper-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run dev
```

### Environment Variables

```env
# API Configuration
NUXT_PUBLIC_API_BASE_URL=https://api.yapper.example.com
NUXT_PUBLIC_SOCKET_URL=wss://socket.yapper.example.com

# Authentication
NUXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key

# Feature Flags
NUXT_PUBLIC_ENABLE_ANALYTICS=true
NUXT_PUBLIC_ENABLE_MOCK_SERVER=false
```

## Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run dev:mock         # Start with mock API server

# Building
npm run build            # Build for production
npm run generate         # Generate static site
npm run preview          # Preview production build

# Testing
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run end-to-end tests

# Code Quality
npm run lint             # Lint code
npm run lint:fix         # Fix linting errors
npm run format           # Format code with Prettier
npm run type-check       # Check TypeScript types

# Analysis
npm run analyze          # Analyze bundle size
npm run sonar            # Run SonarQube analysis
```

## Testing

Comprehensive testing strategy covering multiple levels:

### Unit Tests
```bash
npm run test
```
- Component testing with Vue Test Utils
- Service layer testing
- Store testing with Pinia Testing
- Utility function testing

### Integration Tests
```bash
npm run test:integration
```
- Module interaction testing
- API integration testing
- State management flow testing

### End-to-End Tests
```bash
npm run test:e2e
```
- Complete user journey testing
- Cross-browser testing
- Accessibility testing

### Coverage Reports
```bash
npm run test:coverage
```
Target: >80% code coverage across all modules

## Related Repositories

This frontend application is part of a larger ecosystem:

### Cross-Platform Mobile App
> **Repository:** Coming Soon
> 
> Native mobile applications built with React Native for iOS and Android platforms, sharing the same backend infrastructure.

### Backend API
> **Repository:** Coming Soon
> 
> RESTful API and WebSocket server built with Node.js/Nest.js, providing authentication, data persistence, real-time communication, and business logic for all client applications.

### Full System Architecture
The complete Yapper platform consists of:
- **Frontend Web App** (This repository) - Nuxt 4 web application
- **Mobile Apps** - iOS and Android applications
- **Backend API** - Node.js REST API and WebSocket server
- **Database** - PostgreSQL for data persistence
- **Redis** - Caching and session management
- **CDN** - Media storage and delivery
- **Monitoring** - Application performance monitoring

## Team

| Name | Role | GitHub | LinkedIn |
|------|------|--------|----------|
| Ali Alaa | Frontend Developer| [@AliAlaa88](https://github.com/AliAlaa88) | [Profile](https://www.linkedin.com/in/alieldin-alaa/) |
| Amr Hany | Frontend Developer | [@Amrhanysayed](https://github.com/Amrhanysayed) | [Profile](https://www.linkedin.com/in/amr-hany-61b544267/) |
| Abdallah Ahmed | Frontend Developer | [@Safan05](https://github.com/Safan05) | [Profile](https://www.linkedin.com/in/abdallah-safan-021483278) |
| Abdelrahman Medhat Saber | Frontend Developer | [@bedosaber77](https://github.com/bedosaber77) | [Profile](https://www.linkedin.com/in/abdelrahmanmedhat77) |
| Hagar Abdelsalam | Frontend Developer | [@hagar3bdelsalam](https://github.com/hagar3bdelsalam) | [Profile](https://www.linkedin.com/in/hagar-abdelsalam-818932282/) |
| Esraa Hassan | QA Engineer | [@Esraa-Hassan0](https://github.com/Esraa-Hassan0) | [Profile](https://www.linkedin.com/in/esraa-hassan-rajaa/) |


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by the Yapper Team**

For questions, issues, or contributions, please visit our [GitHub Issues](https://github.com/yourusername/yapper-frontend/issues) page.
