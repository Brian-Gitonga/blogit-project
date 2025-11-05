BlogIt API
For your end of Month 2 project, you'll be building BlogIt, a basic yet functional blogging platform that allows users to create accounts, write and manage their blog posts, and maintain a personal profile.

This phase of the project focuses entirely on the API, so your job is to design and implement the logic, routes, models, and database interactions that power the platform.

The frontend will come later, for now, you’re building the engine that makes it all run.

Setup
You will be using the following technologies to write this API:

Express
TypeScript
Prisma as the ORM
Microsoft SQL Server for the Database Set up the project and proceed to the next step.
Authentication
Before anyone can start writing epic blog posts or managing their content, we need to know who they are, and make sure they’re allowed to do what they’re trying to do.

That’s where authentication comes in. In this stage, you’ll be setting up the system that lets users securely create accounts, log in, and access their personal data.

Registration
This is where new users officially join BlogIt by creating an account. To register, users must provide the following details:

First Name
Last Name
Username
Email Address
Password
Your User model should include the following details:

id: A unique string identifier for the user. Use Prisma’s uuid() as the default; @default(uuid()).
firstName: a required string (user's first name).
lastName: a required string (user's last name).
emailAddress: a required string that must be unique per user (user's email address).
username: a required string that must also be unique per user (user's username).
password: a required string (user's password, store the hashed version of the password, not the plain text password).
isDeleted: a boolean that indicates if the user has deleted their account. Default is false.
dateJoined: a DateTime field with a default value of Prisma's now().
lastUpdated: a DateTime field that automatically updates whenever the record changes, mark with @updatedAt.
Important Notes
Make sure to hash passwords using bcrypt before saving them.
If the chosen username or email address is already taken, return a clear message like:
Username already in use
Email address already in use
Validate user input before saving. If any required field is missing, send back a friendly, descriptive error. For example:
First Name is required
Password cannot be empty e.t.c.
When the account is created successfully, return a response such as:
Account created successfully
Endpoint: /auth/register
Login
Once a user has registered, they can log into BlogIt to access their account.
To login, users must provide:

Username or Email Address
Password
How this should work
When a user submits their login details, check the database for a user with the provided username or email address.
If no match is found, or if the password doesn’t match the stored hash, return an error message: wrong login credentials
If the credentials are valid, generate a JWT (JSON Web Token), this will act as the user’s authentication token. Send this token back to the client as a cookie (for now, a simple authToken cookie is enough).
This cookie is what proves that the user is logged in and authenticated on future requests.
Notes
No need to implement refresh tokens at this stage, just create a single JWT that identifies the user.
Make sure to hash and compare passwords using bcrypt, not plain text.
Keep error messages clear and consistent, e.g. "Wrong login credentials" for any invalid input combination.
Once authenticated, the user can now access protected routes or perform actions that require login.
On successful login, send back a JSON object containing the following user details, these details are also what you will encode in the Json Web Token:
id
firstName
lastName
username
emailAddress
Endpoint: /auth/login.
Logout
Logging out is the process of ending a user’s authenticated session on BlogIt. Once a user decides to log out, we simply remove their access token so they can no longer perform authenticated actions.

How this should work
When a logged-in user hits the logout route, clear the authentication token cookie (authToken) that was set during login.
Once the token is removed, the user is effectively logged out, they'll need to log in again to regain access to protected routes.
Notes
For now, you don’t need to do anything fancy with the database or tokens, just clear the cookie on the client side.
Send back a simple confirmation message such as logout successful.
Endpoint /auth/logout
About
requirements for a simple fullstack application

Resources
Readme
Activity
Stars
0 stars
Watchers
0 watching
Forks
0 forks
Report repository
Releases
No releases published
Packages
No packages published
Footer

Blogs
Create a Blog
To create a new blog, the user must provide the following details:

Title: The title of the blog post.
Synopsis: A short summary of the blog.
Featured Image URL: A link to the blog's featured image.
Content: The main body of the blog.
Blog Model Structure
The Blog model should contain the following fields:

id: A unique identifier for each blog post. Use Prisma’s UUID as the default: @default(uuid())
title: A required String representing the blog title.
synopsis: A required String summarizing the blog content.
featuredImageUrl: An optional String for the featured image URL. Default is null.
content: A required String containing the main body of the blog.
isDeleted: A Boolean flag indicating whether the blog has been deleted. Default is false.
createdAt: A DateTime value representing when the blog was created. Use Prisma’s now() as the default: @default(now())
lastUpdated: A DateTime field that automatically updates whenever the record changes, mark with @updatedAt.
Notes
Implement a one-to-many relationship between User and Blog: one user can create multiple blogs, but each blog must belong to exactly one user.
This action is restricted to authenticated users only.
Endpoint: POST /blogs
Get Blogs
Implement an endpoint that gets all the blogs that have not been deleted (isDeleted: false).
This action is restricted to authenticated users only.
The following fields should be retrieved for each blog:
id
title
synopsis
featuredImageUrl
createdAt
User information (creator of the blog):
firstName
lastName
Endpoint: GET /blogs
Get Blog
Implement an endpoint to retrieve a single blog by its ID.
If no matching blog is found, or if the blog is marked as deleted, respond with a user-friendly error message: Blog not found
This action is restricted to authenticated users only.
The following fields should be retrieved:
id
title
synopsis
featuredImageUrl
content
createdAt
lastUpdated
User information (creator of the blog):
firstName
lastName
Endpoint: GET /blogs/:blogId
Update a Blog
Implement an endpoint for updating a blog.
This action is restricted to authenticated users only.
The following are the fields that can be updated:
title
synopsis
featuredImageUrl
content
The endpoint should validate user authorization before applying any changes to ensure that only the blog’s owner can update it.
Endpoint: PATCH /blogs/:blogId
Move Blog to Trash
Implement an endpoint for marking a blog as deleted by changing the isDeleted field from false to true.
This action is restricted to authenticated users only.
The endpoint should validate user authorization before applying any changes to ensure that only the blog’s owner can update it.
Endpoint: PATCH /blogs/trash/:blogId
Restore a Deleted Blog
Implement an endpoint for restoring a deleted blog by changing the isDeleted field from true to false.
This action is restricted to authenticated users only.
The endpoint should validate user authorization before applying any changes to ensure that only the blog’s owner can update it.
Endpoint: PATCH /blogs/restore/:blogId
Delete a Blog Permanently
Implement an endpoint to delete a blog permanently.
This action is restricted to authenticated users only.
The endpoint should validate user authorization before applying any changes to ensure that only the blog’s owner can update it.
Endpoint: DELETE /blogs/:blogId
