import "dotenv/config";
import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
//password strength checker
import zxcvbn from "zxcvbn";
import cookieParser from "cookie-parser";
import { verifyToken } from "./Middleware/verifyToken.js";
import type { AuthRequest } from "./Middleware/verifyToken.js";
import { login } from "./Middleware/login.js";
import { allBlogs } from "./Middleware/allBlogs.js";
import { blog } from "./Middleware/blog.js";
import { blogUpdate } from "./Middleware/blogUpdate.js";
import { blogTrash } from "./Middleware/blogTrash.js";
import { blogRestore } from "./Middleware/restore.js";
import { deleteBlog } from "./Middleware/deleteBlog.js";
import { createBlog } from "./Middleware/createBlog.js";

const app = express();
const port = 4000;
const client = new PrismaClient();

// Middleware to parse JSON request bodies
app.use(express.json());
// Middleware to parse cookies
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("blogit-api Is working");
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});

//registering a new user and also hash the password function block
app.post("/auth/register", async (req, res) => {
  try {
    const { firstName, lastName, emailAddress, username, password } = req.body;
    const passwordStrength = zxcvbn(password);
    const hashedPassword = await bcrypt.hash(password, 10);
    if (passwordStrength.score < 3) {
      return res.status(400).json({ error: "Password is too weak try a better one" });
    }
    //checking if email of the user exists
    const emailExists = await client.user.findUnique({
      where: { emailAddress },
    });
    if (emailExists) {
      return res.status(400).json({ error: "Email already in use try another email" });
    }
    //checking if username of the user exists
    const usernameExists = await client.user.findUnique({
      where: { username },
    });
    if (usernameExists) {
      return res.status(400).json({ error: "Username already in use" });
    }

    const user = await client.user.create({
      data: {
        firstName,
        lastName,
        emailAddress,
        username,
        password: hashedPassword,
      },
    });    
    res.status(201).json({ message: "Registration successfully" });
  } catch (error) {
    res.status(500).json({ error: "Someing went wrong trying to register" });
  }
});


//login function block
app.post("/auth/login", login);

//check if the user is logged in
app.get("/auth/me", verifyToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.status(200).json({ message: "You are logged in" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

//post a blog to the database and also verify if the user is logged in
app.post("/blogs", verifyToken, createBlog);

//postman sample to create blog data
//{
//   "title": "10 Tips for Better Coding",
//   "synopsis": "Learn how to write cleaner, more efficient code",
//   "featuredImageUrl": "https://myimage.com",
//   "content": "Here are my top 10 tips for writing better code:\n\n1. Write clean, readable code\n2. Use meaningful variable names\n3. Comment your code\n4. Follow coding standards\n5. Test your code\n6. Refactor regularly\n7. Use version control\n8. Learn from others\n9. Practice daily\n10. Never stop learning"
// }



//loging out the user
app.post("/auth/logout", async (req, res) => {
  try {
    res.clearCookie("authToken");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: "something went wrong trying to logout" });
  }
});

//verify if you are logged in using middleware
app.get("/auth/me", verifyToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized, please login" });
    }
    const user = await client.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        emailAddress: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "Account not found please log in" });
    }
    res.status(200).json({ message: "You are logged in" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

//create a blog to the database and also verify if the user is logged in
app.post("/blogs", verifyToken, createBlog);

//get all blogs from the database
app.get("/blogs", allBlogs);

//get a blog by id from sql
app.get("/blogs/:id", blog);

//update a blog by id from sql
app.patch("/blogs/:id", blogUpdate);

//move a blog to trash by id from sql
app.patch("/blogs/trash/:id", blogTrash);

//restore a blog from trash by id from sql
app.patch("/blogs/restore/:id", blogRestore);

//delete a blog permanently by id from sql
app.delete("/blogs/:id", deleteBlog);


















/*
{
  "firstName": "Brian",
  "lastName": "Gitonga",
  "emailAddress": "brian@example.com",
  "username": "brian123",
  "password": "Passw0rd!"
}

*/
