# Chama Plus Web App

A modern web application for managing Chama (cooperative) activities. This application provides a comprehensive solution for managing cooperative groups, including member management, contributions tracking, loan management, and meeting scheduling.

## Features

- Member Management
  - Register and manage cooperative members
  - Track member profiles and contact information
  - View member activity history

- Contribution Tracking
  - Track regular contributions from members
  - Generate contribution reports
  - Monitor contribution history

- Loan Management
  - Process loan applications
  - Track loan repayments
  - Generate loan statements

- Meeting Management
  - Schedule and manage meetings
  - Track meeting attendance
  - Record meeting minutes

- Reporting
  - Generate financial reports
  - View contribution summaries
  - Track loan performance

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Bcrypt for password hashing

## Project Structure

```
.
├── chamaplus_backend/     # Backend API and server code
│   ├── config/           # Configuration files
│   ├── controllers/      # API controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── middleware/      # Custom middleware
│
└── chamaplus_frontend/   # Frontend React application
    ├── public/          # Static files
    ├── src/            # Source code
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   ├── context/     # React context
    │   └── styles/      # CSS/SCSS files
    └── package.json
```

## Prerequisites

### Backend
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Frontend
- Node.js (v14 or higher)
- npm or yarn

## Setup Instructions

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd chamaplus_backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
4. Run database migrations:
   ```bash
   node migrate.js
   ```
5. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd chamaplus_frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the backend API URL:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Environment Variables

### Backend
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT secret key

### Frontend
- `REACT_APP_API_URL`: Backend API URL

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.