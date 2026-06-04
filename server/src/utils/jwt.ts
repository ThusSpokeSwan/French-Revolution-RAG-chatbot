import jwt from "jsonwebtoken";

export function generateToken(
  userId: string
) {
  const JWT_SECRET =
    process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is missing"
    );
  }

  console.log(
    "JWT_SECRET in jwt.ts:",
    process.env.JWT_SECRET
  );

  return jwt.sign(
    { userId },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}