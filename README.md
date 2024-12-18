# College Placement Management System

## Developed by:
- Shanmitha Karthikeyan
- Spoorthi Krishna Devadiga

## Features
### Student Features
- Online registration and profile creation
- Job application submission and status tracking

### Company Features
- Job posting and application management
- Interview scheduling with candidates

### Admin Features
- Management of placement processes
- Real-time report generation

## Tech Stack
- Frontend: React.js, HTML, CSS, JavaScript
- Backend: Node.js
- Database: MySQL

## Installation and Setup
```bash
# Clone the repository
git clone https://github.com/shanmi2904/Campus-Recruitment-System.git
cd campus-placement-system

# Install dependencies
npm install (node, express, react, bottstrap)

# Set up the database
mysql -u root -p college_placement < path/campus_placement_system.sql

# Start the backend server
cd backend
node server.js

# Start the frontend(all the files that are not there in the backend folder,put the App.js in frontend, codes in frontend/src/components and the images in the frontend/src/components/homepage_img )
cd frontend
npm start

# Open in browser
http://localhost:3000
