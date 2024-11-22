1. Sign In
   Endpoint: POST /auth/sign-in
   Request Body:

```
{
  email: string;     // Must be valid email
  password: string; // Minimum 6 characters
}
```

Response:

```
{
  jwt: string;
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
  }
}
```

Error responses:

- 401 Unauthorized: "Invalid credentials"
- 404 Not Found: "User not found"

2. Register
   Endpoint: POST /auth/register
   Request Body:

```
{
  email: string;     // Must be valid email
  username: string;  // Minimum 3 characters
  password: string;  // Minimum 6 characters
  password2: string; // Must match password
  firstName: string;
  lastName: string;
}
```

Response:

```
{
  jwt: string;
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
  }
}
```

Error responses:

- 400 Bad Request: "Passwords do not match"
- 400 Bad Request: "Email already exists"
- 400 Bad Request: "Username already exists"

We will handle "Password must be at least 6 characters" and username minimum 3 characters in the frontend.

3. Logout
   Currently, there is no server-side logout endpoint implemented. Logout should be handled on the frontend by:
1. Removing the JWT token from local storage/cookies
1. Clearing any user state in the application
   Best practices for implementing logout:

- Frontend should clear all local authentication data
- Consider implementing token blacklisting on the backend if you need to invalidate tokens before they expire
- Current JWT tokens are set to expire in 7 days (expiresIn: '7d')

Additional Notes for Frontend Developers:

1. All successful authentication responses include a JWT token that should be:

- Stored securely (e.g., in httpOnly cookies or securely in localStorage)
- Included in subsequent API requests in the Authorization header:
  Authorization: Bearer <jwt_token>
  2.Protected routes require a valid JWT token. Requests without a valid token will receive a 401 Unauthorized response.

3. You can test if a token is still valid by calling the protected endpoint:
   GET /users/me - Returns the current user's information
