# Yapper Frontend

A modern, feature-rich social media platform frontend built with Nuxt 3 and Vue 3. Yapper provides a Twitter-like experience with real-time messaging, notifications, and a fully responsive interface.

🌐 **[Live Demo](https://yapper.cmp27.space/auth)** - Try it now!

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [System Design](#system-design)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Contributors](#contributors)
- [License](#license)

## ✨ Features

### Core Functionality
- 🔐 **Authentication & Authorization** - Secure user authentication with reCAPTCHA integration
- 📝 **Tweet Management** - Create, edit, delete, like, and retweet posts
- 💬 **Real-time Chat** - Instant messaging with Socket.IO
- 🔔 **Live Notifications** - Real-time notification system
- 👤 **User Profiles** - Customizable user profiles with cover images and bio
- 🔍 **Search & Explore** - Discover users, tweets, and trending topics
- 🔖 **Bookmarks** - Save and organize favorite tweets
- 🌐 **Internationalization** - Multi-language support (English & Arabic)
- 📱 **Responsive Design** - Mobile-first, fully responsive UI
- 🎨 **Theme Support** - Customizable display settings

### Advanced Features
- 📷 **Media Support** - Image and video uploads with lazy loading
- 😀 **Emoji Picker** - Rich emoji support in tweets and messages
- ♾️ **Infinite Scrolling** - Smooth, paginated content loading
- 🖼️ **Media Lightbox** - Full-screen media viewing
- 🎬 **Video Player** - Integrated video playback
- 🔄 **State Management** - Efficient state handling with Pinia
- ⚡ **Optimistic Updates** - Instant UI feedback with Vue Query

## 🛠️ Tech Stack

### Core Framework
- **[Nuxt 3](https://nuxt.com/)** - The Vue.js framework for production
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development

### UI & Styling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icon library
- **[Swiper](https://swiperjs.com/)** - Modern mobile touch slider

### State & Data Management
- **[Pinia](https://pinia.vuejs.org/)** - Vue Store for state management
- **[TanStack Query](https://tanstack.com/query)** - Powerful data synchronization
- **[Axios](https://axios-http.com/)** - Promise-based HTTP client

### Real-time Features
- **[Socket.IO Client](https://socket.io/)** - Real-time bidirectional communication

### Development Tools
- **[Vitest](https://vitest.dev/)** - Fast unit testing framework
- **[ESLint](https://eslint.org/)** - Code linting and quality
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Commitlint](https://commitlint.js.org/)** - Commit message linting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks management
- **[SonarQube](https://www.sonarqube.org/)** - Code quality and security analysis

### Additional Libraries
- **i18n** - Internationalization support
- **Dayjs** - Date/time manipulation
- **Twitter Text** - Tweet text parsing
- **reCAPTCHA** - Bot protection
- **Docker** - Containerization support


## 📁 Project Structure

```
app/
├── modules/          # Feature modules (auth, chat, timeline, etc.)
├── pages/           # Application routes
├── layouts/         # Page layouts
├── plugins/         # Nuxt plugins
├── middleware/      # Route middleware
├── assets/          # Static assets (CSS, images)
├── lib/             # Utility libraries
└── mockServer/      # Mock API server

i18n/                # Internationalization files
docker/              # Docker configuration
tests/               # Test files
public/              # Public static files
```

## 📊 System Design

For detailed information about the system architecture, modules, and data flow, please refer to the [System Modules Diagrams PDF](./System%20Modules%20Diagrams.pdf) in the root folder.

This document includes:
- System architecture overview
- Module interactions and dependencies
- Data flow diagrams
- Component relationships
- Real-time communication patterns
