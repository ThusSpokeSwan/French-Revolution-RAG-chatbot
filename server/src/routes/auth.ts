import { Router } from "express";
import bcrypt from "bcryptjs";
import { getDB } from "../config/db";
import { generateToken } from "../utils/jwt";

const router = Router();

/* SIGNUP */

router.post(
  "/signup",
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
      } = req.body;

      const db = getDB();

      const users =
        db.collection("users");

      const existingUser =
        await users.findOne({
          email,
        });

      if (existingUser) {
        return res
          .status(400)
          .json({
            error:
              "Email already exists",
          });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const result =
        await users.insertOne({
          name,
          email,
          password:
            hashedPassword,
          createdAt:
            new Date(),
        });

      const token =
        generateToken(
          result.insertedId.toString()
        );

      res.json({
        token,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "Signup failed",
      });
    }
  }
);

/* LOGIN */

router.post(
  "/login",
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      const db = getDB();

      const users =
        db.collection("users");

      const user =
        await users.findOne({
          email,
        });

      if (!user) {
        return res
          .status(400)
          .json({
            error:
              "Invalid credentials",
          });
      }

      const validPassword =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!validPassword) {
        return res
          .status(400)
          .json({
            error:
              "Invalid credentials",
          });
      }

      const token =
        generateToken(
          user._id.toString()
        );

      res.json({
        token,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "Login failed",
      });
    }
  }
);

export default router;