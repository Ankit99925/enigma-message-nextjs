import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcrypt";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        let lastError;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          try {
            await dbConnect();

            if (!credentials?.identifier || !credentials?.password) {
              throw new Error("Missing credentials");
            }

            const user = await User.findOne({
              email: credentials.identifier
            });

            if (!user) {
              console.log("User not found");
              throw new Error("Invalid credentials");
            }
            if (!user.isVerified) {
              throw new Error("Please verify your email");
            }

            const passwordsMatch = await bcrypt.compare(credentials.password, user.password);
            if (!passwordsMatch) {
              console.log("Invalid password");
              throw new Error("Invalid credentials");
            }

            return user;
          } catch (error) {
            console.error(`Auth attempt ${attempt} failed:`, error);
            lastError = error;

            if (attempt < MAX_RETRIES) {
              await sleep(RETRY_DELAY * attempt); // Exponential backoff
              continue;
            }
          }
        }

        // If we get here, all retries failed
        throw lastError || new Error("Authentication failed after multiple attempts");
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.username = token.username;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
        token.isAcceptingMessages = user.isAcceptingMessages;
      }
      return token;
    }
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
