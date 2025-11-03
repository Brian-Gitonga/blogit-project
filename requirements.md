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
