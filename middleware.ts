import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/auth/login',
  },
})

export const config = {
  matcher: [
    '/api/chat-sessions/:path*',
    '/api/messages/:path*',
    // Add other protected API routes here
  ],
}
