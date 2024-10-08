import type { Config } from 'drizzle-kit'

export default {
  schema: './app/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // 添加 verbose 选项
  verbose: true,
} satisfies Config
