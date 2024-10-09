import NextAuth from 'next-auth'
import { authOptions } from '@/app/lib/auth'

// 创建处理函数
const handler = NextAuth(authOptions)

// 导出 GET 和 POST 处理函数
export { handler as GET, handler as POST }
