# ChamaPlus Deployment Guide

This guide will walk you through deploying the ChamaPlus application with the frontend on Vercel and the backend on Render.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Environment Variables](#environment-variables)
5. [Post-Deployment Steps](#post-deployment-steps)

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MongoDB Atlas account (for production database)
- Vercel account
- Render account
- Git

## Backend Deployment (Render)

1. **Push your code to a GitHub repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" and select "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - Name: `chamaplus-backend`
     - Region: Choose the one closest to your users
     - Branch: `main`
     - Build Command: `npm install`
     - Start Command: `npm start`
   - Add environment variables (see [Environment Variables](#environment-variables) section)
   - Click "Create Web Service"

3. **Set up MongoDB Atlas**
   - Create a new cluster in MongoDB Atlas
   - Add your current IP address to the IP whitelist
   - Create a database user
   - Get the connection string and update it in Render's environment variables

## Frontend Deployment (Vercel)

1. **Push your frontend code to a GitHub repository** (if not already done)

2. **Deploy to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" > "Project"
   - Import your GitHub repository
   - Configure the project:
     - Framework Preset: Create React App
     - Root Directory: `chamaplus_frontend`
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`
   - Add environment variables (see below)
   - Click "Deploy"

## Environment Variables

### Backend (Render)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Node environment | `production` |
| `PORT` | Port to run the server on | `10000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret for JWT token signing | (generate a strong secret) |
| `JWT_EXPIRE` | JWT token expiration | `30d` |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed origins | `https://your-frontend.vercel.app` |

### Frontend (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `https://chamaplus-backend.onrender.com` |
| `NODE_ENV` | Node environment | `production` |

## Post-Deployment Steps

1. **Update CORS in Backend**
   - After deploying the frontend, update the `ALLOWED_ORIGINS` in the backend with your Vercel URL
   
2. **Verify the Deployment**
   - Test the API endpoints using Postman or cURL
   - Verify the frontend is communicating with the backend
   - Check the logs in both Vercel and Render for any errors

3. **Set up Custom Domains (Optional)**
   - In Vercel: Add your custom domain in the project settings
   - Update DNS records as instructed by Vercel
   - Update the backend `ALLOWED_ORIGINS` with the new domain

4. **Enable Auto-Deploy (Recommended)**
   - In both Vercel and Render, enable auto-deploy on push to main branch
   - This ensures your production environment stays up-to-date

## Troubleshooting

- **CORS Errors**: Ensure the frontend URL is in the `ALLOWED_ORIGINS` list
- **Database Connection Issues**: Verify the MongoDB URI and network access
- **Build Failures**: Check the build logs in Vercel/Render for specific errors
- **Environment Variables**: Make sure all required variables are set in both environments
