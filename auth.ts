import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { User } from "./app/lib/definitions";

const connectionPool = require("./db");

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await connectionPool.query(`
      SELECT * from users WHERE email='${email}'
    `);
    return user.rows[0];
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Credentials({
    async authorize(credentials) {
      const parsedCredentials = z
      .object({
        email: z.string().email(),
        password: z.string().min(6),
      }).safeParse(credentials);
      if (parsedCredentials.success) {
        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);
        if (!user) {
          return null;
        }
        const passwordMatched = await bcrypt.compare(password, user.password);
        if (passwordMatched) {
          return user;
        }
      }
      console.error("Invalid credentails");
      return null;
    }
  })]
});