###Full-Stack Nested Comment Application

This is a complete full-stack web application that implements a modern, feature-rich nested comment system. It includes user authentication, threaded replies, upvoting, and a robust backend built with Node.js, Express, and MongoDB.

##Key Features

    #JWT Authentication: Secure user login and signup using JSON Web Tokens.
    #Persistent Sessions: Users remain logged in even after closing the browser tab, with session restoration on app load
    ##Nested Comments: Infinite-depth nested replies with a clear, threaded visual structure.
    #Full CRUD Functionality:
    #Create: Post new comments and replies.
    #Read: Fetches and displays the entire nested comment structure.
    #Delete: Users can delete their own comments (which also removes all nested replies).
    #Upvoting System: Authenticated users can "like" and "unlike" comments, with the count updated in real-time.
    #Dynamic Avatars: Displays user-provided avatars with a smart fallback to a colored background with the user's initial if the image is missing or broken.
    #"Time Ago" Timestamps: Displays comment creation times in a user-friendly format (e.g., "5m ago", "2h ago").
    #RESTful API: A well-structured backend API to handle all data operations.

##Technology Stack

Backend

    #Node.js: JavaScript runtime environment.
    #Express.js: Web application framework for Node.js.
    #MongoDB: NoSQL database for storing user and comment data.
    #Mongoose: Object Data Modeling (ODM) library for MongoDB.
    #JSON Web Token (JWT): For secure user authentication.
    #bcrypt.js: For hashing user passwords.
    #dotenv: For managing environment variables.

Frontend

    #React: JavaScript library for building user interfaces.
    #Axios: Promise-based HTTP client for making API requests.
    #CSS: Custom styling for the modern, dark-themed UI.

##Setup and Installation

Follow these steps to get the project running on your local machine.

#Prerequisites

    Node.js (v14 or higher)
    npm 
    MongoDB: Make sure you have a running MongoDB instance (locally ).

#Backend Setup

    Navigate to the backend directory:
    cd backend

    Install dependencies:
    npm install

    Create an environment file:
    Create a new file named .env in the root of the backend directory.
    Add the following variables:

        PORT=5000
        MONGODB_URL=your_mongodb_connection_string
        JWT_SECRET=your_super_long_and_secret_string


    Start the backend server:
    npm start
    The server should now be running on http://localhost:5000.

#Frontend Setup

    Navigate to the frontend (or root) directory:
    cd ../frontend 

    Install dependencies:
    npm install

    Start the React development server:
    npm start

    The application should now be open and running in your browser at http://localhost:3000.

##Project Structure

The project is organized into two main parts: backend and frontend.

#Backend Structure

backend/
    middleware/
        auth.js         # JWT authentication middleware
    models/
        comment.js      # Mongoose schema for comments
        user.js         # Mongoose schema for users
    routes/
        commentRoutes.js # API routes for comments (CRUD, upvote)
        userRoute.js     # API routes for users (login, signup)
    server.js           # Main Express server entry point


Frontend Structure

src/
    components/
        Comment.jsx     # Recursive component for displaying comments
        CommentForm.jsx # Reusable form for new comments/replies
        Login.jsx       # Login form component
        Signup.jsx      # Signup form component
    utils/
        timeUtils.js    # "Time ago" formatting utility
    App.jsx             # Main component for auth and routing
    style.css           # All application styles
    page/
        Home.jsx        #The main dashboard for logged-in users, responsible for managing the comment thread.