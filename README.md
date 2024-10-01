# Code Zero

Code Zero is a Next.js-based web application that provides an innovative platform for thinking and visualization. It leverages modern web technologies to create an interactive and user-friendly experience.

## Features

- User authentication (login and registration)
- Interactive thinking sessions
- Visualization of thoughts and ideas
- Dark mode support
- Responsive design for both desktop and mobile

## Technologies Used

- [Next.js 14](https://nextjs.org/) with App Router
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Shadcn UI](https://ui.shadcn.com/) for UI components
- [Drizzle ORM](https://orm.drizzle.team/) for database operations
- [PostgreSQL](https://www.postgresql.org/) as the database
- [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js/) for password hashing
- [JSON Web Tokens (JWT)](https://jwt.io/) for authentication

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- pnpm
- PostgreSQL database

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/code-zero.git
   cd code-zero
   ```

2. Install dependencies:

   ```
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Run database migrations:

   ```
   pnpm db:generate
   pnpm db:push
   ```

5. Start the development server:

   ```
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: Contains the main application code
  - `api/`: API routes for authentication
  - `auth/`: Authentication-related pages (login, register)
  - `components/`: Reusable React components
  - `layouts/`: Layout components
  - `lib/`: Utility functions and database configuration
- `public/`: Static assets
- `drizzle/`: Database migration files

## Development

- This project uses [Prettier](https://prettier.io/) for code formatting. It runs automatically before each commit.
- [ESLint](https://eslint.org/) is configured for code linting.
- [Husky](https://typicode.github.io/husky/#/) is set up to run pre-commit hooks.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
