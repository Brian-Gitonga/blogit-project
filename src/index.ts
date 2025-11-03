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
      return res.status(400).json({ error: "Email already in use" });
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
    res.status(500).json({ error: "Failed to register user" });
  }
});


//login function block
app.get("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await client.user.findUnique({
      where: { username },
    });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    res.status(200).json(
        {
          //jwt and create a cookie

          token: jwt.sign(
            {
              username: user.username,
              emailAddress: user.emailAddress,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
          ),
          //create cookie
          cookie: {
            name: "authToken",
            value: jwt.sign(
              {
                username: user.username,
                emailAddress: user.emailAddress,
              },
              process.env.JWT_SECRET as string,
              { expiresIn: "1h" }
            ),
            
          },

          message: "Login successful"
        }
    );
  } catch (error) {
    res.status(500).json({ error: "something went wrong trying to login" });
  }
});

//loging out the user
app.get("/auth/logout", async (req, res) => {
  try {
    res.clearCookie("authToken");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: "something went wrong trying to logout" });
  }
});


//get all users function block
app.get("/users", async (req, res) => {
  try {
    const users = await client.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to get users" });
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
