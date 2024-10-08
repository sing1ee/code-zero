import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from '@/app/lib/db'
import { users } from '@/app/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { DefaultSession } from 'next-auth'
import { AuthOptions } from 'next-auth'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user?: {
      id: string
    } & DefaultSession['user']
  }
}
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .limit(1)

        if (user.length === 0) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user[0].password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user[0].id.toString(),
          email: user[0].email,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
