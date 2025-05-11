# Focus Flow Admin Dashboard

An admin dashboard for the Focus Flow project that provides tools for data management and system monitoring.

**🚀 Ready for deployment!**

Admin dashboard is set up with login, user management, session monitoring, and SQL debugging capabilities. The application is ready to be deployed to GitHub Pages.

## Features

- User authentication and secure login
- Dashboard with data visualization
- SQL query execution for debugging
- User management interface
- Session monitoring
- Playlist management
- Custom query builder

## Technology Stack

- **Frontend**: React, Redux, React Router
- **UI Components**: Custom styled components with CSS modules
- **State Management**: Redux Toolkit
- **Routing**: React Router with hash routing for GitHub Pages
- **API Communication**: Axios
- **Building & Bundling**: Vite
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/The-JAR-Team/focus-flow-admin.git
   cd focus-flow-admin
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Build for production:
   ```
   npm run build
   ```

5. Deploy to GitHub Pages:
   ```
   npm run deploy
   ```

### GitHub Pages Deployment

The project is configured for automatic deployment to GitHub Pages using GitHub Actions. When you push to the main branch, the application will be automatically built and deployed.

You can also manually deploy using:

1. First build the project:
   ```
   npm run build
   ```

2. Then deploy to GitHub Pages:
   ```
   npm run deploy
   ```

The site will be accessible at: https://The-JAR-Team.github.io/focus-flow-admin/


## Project Structure

```
focus-flow-admin/
├── src/
│   ├── components/       # Reusable UI components
│   ├── layouts/          # Page layout components
│   ├── pages/            # Main application pages
│   ├── redux/            # Redux store, slices, and actions
│   ├── services/         # API services and utilities
│   ├── styles/           # Global styles and themes
│   └── utils/            # Utility functions and constants
├── public/               # Static assets
└── .github/              # GitHub workflows for CI/CD
```

## API Integration

Secretttt