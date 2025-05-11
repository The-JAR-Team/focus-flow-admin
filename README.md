# Focus Flow Admin Dashboard

An admin dashboard for the Focus Flow project that provides tools for data management and system monitoring.
The site : https://The-JAR-Team.github.io/focus-flow-admin/

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
- Real-time API health monitoring with status indicator

### Screenshots

#### User Management Dashboard
![User Management Dashboard](https://i.imgur.com/FjWQItE.png)
*The admin dashboard displaying a summary of all users with well-aligned data tables. Note the health status indicator in the sidebar showing API status, version, and build details.*

#### Custom SQL Query for Playlists
![Custom SQL Query for Playlists](https://i.imgur.com/SgN53En.png)
*Example of a custom SQL query showing playlist data. The sidebar includes real-time health monitoring that displays the API status, version number, and last build timestamp.*

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

### Environment Configuration

The application connects to the backend API configured in `src/utils/config.js`. The configuration includes:

- `baseURL`: The base URL of the API server
- `apiEndpoints`: Object containing all API endpoint paths
  - `login`: Authentication endpoint
  - `logout`: Session termination endpoint
  - `userInfo`: Current user information endpoint
  - `health`: System health status endpoint
  - `debug.sql`: SQL query execution endpoint


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

The dashboard integrates with the Focus Flow backend API using Axios for all HTTP requests. The integration includes:

- Authentication with secure cookie-based sessions
- User data management
- Session monitoring
- SQL query execution for debugging
- Health status monitoring

### Health Status Monitoring

The dashboard includes a health status indicator in the sidebar that provides real-time information about the backend API:

- **Status Indicator**: Shows if the API is healthy (green) or experiencing issues (red)
- **Version Information**: Displays the current API version
- **Build Details**: Shows the timestamp of the last successful build
- **Auto-refresh**: The status refreshes automatically every 60 seconds

This feature helps administrators quickly identify any backend issues without having to navigate away from their current task.