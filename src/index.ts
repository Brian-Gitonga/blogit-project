import "dotenv/config";
import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
//password strength checker
import zxcvbn from "zxcvbn";

import jwt from "jsonwebtoken";

const app = express();
const port = 4000;
const client = new PrismaClient();

// Middleware to parse JSON request bodies
app.use(express.json());

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
app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await client.user.findUnique({
      where: { username },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid login credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid login credentials" });
    }
    const payload = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        username: user.username,
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "10h" });
    res.status(200).cookie("authToken", token).json(payload);
  } catch (error) {
    res.status(500).json({ error: "something went wrong trying to login" });
  }
});

//loging out the user
app.post("/auth/logout", async (req, res) => {
  try {
    res.clearCookie("authToken");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: "something went wrong trying to logout" });
  }
});

















/*
{
  "firstName": "Brian",
  "lastName": "Gitonga",
  "emailAddress": "brian@example.com",
  "username": "brian123",
  "password": "Passw0rd!"
}

*/
