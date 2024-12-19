# NatureNest Frontend

A Next.js-based frontend application for the NatureNest platform, providing a modern and user-friendly interface for property rentals and bookings.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Testing](#testing)
- [Available Scripts](#available-scripts)
- [Development Guidelines](#development-guidelines)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- Yarn package manager (v1.22 or higher)
- Git (v2.0 or higher)
- A code editor (VS Code recommended)

## Getting Started

1. Clone the repository:

```bash
git clone [repository-url]
cd naturenest-frontend
```

2. Install dependencies:

```bash
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Start the development server:

```bash
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Environment Setup

### Required Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v1

# Authentication
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret
NEXT_PUBLIC_COOKIE_NAME=naturenest_token

# External Services
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# Feature Flags
NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=true
NEXT_PUBLIC_ENABLE_FACEBOOK_AUTH=true
```

### Development Tools Configuration

1. **ESLint Configuration**

```json
{
  "extends": ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"]
}
```

2. **Jest Configuration**

```javascript
{
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
}
```

## Project Structure

```
naturenest-frontend/
├── app/                    # Next.js 13+ app directory
│   ├── bookings/          # Booking-related pages
│   │   ├── [id]/         # Dynamic booking routes
│   │   ├── create/       # Create booking page
│   │   └── page.tsx      # Bookings list page
│   ├── favorites/         # Favorites pages
│   ├── profile/           # User profile pages
│   └── rentals/          # Property rental pages
├── components/            # Reusable React components
│   ├── form/             # Form-related components
│   │   ├── FormInput     # Input component
│   │   └── FormContainer # Form wrapper component
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── utils/                # Utility functions
│   ├── auth.ts          # Authentication utilities
│   ├── format.ts        # Formatting utilities
│   └── validation.ts    # Validation utilities
├── types/                # TypeScript type definitions
├── public/              # Static assets
└── __tests__/           # Test files
```

## Key Features

### Components

- **Form Components**:

  - `FormInput`: Reusable input component with validation
  - `FormContainer`: Form wrapper with common form handling
  - `DatePicker`: Custom date picker component
  - `FileUpload`: File upload component with preview

- **Authentication**:

  - JWT-based authentication
  - Social login integration
  - Protected routes
  - Session management

- **Booking System**:
  - Property availability calendar
  - Booking creation and management
  - Payment integration
  - Booking status tracking

### Utilities

- **Authentication**:

  - `auth.ts`: JWT token handling
  - Session management
  - Route protection

- **API Integration**:

  - Axios instance with interceptors
  - Error handling
  - Request/response transformation

- **Validation**:
  - Input validation
  - Form validation
  - Data type checking

## Testing

The project uses Jest and React Testing Library for unit testing. To run tests:

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

Test files are located in the `__tests__` directory, following the same structure as the source files.

## Available Scripts

- `yarn dev`: Start development server
- `yarn build`: Build production bundle
- `yarn start`: Start production server
- `yarn lint`: Run ESLint
- `yarn test`: Run tests
- `yarn type-check`: Run TypeScript type checking

## Development Guidelines

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write comprehensive unit tests
- Follow ESLint and Prettier configurations

### Component Development

- Create reusable components
- Implement proper prop validation
- Use TypeScript interfaces
- Document component usage
- Include unit tests

### Git Workflow

- Create feature branches from main
- Follow conventional commit messages
- Submit pull requests for review
- Ensure tests pass before merging

### Testing Guidelines

- Write unit tests for new components
- Test edge cases and error scenarios
- Maintain test coverage
- Use meaningful test descriptions

## Troubleshooting

### Common Issues

1. **Environment Variables**

   - Error: "API_URL is not defined"
   - Solution: Ensure `.env.local` is properly configured and the server is restarted

2. **Build Errors**

   - Error: "Module not found"
   - Solution: Run `yarn install` and clear `.next` directory

3. **Test Failures**

   - Issue: Jest tests failing with timezone errors
   - Solution: Ensure proper timezone mocking in test setup

4. **Authentication Issues**
   - Problem: Tokens not persisting
   - Solution: Check cookie settings and domain configuration

### Development Tips

1. **Hot Reload Not Working**

   ```bash
   # Clear Next.js cache
   rm -rf .next
   yarn dev
   ```

2. **Type Checking Errors**
   ```bash
   # Run type checking
   yarn type-check
   ```

## Deployment

### Production Build

1. Create production build:

   ```bash
   yarn build
   ```

2. Test production build locally:
   ```bash
   yarn start
   ```

### Deployment Options

1. **Vercel (Recommended)**

   - Connect your GitHub repository
   - Configure environment variables
   - Automatic deployments on push

2. **Docker Deployment**

   ```dockerfile
   # Build stage
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY . .
   RUN yarn install
   RUN yarn build

   # Production stage
   FROM node:18-alpine AS runner
   WORKDIR /app
   COPY --from=builder /app/.next ./.next
   COPY --from=builder /app/node_modules ./node_modules
   COPY --from=builder /app/package.json ./package.json
   COPY --from=builder /app/public ./public

   EXPOSE 3000
   CMD ["yarn", "start"]
   ```

3. **Manual Deployment**
   - Set up reverse proxy (Nginx recommended)
   - Configure SSL certificates
   - Set up process manager (PM2)

### Environment-Specific Configurations

```bash
# Development
.env.development

# Production
.env.production

# Testing
.env.test
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Add your license information here]
