# Complete Beginner's Guide to BlogIt API Authentication System

This guide explains in detail how the authentication and authorization system works in your BlogIt API, with line-by-line explanations.

---

## Table of Contents
1. [Understanding the Authentication Flow](#authentication-flow)
2. [The verifyToken Middleware Explained](#verifytoken-middleware)
3. [The deleteBlog Function Explained](#deleteblog-function)
4. [How Login Works](#how-login-works)
5. [TypeScript Types Explained](#typescript-types)
6. [Common Concepts](#common-concepts)

---

## Authentication Flow

**What is Authentication?**
Authentication is the process of verifying who a user is. Think of it like showing your ID card to prove you are who you say you are.

**The Flow in Your Application:**
1. User logs in with username/password → Server creates a JWT token → Token stored in browser cookie
2. User makes a request (like deleting a blog) → Browser automatically sends the cookie → Server verifies the token → If valid, allows the action

---

## The verifyToken Middleware Explained

**File: `src/Middleware/verifyToken.ts`**

Let's break down this file line by line:

```typescript
import { type Request, type Response, type NextFunction } from "express";
```
**What this does:**
- Imports TypeScript types from the Express framework
- `Request`: Represents the incoming HTTP request (what the user sends to your server)
- `Response`: Represents the HTTP response (what your server sends back)
- `NextFunction`: A function that passes control to the next middleware

**Why we need it:**
These types help TypeScript understand what kind of data we're working with, preventing errors.

---

```typescript
import jwt from "jsonwebtoken";
```
**What this does:**
- Imports the JSON Web Token (JWT) library
- JWT is used to create and verify authentication tokens

**What is a JWT?**
A JWT is like a secure digital badge that contains user information. It's created when a user logs in and proves they are authenticated.

---

```typescript
export type AuthRequest = Request & { user?: { id: string } };
```
**What this does:**
- Creates a custom TypeScript type called `AuthRequest`
- Takes the standard Express `Request` type and adds a `user` property to it
- The `user` property is optional (`?`) and contains an `id` (string)

**Why we need it:**
The standard Express `Request` doesn't have a `user` property. We add it ourselves to store information about the logged-in user.

**Breaking it down:**
- `export`: Makes this type available to other files
- `type AuthRequest`: Creates a new type named AuthRequest
- `Request &`: Takes the existing Request type AND...
- `{ user?: { id: string } }`: Adds a user property that might contain an id

---

```typescript
export function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
```
**What this does:**
- Defines a function called `verifyToken` that can be exported and used in other files
- This is a **middleware function** - it runs BEFORE your main route handlers

**Parameters explained:**
- `req: AuthRequest`: The incoming request (with our custom user property)
- `res: Response`: The response object (to send data back)
- `next: NextFunction`: A function to call when this middleware is done

**What is middleware?**
Middleware is like a security checkpoint. Before your main function runs (like deleteBlog), the middleware checks if the user is allowed to proceed.

---

```typescript
  const authToken = req.cookies.authToken;
```
**What this does:**
- Looks for a cookie named `authToken` in the request
- Stores it in a variable called `authToken`

**What are cookies?**
Cookies are small pieces of data stored in the user's browser. When a user logs in, we store their JWT token in a cookie. The browser automatically sends this cookie with every request.

**Why use cookies?**
- Automatic: Browser sends them with every request
- Secure: Can be configured to only work over HTTPS
- Convenient: User doesn't have to manually include the token

---

```typescript
  if (!authToken) {
    return res.status(401).json({ error: "Access denied. please login." });
  }
```
**What this does:**
- Checks if the authToken exists
- If NOT (`!`), sends back an error response

**Breaking it down:**
- `if (!authToken)`: If there is NO token...
- `return`: Stop the function here and send a response
- `res.status(401)`: Set HTTP status code to 401 (Unauthorized)
- `.json({ error: "..." })`: Send back a JSON response with an error message

**Why status 401?**
HTTP status codes tell the client what happened:
- 200 = Success
- 401 = Unauthorized (not logged in)
- 403 = Forbidden (logged in but not allowed)
- 404 = Not found
- 500 = Server error

---

```typescript
  try {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET!);
```
**What this does:**
- Uses a `try` block to handle potential errors
- Verifies the JWT token using a secret key
- Stores the decoded (decrypted) token data in `decoded`

**Breaking it down:**
- `try { }`: Attempt to run this code, if it fails, jump to `catch`
- `jwt.verify()`: Checks if the token is valid and hasn't been tampered with
- `authToken`: The token we got from the cookie
- `process.env.JWT_SECRET!`: A secret password stored in environment variables
- The `!` tells TypeScript "I promise this exists, don't worry"

**How JWT verification works:**
1. The token was created with a secret key when the user logged in
2. To verify it, we use the SAME secret key
3. If someone changed the token, verification fails
4. If the token is valid, we get back the original data (like user ID)

---

```typescript
    req.user = decoded as { id: string };
```
**What this does:**
- Adds the decoded user information to the request object
- Now any function that runs after this middleware can access `req.user`

**Breaking it down:**
- `req.user`: The user property we added to our AuthRequest type
- `decoded`: The verified token data
- `as { id: string }`: Tells TypeScript to treat this as an object with an id property

**Why this is important:**
This is how we "remember" who the logged-in user is throughout the request!

---

```typescript
    next();
```
**What this does:**
- Calls the `next()` function to pass control to the next middleware or route handler

**Why we need it:**
Middleware is like a chain. Each piece does its job, then calls `next()` to let the next piece run. Without this, the request would just hang and never complete.

---

```typescript
  } catch (error) {
    res.status(401).json({ error: "Access denied. please login." });
  }
```
**What this does:**
- If anything in the `try` block fails (like invalid token), this runs
- Sends back a 401 error

**When does this happen?**
- Token is expired
- Token was tampered with
- Token is malformed
- Wrong secret key used

---

## The deleteBlog Function Explained

**File: `src/Middleware/deleteBlog.ts`**

```typescript
//we will fetch Id and then we delete that blog permanently
```
**What this does:**
- A comment explaining what the function does
- Comments are ignored by the computer, they're just for humans

---

```typescript
import { type Request, type Response, type NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import type { AuthRequest } from "./verifyToken.js";
```
**What this does:**
- Imports necessary types and tools
- `PrismaClient`: A tool to interact with the database
- `AuthRequest`: Our custom type from verifyToken.ts (notice the `.js` extension - TypeScript compiles to JavaScript)

---

```typescript
const client = new PrismaClient();
```
**What this does:**
- Creates a new instance of PrismaClient
- This `client` object lets us talk to the database

**What is Prisma?**
Prisma is an ORM (Object-Relational Mapping) tool. It lets you work with databases using JavaScript/TypeScript instead of writing SQL queries.

---

```typescript
export const deleteBlog = async (req: AuthRequest, res: Response, next: NextFunction) => {
```
**What this does:**
- Defines an async function called `deleteBlog`
- `async`: Means this function can use `await` for asynchronous operations

**What is async/await?**
- Database operations take time (they're asynchronous)
- `async` marks a function that will wait for things
- `await` pauses the function until an operation completes

---

```typescript
  try {
```
**What this does:**
- Starts a try block to catch any errors that might happen

---

```typescript
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "please login to delete a blog" });
    }
```
**What this does:**
- Double-checks that the user is logged in
- Even though `verifyToken` middleware should have set `req.user`, we check again for safety

**Breaking it down:**
- `!req.user`: If user doesn't exist OR
- `!req.user.id`: If user exists but has no id
- Then send a 401 error

**Why check again?**
- Defense in depth: Multiple layers of security
- TypeScript safety: The `user` property is optional (`?`), so we must check it exists
- Someone might call this function without the middleware

---

```typescript
    const { id } = req.params;
```
**What this does:**
- Extracts the `id` from the URL parameters
- Uses destructuring to get the id

**Example:**
If the URL is `/blogs/delete/abc123`, then `req.params.id` would be `"abc123"`

**What is destructuring?**
Instead of writing `const id = req.params.id`, we write `const { id } = req.params`. It's a shorthand.

---

```typescript
    const blog = await client.blog.delete({
      where: { id },
    });
```
**What this does:**
- Uses Prisma to delete a blog from the database
- `await`: Waits for the database operation to complete
- Stores the deleted blog data in the `blog` variable

**Breaking it down:**
- `client.blog`: Access the blog table in the database
- `.delete()`: Delete operation
- `where: { id }`: Find the blog with this specific id (shorthand for `id: id`)
- `await`: Wait for the deletion to finish

**What gets returned?**
Prisma returns the blog that was deleted, so you can show it to the user or log it.

---

```typescript
    res.status(200).json({ message: "Your Blog has been deleted successfully", blog });
```
**What this does:**
- Sends a success response back to the user
- Status 200 means "OK, everything worked"
- Includes a success message and the deleted blog data

---

```typescript
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
```
**What this does:**
- If ANYTHING goes wrong in the try block, this catches it
- Sends a 500 error (Internal Server Error)

**When does this happen?**
- Database connection fails
- Blog with that ID doesn't exist
- Database permissions issue
- Any unexpected error

---

## How Login Works

Let me explain the complete login flow:

### Step 1: User Sends Login Request
```
User → POST /auth/login → Server
Body: { username: "john", password: "secret123" }
```

### Step 2: Server Validates Credentials
The login function (in `src/Middleware/login.ts`):
1. Receives username and password
2. Looks up user in database
3. Compares password hash with stored hash using bcrypt
4. If match, creates a JWT token

### Step 3: JWT Token Creation
```typescript
const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
```
- `jwt.sign()`: Creates a new token
- `{ id: user.id }`: The data to store in the token (user's ID)
- `process.env.JWT_SECRET!`: Secret key to encrypt the token
- `{ expiresIn: '7d' }`: Token expires in 7 days

### Step 4: Token Sent as Cookie
```typescript
res.cookie('authToken', token, { httpOnly: true, secure: true });
```
- Stores the token in a cookie named 'authToken'
- `httpOnly`: JavaScript can't access it (prevents XSS attacks)
- `secure`: Only sent over HTTPS

### Step 5: Browser Stores Cookie
The browser automatically saves this cookie and sends it with every future request to your server.

### Step 6: Future Requests Use the Token
When the user tries to delete a blog:
```
User → DELETE /blogs/abc123 → Server
Cookie: authToken=eyJhbGc...
```

### Step 7: verifyToken Middleware Runs
1. Extracts token from cookie
2. Verifies it with JWT_SECRET
3. Decodes user ID from token
4. Adds user to request: `req.user = { id: "user123" }`
5. Calls `next()` to continue

### Step 8: deleteBlog Function Runs
1. Checks `req.user.id` exists (it does, from step 7!)
2. Deletes the blog
3. Sends success response

---

## TypeScript Types Explained

### What are Types?
Types tell TypeScript what kind of data a variable can hold.

```typescript
let name: string = "John";  // Can only be text
let age: number = 25;       // Can only be a number
let isActive: boolean = true; // Can only be true/false
```

### Why Use Types?
- **Catch errors early**: TypeScript warns you before running the code
- **Better autocomplete**: Your editor knows what properties exist
- **Documentation**: Types explain what data is expected

### The `type` Keyword
```typescript
type User = {
  id: string;
  name: string;
  email: string;
};
```
Creates a reusable type definition.

### The `interface` Keyword
Similar to `type`, but for object shapes:
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}
```

### Optional Properties (`?`)
```typescript
type AuthRequest = Request & { user?: { id: string } };
```
The `?` means `user` might exist or might be `undefined`. That's why we check `if (!req.user)` before using it.

### Type Assertion (`as`)
```typescript
req.user = decoded as { id: string };
```
Tells TypeScript: "Trust me, I know this is an object with an id property."

---

## Common Concepts

### Middleware
Functions that run BEFORE your main route handler. They can:
- Check authentication
- Log requests
- Parse data
- Modify request/response

**Example flow:**
```
Request → Middleware 1 → Middleware 2 → Route Handler → Response
          (logging)      (auth check)    (delete blog)
```

### Async/Await
Handles operations that take time (like database queries):
```typescript
// Without await (wrong!)
const blog = client.blog.delete({ where: { id } });
console.log(blog); // Promise { <pending> } - not the actual blog!

// With await (correct!)
const blog = await client.blog.delete({ where: { id } });
console.log(blog); // { id: "abc", title: "My Blog", ... } - actual blog data!
```

### Environment Variables
Sensitive data stored in `.env` file:
```
JWT_SECRET=your-super-secret-key-here
DATABASE_URL=your-database-connection-string
```
Access with `process.env.JWT_SECRET`

**Why use them?**
- Keep secrets out of code
- Different values for development/production
- Security: Don't commit secrets to Git

### HTTP Status Codes
- **200**: OK - Everything worked
- **201**: Created - New resource created
- **401**: Unauthorized - Not logged in
- **403**: Forbidden - Logged in but not allowed
- **404**: Not Found - Resource doesn't exist
- **500**: Internal Server Error - Something broke on the server

### JSON
JavaScript Object Notation - a way to send data:
```json
{
  "message": "Success",
  "blog": {
    "id": "abc123",
    "title": "My Blog Post"
  }
}
```

---

## Why Login Works - Complete Summary

**The login works because of this chain:**

1. **User logs in** → Server creates JWT token with user ID
2. **Token stored in cookie** → Browser saves it automatically
3. **Browser sends cookie** → With every request to your server
4. **verifyToken middleware** → Checks token is valid, extracts user ID
5. **req.user is set** → Now we know WHO is making the request
6. **Route handler runs** → Can access `req.user.id` to know which user
7. **Database operation** → Uses user ID to ensure user owns the resource
8. **Response sent** → User gets confirmation

**Security features:**
- Password hashed (not stored in plain text)
- JWT signed with secret (can't be faked)
- Cookie httpOnly (JavaScript can't steal it)
- Token expires (old tokens stop working)
- Middleware checks (every protected route verified)

---

## Next Steps for Learning

1. **Try modifying the code**: Change the error messages, add console.logs
2. **Read about JWT**: Understand how tokens work
3. **Learn Prisma**: Understand database operations
4. **Study Express middleware**: See how the chain works
5. **Practice TypeScript**: Get comfortable with types

**Helpful resources:**
- Express.js documentation: https://expressjs.com/
- JWT.io: https://jwt.io/
- Prisma docs: https://www.prisma.io/docs/
- TypeScript handbook: https://www.typescriptlang.org/docs/

---

**Remember:** Every expert was once a beginner. Take your time, experiment, and don't be afraid to break things - that's how you learn! 🚀

