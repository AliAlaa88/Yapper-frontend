# Auth Routing Structure

## Routes Overview

The auth system now uses proper routing instead of modals. The URLs change as you navigate between different auth screens while maintaining the same background layout.

### Available Routes

1. **`/auth`** - Main authentication landing page
   - Shows "Happening now" screen
   - Has "Create account" and "Sign in" buttons
   - Background with logo on left side

2. **`/auth/login`** - Login page
   - URL: `http://localhost:3000/auth/login`
   - Shows login modal overlay on top of auth background
   - Users can close to go back to `/auth`
   - Has link to switch to signup

3. **`/auth/signup`** - Signup page
   - URL: `http://localhost:3000/auth/signup`
   - Shows create account modal overlay on top of auth background
   - Users can close to go back to `/auth`

4. **`/auth/forgot-password`** - Password reset page
   - URL: `http://localhost:3000/auth/forgot-password`
   - Shows forgot password form

## How It Works

### Layout Structure
```
/auth (base layout)
  ├── Background with logo
  ├── "Happening now" content
  └── <slot> for child routes

/auth/login (renders on top)
  └── Login modal component

/auth/signup (renders on top)
  └── Signup modal component
```

### Navigation Flow

```
/ (home)
  └── Auto-redirects to → /auth

/auth
  ├── Click "Create account" → /auth/signup
  └── Click "Sign in" → /auth/login

/auth/login
  ├── Click "✕" close button → /auth
  ├── Click "Sign up" link → /auth/signup
  └── Click "Forgot password?" → /auth/forgot-password

/auth/signup
  └── Click "✕" close button → /auth
```

## Implementation Details

### File Structure
```
app/
├── pages/
│   ├── index.vue                    # Redirects to /auth
│   └── auth/
│       ├── index.vue                # Main auth page (/auth)
│       ├── login.vue                # Login route (/auth/login)
│       ├── signup.vue               # Signup route (/auth/signup)
│       └── forgot-password.vue      # Forgot password (/auth/forgot-password)
└── modules/
    └── auth/
        ├── views/
        │   └── index.vue            # Auth layout component (reusable)
        └── components/
            ├── login.vue            # Login modal component
            ├── createAccount.vue    # Signup modal component
            └── forgetPassword.vue   # Forgot password component
```

### Key Components

#### `/app/modules/auth/views/index.vue`
- Provides the base auth layout with background
- Contains a `<slot>` for child components
- Navigation buttons that use `router.push()` to change routes

#### `/app/pages/auth/login.vue`
- Wraps login component in auth layout
- Handles close event to navigate back to `/auth`
- Handles switch event to navigate to `/auth/signup`

#### `/app/pages/auth/signup.vue`
- Wraps signup component in auth layout
- Handles close event to navigate back to `/auth`

## Benefits of This Approach

1. ✅ **URL Changes** - Each auth screen has its own unique URL
2. ✅ **Browser History** - Users can use back/forward buttons
3. ✅ **Deep Linking** - Can share direct links to login or signup
4. ✅ **Same Background** - All screens share the same auth layout
5. ✅ **SEO Friendly** - Each page has a unique route
6. ✅ **Bookmarkable** - Users can bookmark specific auth pages

## Testing

Visit these URLs to test:
- http://localhost:3000/ → auto-redirects to `/auth`
- http://localhost:3000/auth → main auth page
- http://localhost:3000/auth/login → login page
- http://localhost:3000/auth/signup → signup page
- http://localhost:3000/auth/forgot-password → password reset
