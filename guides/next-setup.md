# Modern Next App Setup Guide (2025)

This guide provides a streamlined, up-to-date setup for a new Next.js project using modern best practices.

**Prerequisites**

- **Node.js (>= 18 recommended):** Make sure you have Node.js and npm (or yarn/pnpm) installed. You can download Node.js from [https://nodejs.org/](https://nodejs.org/).
- **Package Manager:** npm (comes with Node.js), yarn, or pnpm. This guide uses `npm`, but feel free to adapt to your preferred package manager.

**1. Project Creation**

first intstall pnpm, which is a faster package manager than npm

```bash
npm install -g pnpm
```

then create the project

```bash
pnpm create next-app@latest
cd next-app
```

- pnpm create next-app@latest: This command uses pnpm's create feature to scaffold a new project using the latest version of Next.js.

```
Would you like to use TypeScript? Yes (Strongly recommended for type safety and maintainability).

Would you like to use ESLint? Yes (For code linting and enforcing consistent style).

Would you like to use Tailwind CSS? Yes (Optional, but highly recommended for rapid UI development. If you prefer a different styling solution, choose "No" and set it up later).

Would you like to use src/ directory? Yes (Keeps your project organized).

Would you like to use App Router? (recommended) Yes (The future of Next.js).

Would you like to use Turbopack for next dev? Yes (Turbopack is a promising technology that can dramatically improve the Next.js development experience)

Would you like to customize the default import alias? No (The default @/* is usually fine). If you do customize it, be consistent!
```
