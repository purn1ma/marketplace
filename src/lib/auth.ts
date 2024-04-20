import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  // pages: {
  //   signIn: "/sign-in",
  // },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "xyz@gmail.com" },
        password: { label: "password", type: "password" },
      },

      async authorize(credentials, req) {
      
          const user = await db.user.findFirst({
            where: {
              email: credentials?.email,
            },
          });
          console.log(user);

          if (!user) {
            return null;
          }

          //if google login mail is used
          if (user.password === undefined) {
            return null;
          }

          if (user.password !== credentials?.password) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        (session.user.id = token.id),
          (session.user.name = token.name),
          (session.user.email = token.email),
          (session.user.image = token.picture);
      }
      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });
      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
    redirect() {
      return "/";
    },
  },
};
export const getAuthSession = () => getServerSession(authOptions);
