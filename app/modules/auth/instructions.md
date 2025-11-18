# Authentication Module CSS Guidelines

## Overview

This document provides guidance on how the authentication module should use the existing CSS classes defined in `main.css`. The classes are designed to support both light and dark modes seamlessly, with automatic color switching based on the user's theme preference.

---

## Core Color Classes

### Primary & Alternate Classes (Theme-Aware)

The authentication module relies on two fundamental color classes that automatically adapt to the current theme:

#### **`.bg-primary` & `.text-primary`**
- **Light Mode**: Background = `#f7f9f9` (light gray), Text = `#0f1419` (dark)
- **Dark Mode**: Background = `#000000` (black), Text = `#e7e9ea` (light gray)
- **Use Case**: Main container backgrounds, body text, default text color
- **Example**: Main auth dialog box, paragraphs, form labels

#### **`.bg-alternate` & `.text-alternate`**
- **Light Mode**: Background = `#0f1419` (dark), Text = `#ffffff` (white)
- **Dark Mode**: Background = `#ffffff` (white), Text = `#0f1419` (dark)
- **Use Case**: Action buttons, CTA elements, inverted contrast sections
- **Example**: "Next", "Sign In", "Sign Up" buttons

**Key Insight**: `primary` and `alternate` are **inverse pairs**. Use them together for maximum contrast and accessibility.

---

## Color Palette Usage

### Text Colors

| Class | Light Mode | Dark Mode | Use Case |
|-------|-----------|-----------|----------|
| `.text-primary` | `#0f1419` (dark) | `#e7e9ea` (light) | Body text, labels |
| `.text-secondary` | `#536471` (medium) | `#71767b` (medium) | Secondary text, hints |
| `.text-muted` | `#71767b` (gray) | `#8b98a5` (light gray) | Placeholder text, helper text |
| `.text-light` | `#8b98a5` (light) | `#cfd9de` (extra light) | Subtle text, disabled state |
| `.text-white` | `#ffffff` | `#16181c` | For inverse sections only |
| `.text-blue` | `#1d9bf0` | `#1d9bf0` | Links, interactive elements |
| `.text-red` | `#f4212e` | `#f4212e` | Error messages, validation alerts |
| `.text-green` | `#00ba7c` | `#00ba7c` | Success messages |

### Background Colors

| Class | Light Mode | Dark Mode | Use Case |
|-------|-----------|-----------|----------|
| `.bg-primary` | `#f7f9f9` (light) | `#000000` (black) | Main container, page background |
| `.bg-alternate` | `#0f1419` (dark) | `#ffffff` (white) | Buttons, action elements |
| `.bg-hover` | `#ebebeb` (gray) | `#16181c` (dark) | Hover states for primary bg |
| `.bg-hover-alternate` | `#ebebeb` (gray) | `#2f3336` (medium dark) | Hover states for alternate bg |
| `.bg-blue` | `#1d9bf0` | `#1d9bf0` | Blue buttons (not recommended for auth) |
| `.bg-red` | `#f4212e` | `#f4212e` | Danger/destructive actions |
| `.bg-green` | `#00ba7c` | `#00ba7c` | Success state backgrounds |

### Border Colors

| Class | Light Mode | Dark Mode | Use Case |
|-------|-----------|-----------|----------|
| `.border-primary` | `#eff3f4` (light) | `#2f3336` (dark) | Form input borders, dividers |
| `.border-dark` | `#eff3f4` (light) | `#2f3336` (dark) | Darker borders (same as primary in auth) |

---

## Component Usage Guidelines

### 1. **Form Inputs** (text, email, password, select)

```html
<!-- Correct Pattern -->
<input
    class="bg-primary text-primary border border-primary rounded-md px-4 py-2 
           focus:outline-none focus:border-blue"
    placeholder="..."
/>
```

**Explanation**:
- `bg-primary`: Input background (light in light mode, dark in dark mode)
- `text-primary`: Input text color (dark in light mode, light in dark mode)
- `border-primary`: Input border (subtle in both modes)
- `focus:border-blue`: Clear focus indicator with the X blue accent

**Validation Error State**:
```html
<!-- Add error styling dynamically -->
<input
    :class="[
        'bg-primary text-primary border rounded-md px-4 py-2',
        isError ? 'border-red focus:border-red' : 'border-primary focus:border-blue'
    ]"
/>
```

### 2. **Main Container/Modal**

```html
<!-- Correct Pattern -->
<div class="bg-primary text-primary rounded-2xl p-8">
    <!-- All text inside inherits text-primary -->
    <h1 class="text-3xl font-bold">Sign In</h1>
    <p>Secondary text uses text-secondary or text-muted</p>
</div>
```

### 3. **Action Buttons**

```html
<!-- Primary Action Button -->
<button class="bg-alternate text-alternate hover:bg-hover-alternate 
               font-semibold rounded-full py-2 px-6 transition">
    Next
</button>

<!-- Secondary Action Button -->
<button class="border border-primary text-primary hover:bg-hover 
               font-semibold rounded-full py-2 px-6 transition">
    Cancel
</button>
```

**Explanation**:
- Use `.bg-alternate` for primary CTA buttons (high contrast)
- Use `.hover-bg-hover-alternate` for the hover effect
- Use `.border-primary` + `.text-primary` for secondary buttons

### 4. **Error Messages**

```html
<!-- Correct Pattern -->
<p class="text-red text-sm mt-1">{{ errorMessage }}</p>
```

### 5. **Success Messages**

```html
<!-- Correct Pattern -->
<p class="text-green text-sm mt-1">{{ successMessage }}</p>
```

### 6. **Links**

```html
<!-- Correct Pattern -->
<a href="#" class="text-blue hover:underline font-semibold">
    Forgot password?
</a>
```

### 7. **Dividers/Separators**

```html
<!-- Correct Pattern -->
<div class="flex items-center gap-3">
    <div class="flex-1 h-px border-t border-primary"></div>
    <span class="text-muted text-sm">OR</span>
    <div class="flex-1 h-px border-t border-primary"></div>
</div>
```

### 8. **Labels & Helper Text**

```html
<!-- Label -->
<label class="text-primary font-semibold mb-2 block">Date of Birth</label>

<!-- Helper text -->
<p class="text-muted text-sm mb-4">This will not be shown publicly</p>
```

---

## Common Patterns in Auth Module

### Login Form

```vue
<div class="bg-primary text-primary rounded-2xl p-8">
    <!-- Header -->
    <h2 class="text-3xl font-bold mb-6">Sign in to X</h2>
    
    <!-- Input -->
    <input class="w-full bg-primary text-primary border border-primary 
                  rounded-md px-4 py-2 focus:border-blue mb-4" 
           placeholder="Email, phone, or username" />
    
    <!-- Error -->
    <p v-if="error" class="text-red text-sm mb-4">{{ error }}</p>
    
    <!-- Button -->
    <button class="w-full bg-alternate text-alternate hover:bg-hover-alternate 
                   font-semibold rounded-full py-2 transition">
        Next
    </button>
    
    <!-- Link -->
    <p class="text-center text-sm mt-4">
        Don't have an account?
        <a href="#" class="text-blue hover:underline font-semibold">Sign up</a>
    </p>
</div>
```

### Form with Validation

```vue
<div class="mb-4">
    <input
        v-model="email"
        @blur="validateEmail"
        @input="clearError"
        :class="[
            'w-full bg-primary text-primary border rounded-md px-4 py-2',
            emailError ? 'border-red focus:border-red' : 'border-primary focus:border-blue'
        ]"
        placeholder="Email"
    />
    <p v-if="emailError" class="text-red text-xs mt-1">{{ emailError }}</p>
</div>
```

---

## Best Practices

### ✅ DO:

1. **Use `bg-primary` + `text-primary`** for main containers and body text
2. **Use `bg-alternate` + `text-alternate`** for action buttons
3. **Use `border-primary`** for form input borders
4. **Use `.text-blue`** for links and interactive text
5. **Use `.text-red` / `.text-green`** for validation feedback
6. **Apply `transition`** class for smooth hover effects
7. **Test in both light and dark modes** before committing
8. **Use semantic class combinations** (bg + text together for contrast)

### ❌ DON'T:

1. **Don't hardcode colors** like `bg-white`, `text-black`, etc.
2. **Don't use `bg-primary` without `text-primary`** (or vice versa) for readability
3. **Don't forget hover states** (always add `:hover` variant)
4. **Don't mix `primary` and `alternate`** without purpose
5. **Don't ignore the `border-primary`** class for form inputs
6. **Don't use `bg-blue`** for auth buttons (use `bg-alternate` instead)

---

## Dark Mode Testing

The CSS automatically handles dark mode via CSS custom properties. To test:

1. Add `.dark` class to `<html>` element or use browser dev tools
2. All color variables automatically switch to their dark mode values
3. No component changes needed—only CSS variables update

Example variables that change:
```css
/* Light Mode */
--color-x-background: #f7f9f9;    /* Light gray */
--color-x-alternate: #0f1419;     /* Dark */

/* Dark Mode */
--color-x-background: #000000;    /* Black */
--color-x-alternate: #ffffff;     /* White */
```

---

## Form Input States

### Default State
```
Background: bg-primary
Text: text-primary
Border: border-primary
```

### Focus State
```
Border: border-blue (or focus:border-blue)
```

### Error State
```
Border: border-red
Outline: (optional) Error message with text-red
```

### Disabled State
```
Background: bg-primary with opacity or bg-hover
Text: text-light
Opacity: opacity-50
Cursor: cursor-not-allowed
```

---

## Summary Table

| Component | Background | Text | Border | Hover |
|-----------|-----------|------|--------|-------|
| Container | `bg-primary` | `text-primary` | — | — |
| Input | `bg-primary` | `text-primary` | `border-primary` | `focus:border-blue` |
| Button (CTA) | `bg-alternate` | `text-alternate` | — | `hover:bg-hover-alternate` |
| Button (Secondary) | transparent | `text-primary` | `border-primary` | `hover:bg-hover` |
| Error Text | — | `text-red` | `border-red` | — |
| Link | — | `text-blue` | — | `hover:underline` |
| Helper Text | — | `text-muted` | — | — |
| Divider | — | `text-muted` | `border-primary` | — |

---

## Questions & Support

For questions about CSS class usage, refer to `/app/assets/css/main.css` for the authoritative source. Each class is defined in the `@layer utilities` section with corresponding dark mode overrides in `:root.dark`.

---

# Internationalization (i18n) & RTL/LTR Guidelines

## Overview

The authentication module must fully support both Arabic (RTL - Right-to-Left) and English (LTR - Left-to-Right) languages. The layout, text alignment, and component positioning must automatically adapt based on the selected language using Nuxt i18n configuration.

**Important**: All text content must use i18n localization keys (e.g., `$t('auth.login.title')`). Do NOT use hardcoded text strings.

---

## i18n Configuration

### Locale Files
- **Location**: `/locales/` (root directory)
- **Files**: 
  - `en.json` - English translations
  - `ar.json` - Arabic translations
- **Namespace**: All auth keys use `auth.*` structure

### Nuxt i18n Setup
```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  i18n: {
    defaultLocale: 'ar',
    fallbackLocale: 'ar',
    langDir: 'locales/',
    locales: [
      { code: 'ar', iso: 'ar-SA', dir: 'rtl' },
      { code: 'en', iso: 'en-US', dir: 'ltr' }
    ]
  }
})
```

---

## RTL/LTR Layout Direction

### Automatic Direction Switching

The i18n module automatically sets the `dir` attribute on the `<html>` element:
- **Arabic (`ar`)**: `dir="rtl"` - Right-to-Left layout
- **English (`en`)**: `dir="ltr"` - Left-to-Right layout

**DO NOT manually set the `dir` attribute** in components—it's handled by the Nuxt i18n module.

---

## Text Alignment Guidelines

### Default Behavior
CSS text alignment utilities automatically adapt to the current direction:
- **LTR Mode (English)**: `text-left` aligns to the left, `text-right` aligns to the right
- **RTL Mode (Arabic)**: `text-left` aligns to the right, `text-right` aligns to the left

### Recommended Patterns

#### Main Titles & Headings
```vue
<h2 class="text-3xl font-bold text-left mb-6">
  {{ $t('auth.login.title') }}
</h2>
```
- Use `text-left` for primary content alignment
- Automatically reverses in RTL mode

#### Body Text & Descriptions
```vue
<p class="text-primary text-base">
  {{ $t('auth.description') }}
</p>
```
- Default text alignment is inherited and respects `dir` attribute
- No explicit alignment class needed

#### Centered Content (Logos, Dividers)
```vue
<div class="flex justify-center mb-6">
  <!-- Logo or centered content -->
</div>
```
- Use `flex justify-center` for truly centered content
- Works identically in both LTR and RTL

#### Right-Aligned Content
```vue
<p class="text-right text-muted text-sm">
  {{ $t('auth.footnote') }}
</p>
```
- Use `text-right` when content should align to the trailing edge
- Automatically reverses: right in LTR, left in RTL

---

## Layout Direction (Flexbox & Grid)

### Flex Layout
```vue
<!-- For horizontal layouts that should reverse in RTL -->
<div class="flex items-center gap-3">
  <div class="flex-1 h-px border-t border-primary"></div>
  <span class="text-muted text-sm">{{ $t('auth.or') }}</span>
  <div class="flex-1 h-px border-t border-primary"></div>
</div>
```
- Flexbox automatically reverses order in RTL mode
- Use `gap-3` for consistent spacing in both directions

### Grid Layout
```vue
<div class="grid grid-cols-2 gap-3">
  <!-- Grid items automatically reverse in RTL -->
</div>
```
- CSS Grid respects `dir` attribute
- Columns flow right-to-left in RTL, left-to-right in LTR

---

## Component Positioning & Margins

### Padding & Margin Utilities

**LTR-Safe (Bidirectional)**:
```vue
<input class="px-4 py-2 mb-4" /> <!-- Horizontal padding, bottom margin -->
```
- `px-*` (horizontal padding) - Works in both directions
- `py-*` (vertical padding) - Works in both directions
- `mb-*` / `mt-*` (vertical margins) - Works in both directions

**Direction-Specific** (Automatic Adaptation):
```vue
<!-- Use logical properties instead of directional ones -->
<div class="pl-4 pr-8"> <!-- Use ml-* and mr-* with caution -->
```
- `pl-*` (padding-left) - Becomes padding-right in RTL
- `pr-*` (padding-right) - Becomes padding-left in RTL
- `ml-*` (margin-left) - Becomes margin-right in RTL
- `mr-*` (margin-right) - Becomes margin-left in RTL

**✅ Recommended**: Use symmetric padding/margin when possible:
```vue
<input class="px-4 py-2" /> <!-- Symmetric horizontal padding -->
```

---

## Form Elements & Inputs

### Input Fields (Text, Email, Password, etc.)

**Basic Pattern**:
```vue
<input 
  class="w-full bg-primary text-primary border-2 border-primary rounded-md px-4 py-2 focus:outline-none focus:border-blue transition-colors"
  :placeholder="$t('auth.login.identifierPlaceholder')"
  v-model="identifier"
/>
```
- Text automatically aligns to start edge (left in LTR, right in RTL)
- Placeholder text respects language direction
- **Important**: Always use i18n for placeholder text

### Select Dropdowns with Direction-Specific Icons

**Pattern for Select with Arrow Icon**:
```vue
<div class="relative">
  <select
    class="w-full bg-primary text-primary border-2 border-primary rounded-md px-4 py-3 focus:outline-none focus:border-blue appearance-none"
  >
    <option value="" disabled selected>{{ $t('auth.signup.month') }}</option>
  </select>
  <span class="absolute top-1/2 -translate-y-1/2 pointer-events-none text-primary" :class="isArabic ? 'left-3' : 'right-3'">
    ▼
  </span>
</div>
```

**Script Setup**:
```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const isArabic = computed(() => locale.value === 'ar')
</script>
```

**Why This Pattern**:
- In LTR (English): Arrow appears on the right (`right-3`)
- In RTL (Arabic): Arrow appears on the left (`left-3`)
- Prevents overlap with dropdown text in both directions

### Alternative Using Logical CSS Properties
```vue
<!-- If supported in your CSS framework -->
<span class="absolute top-1/2 -translate-y-1/2 pointer-events-none text-primary inset-e-3">
  ▼
</span>
```
- `inset-e-*` = "inset inline-end" (automatically adapts to direction)
- Works in modern browsers without computed properties

---

## Buttons & Interactive Elements

### Button Text Alignment
```vue
<button class="w-full bg-alternate text-alternate hover:bg-hover-alternate font-semibold rounded-full py-2 transition">
  {{ $t('auth.common.next') }}
</button>
```
- Button text automatically centers
- No special handling needed for RTL

### Buttons with Icons
```vue
<button class="flex items-center justify-center gap-2">
  <img src="..." alt="..." class="w-5 h-5" />
  {{ $t('auth.OAuth.continueWithGoogle') }}
</button>
```
- `flex items-center justify-center` centers content
- Icon + text order automatically reverses in RTL
- Gap spacing works in both directions

### Back/Close Icon Buttons
```vue
<!-- Back Button (Top-Left in LTR, Top-Right in RTL) -->
<button 
  class="absolute top-4 left-4 text-primary hover:bg-hover rounded-full p-2 transition duration-200"
  @click="$emit('close')"
>
  <ArrowLeft class="w-5 h-5" />
</button>
```

**Correct RTL Pattern**:
```vue
<button 
  :class="[
    'absolute top-4 text-primary hover:bg-hover rounded-full p-2 transition duration-200',
    isArabic ? 'right-4' : 'left-4'
  ]"
  @click="$emit('close')"
>
  <ArrowLeft class="w-5 h-5" />
</button>
```

---

## Specific Component Guidelines

### 1. Login Form (loginStep1, loginStep2)

**Title Alignment**:
```vue
<h2 class="text-3xl font-bold text-left mb-6">{{ $t('auth.login.title') }}</h2>
```

**Divider**:
```vue
<div class="flex items-center my-4 w-full">
  <div class="flex-1 h-px border-t border-primary"></div>
  <span class="px-3 text-muted text-sm">{{ $t('auth.common.or') }}</span>
  <div class="flex-1 h-px border-t border-primary"></div>
</div>
```

**Link Text**:
```vue
<p class="text-center text-primary text-sm">
  {{ $t('auth.login.switchPrompt') }}
  <button class="text-blue hover:underline font-semibold">
    {{ $t('auth.common.signUp') }}
  </button>
</p>
```

### 2. Signup Form (createAccount, verifyOtp, FinalRegister)

**Date of Birth Selectors**:
```vue
<div class="flex gap-3 mb-4">
  <!-- Month, Day, Year dropdowns with dynamic arrow positioning -->
  <div class="flex-1 relative">
    <select class="w-full ...">
      <option>{{ $t('auth.signup.month') }}</option>
    </select>
    <span 
      class="absolute top-1/2 -translate-y-1/2 pointer-events-none text-primary"
      :class="isArabic ? 'left-3' : 'right-3'"
    >
      ▼
    </span>
  </div>
  <!-- Day and Year follow same pattern -->
</div>
```

**Label Text**:
```vue
<label class="text-primary font-semibold mb-2 block">
  {{ $t('auth.label.email') }}
</label>
```

### 3. Forgot Password Flow

**Step Headers**:
```vue
<h2 class="text-3xl font-bold text-left mb-6">
  {{ $t('auth.forgotPassword.step1Title') }}
</h2>
```

**Helper Text**:
```vue
<p class="text-muted mb-6">{{ $t('auth.forgotPassword.step1Info') }}</p>
```

### 4. Complete Account (Profile, Username, Language, Interests)

**Interest Pills**:
```vue
<button
  v-for="interest in interests"
  :key="interest.id"
  :class="[
    'px-4 py-3 rounded-full text-sm font-medium transition',
    selectedInterests.includes(interest.id)
      ? 'bg-alternate text-alternate'
      : 'border-2 border-primary text-primary hover:bg-hover',
  ]"
>
  {{ interest.icon }} {{ interest.name }}
</button>
```
- Text center alignment handles RTL automatically
- Icon + name order works in both directions

**Username Input with @ Symbol**:
```vue
<div class="relative">
  <span 
    class="absolute top-1/2 -translate-y-1/2 text-muted pointer-events-none"
    :class="isArabic ? 'right-4' : 'left-4'"
  >
    @
  </span>
  <input
    type="text"
    placeholder="username"
    class="w-full bg-primary text-primary border-2 border-primary rounded-full px-4 py-2.5 focus:outline-none focus:border-blue"
    :class="isArabic ? 'pr-8' : 'pl-8'"
  />
</div>
```

**Language Selection List**:
```vue
<button
  v-for="lang in languages"
  :key="lang.code"
  class="w-full text-left px-4 py-3 rounded-lg transition flex items-center justify-between"
  :class="selectedLanguage === lang.code ? 'bg-alternate text-alternate' : 'hover:bg-hover'"
>
  <span>{{ lang.name }} ({{ lang.nativeName }})</span>
  <svg v-if="selectedLanguage === lang.code" class="w-5 h-5">
    <!-- Checkmark icon -->
  </svg>
</button>
```

---

## i18n Translation Keys

### Required Keys in `/locales/en.json` and `/locales/ar.json`

**Auth Namespace Structure**:
```json
{
  "auth": {
    "login": {
      "title": "Sign in to X",
      "identifierPlaceholder": "Email, phone, or username",
      "forgotPassword": "Forgot password?",
      "switchPrompt": "Don't have an account?"
    },
    "signup": {
      "title": "Create your account",
      "namePlaceholder": "Name",
      "emailPlaceholder": "Email",
      "month": "Month",
      "day": "Day",
      "year": "Year",
      "dobTitle": "What's your birth date?",
      "dobInfo": "This will not be shown publicly."
    },
    "common": {
      "next": "Next",
      "signUp": "Sign up",
      "signIn": "Sign in",
      "password": "Password",
      "resendCode": "Resend code",
      "or": "OR",
      "skip": "Skip"
    }
  }
}
```

---

## Testing RTL/LTR Support

### Manual Testing Checklist

**English (LTR)**:
- ✅ Text aligns to the left
- ✅ Buttons appear in correct order
- ✅ Dropdowns arrows on the right
- ✅ Back/Close buttons in top-left
- ✅ All placeholder text readable

**Arabic (RTL)**:
- ✅ Text aligns to the right
- ✅ Buttons reverse order horizontally
- ✅ Dropdown arrows on the left
- ✅ Back/Close buttons in top-right
- ✅ @ symbol appears on right of username input
- ✅ Month/Day/Year don't overlap with arrows
- ✅ No horizontal scrolling issues

### Automated Testing
```javascript
// Test example: Check if locale changes direction
const { locale } = useI18n()
locale.value = 'ar'
// Verify: <html dir="rtl">
locale.value = 'en'
// Verify: <html dir="ltr">
```

---

## Common RTL/LTR Issues & Solutions

### Issue 1: Dropdown Arrow Overlaps Text in RTL
**Problem**: Fixed `right-3` positioning causes overlap in RTL
**Solution**: Use computed property to toggle left/right:
```vue
<span :class="isArabic ? 'left-3' : 'right-3'">▼</span>
```

### Issue 2: Back Button Position Changes
**Problem**: Back button hardcoded to `left-4` appears on wrong side in RTL
**Solution**:
```vue
:class="[
  'absolute top-4',
  isArabic ? 'right-4' : 'left-4'
]"
```

### Issue 3: @ Symbol in Username Input
**Problem**: Symbol position unclear in RTL
**Solution**: Compute position based on locale:
```vue
<span :class="isArabic ? 'right-4 pr-8' : 'left-4 pl-8'">@</span>
```

### Issue 4: Placeholder Text Direction
**Problem**: Placeholder text doesn't respect RTL
**Solution**: Always use i18n-translated placeholders:
```vue
:placeholder="$t('auth.login.identifierPlaceholder')"
```

### Issue 5: Icon + Text Button Order
**Problem**: Icon appears on wrong side of text in RTL
**Solution**: Use flexbox; it automatically reverses:
```vue
<button class="flex items-center gap-2">
  <img src="..." />
  {{ $t('auth.OAuth.continueWithGoogle') }}
</button>
<!-- In RTL, icon moves to right, text to left automatically -->
```

---

## Summary: RTL/LTR Checklist

Before committing auth module changes, verify:

- ✅ All visible text uses `$t('auth.*')` localization keys
- ✅ No hardcoded English/Arabic text strings
- ✅ Text alignment uses `text-left` or `text-right` appropriately
- ✅ Dropdown arrows position dynamically: `isArabic ? 'left-3' : 'right-3'`
- ✅ Directional icons (back, close) positioned dynamically
- ✅ Special symbols (@, ▼, etc.) positioned for correct RTL
- ✅ No hardcoded `dir` attributes—rely on i18n config
- ✅ Flexbox/Grid layouts reverse automatically in RTL
- ✅ No `px-l-*` or `px-r-*` utilities without considering RTL
- ✅ Tested in both English (LTR) and Arabic (RTL) modes
- ✅ No horizontal scrolling or overflow in either direction
- ✅ All form inputs accept input text in both directions

---

## Constraints & Scope

**This guidance applies ONLY to**: `/app/modules/auth/`

**DO NOT modify**:
- `/app/assets/css/main.css` - Color system remains unchanged
- `nuxt.config.ts` i18n settings - Already configured
- Locale files outside auth (`/locales/` at root level may be shared)
- Non-auth modules

**DO update/create**:
- All auth component templates for i18n keys
- Select dropdowns with direction-aware arrow positioning
- Button and icon positioning with computed RTL classes
- Form input symbols with computed positioning

