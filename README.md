# Advanced Authentication System

A robust and secure authentication system built with **Node.js**, support multiple login methods, token-based authentication, and advanced user account management features.

---

## Features

- **User Registration & Login**
- **JWT Authentication**
- **Authorization (Role-based access)**
- **Token Refresh Mechanism**
- **Login with Google (OAuth 2.0)**
- **Login with Facebook (OAuth 2.0)**
- **Password Reset via Email**
- **Forget Password Flow**
- **OTP Verification via Email**
- **Email Confirmation**
- **Error Handling & Input Validation**
- **Regex Validation for Inputs**
- **Morgan (for logging HTTP requests)**

---

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Passport.js (for OAuth strategies)
- JWT (jsonwebtoken)
- Mailtrap (for sending OTPs and password resets)
- bcrypt (for password hashing)
- dotenv
- Regular Expressions (Regex)

---

## Installation & Setup


1. Clone the repository:
   ```
   git clone https://github.com/your-username/advanced-auth-system.git
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a .env file and configure the following variables:
   ```
   PORT=port
   MONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   FACEBOOK_APP_ID=your_facebook_app_id
   FACEBOOK_APP_SECRET=your_facebook_app_secret
   MAILTRAP_USER=your_mailtrap_username
   MAILTRAP_PASS=your_mailtrap_password
   ```
  4. Start the server:
     ```
     npm start
     ```
   For development mode with auto-restart:
     ```
     npm run dev
     ```

---


## Error Handling

The API returns standard HTTP status codes and error messages in the following format:

```json
{
  "status": httpstatustext.ERROR,
  "message": "Error description",
  "errors": ["Detailed error information"]
}
```

Success responses follow this format:

```json
{
  "status": httpstatustext.SUCCESS,
  "message": "Operation successful",
  "data": {}
}
```

---

## Security Best Practices Implemented

- Password hashing with bcrypt
- HTTPS enforcement in production
- JWT with expiration times
- HTTP-only cookies for refresh tokens
- CORS protection
- Rate limiting
- Input validation and sanitization
- Protection against common security vulnerabilities (XSS, CSRF, etc.)

---


## Author

Noran Hamdy - [GitHub Profile](https://github.com/devnoranhamdy)

---

## Contributions

Contributions are welcome! Please feel free to submit a Pull Request.
