# Lifeline_Backend_2.0
 
 ## Features
- User Authentication (Login, Register, Logout)
- User Profile Management
- Post Creation, Update, and Deletion
- Comment Management
- File Uploads (User Avatars, Post Media)
- CORS Configuration
- Error Handling

## Technologies Used
- Node.js
- Express
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- Multer (File Uploads)
- Cloudinary (Media Storage)
- bcrypt (Password Hashing)
- dotenv (Environment Variables)

## Installation
1. Clone the repository:
    ```sh
    git clone https://github.com/deahajrizi/Lifeline_Backend_2.0.git
    ```
2. Navigate to the project directory:
    ```sh
    cd Lifeline_Backend_2.0/www
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```

## Configuration
1. Create a `.env` file in the `www` directory and add the following environment variables:
    ```env
    PORT=8080
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    NODE_ENV=development
    ```

## Running the Application
1. Start the server:
    ```sh
    npm start
    ```
2. The server will start on the port specified in the `.env` file (default is 8080).

## API Endpoints
### User Routes
- `POST /api/user/auth` - Login User
- `POST /api/user/register` - Register User
- `PUT /api/user/profile` - Update User Profile
- `PUT /api/user/upload-avatar/:_id` - Upload User Avatar
- `GET /api/user/profile/:_id` - Get User Profile
- `GET /api/user/friends` - Get Friends Profiles
- `PUT /api/user/add-friend` - Add Friend By Username
- `POST /api/user/logout` - Logout User

### Post Routes
- `GET /api/post/all` - Get All Posts By User ID
- `GET /api/post/:id` - Get Single Post By ID
- `POST /api/post/create` - Create New Post
- `PUT /api/post/:id` - Update Post By ID
- `PUT /api/post/upload-post-media/:id` - Upload Post Media
- `DELETE /api/post/:id` - Delete Post By ID

### Comment Routes
- `GET /api/comment/:postId` - Get Comments By Post ID
- `POST /api/comment/:postId` - Add Comment to Post
- `DELETE /api/comment/:id` - Delete Comment By ID

## Error Handling
The application uses a custom error handler middleware to handle errors gracefully. The error handler is defined in [`www/middleware/errorHandler.js`](www/middleware/errorHandler.js).

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author
Dea Hajrizi