# Accessibility Guide - WCAG 2.1 AA Compliance

## ✅ Task #4 Status: Infrastructure Complete

This guide documents accessibility features implemented and provides patterns for the team.

---

## 🎯 WCAG 2.1 Level AA Compliance

### Implemented Features

#### 1. ✅ Skip Navigation (2.4.1 - Bypass Blocks)
**Component:** `src/components/SkipToContent.tsx`

```tsx
import { SkipToContent } from "@/components/SkipToContent";

// Already integrated in layout.tsx
```

- **What it does:** Allows keyboard users to skip repetitive navigation
- **How to use:** Press Tab on page load - "דלג לתוכן הראשי" link appears
- **Keyboard:** Tab → Enter jumps to main content
- **Status:** ✅ Active on all pages

---

#### 2. ✅ ARIA Live Regions (4.1.3 - Status Messages)
**Component:** `src/components/LiveAnnouncer.tsx`

```tsx
import { useLiveAnnouncer } from "@/components/LiveAnnouncer";

function MyComponent() {
  const { announce } = useLiveAnnouncer();

  const handleSubmit = () => {
    // Success announcement
    announce("הטופס נשלח בהצלחה", "polite");

    // Critical error
    announce("שגיאה קריטית! נא לנסות שנית", "assertive");
  };
}
```

**Priority levels:**
- `"polite"` - Non-urgent announcements (default)
- `"assertive"` - Urgent announcements that interrupt screen reader

**Status:** ✅ Active globally via LiveAnnouncerProvider

---

#### 3. ✅ Focus Management (2.4.3 - Focus Order)
**Location:** `src/app/form/page.tsx`

- Auto-focus on step container when navigating between steps
- Announces current step to screen readers
- Example: "שלב 2 מתוך 7: פרטים אישיים"

**How it works:**
```tsx
useEffect(() => {
  stepContainerRef.current?.focus();
  announce(`שלב ${currentStep + 1} מתוך ${steps.length}: ${stepLabel}`, "polite");
}, [currentStep]);
```

**Status:** ✅ Active in FormWizard

---

#### 4. ✅ Accessible Form Fields (3.3.2 - Labels or Instructions)
**Component:** `src/components/FormField.tsx`

```tsx
<FormField
  id="firstName"
  label="שם פרטי"
  required
  autoComplete="given-name"
  description="הזן שם פרטי כפי שמופיע בתעודה מזהה"
  register={register("firstName")}
  error={errors.firstName}
/>
```

**Features:**
- ✅ Required field indicator (`*`)
- ✅ `aria-required="true"` for screen readers
- ✅ `aria-invalid="true"` when validation fails
- ✅ `aria-describedby` links to error messages
- ✅ `role="alert"` on error messages
- ✅ Browser autocomplete support

**Status:** ✅ Ready to use (replace old FormInput)

---

#### 5. ✅ Accessible Navigation Buttons (2.1.1 - Keyboard)
**Component:** `src/components/NavigationButtons.tsx`

```tsx
<NavigationButtons
  onNext={handleNext}
  onPrev={handlePrev}
  nextDisabled={!isValid}
  isLoading={isSubmitting}
  nextLabel="המשך"
  prevLabel="חזור"
/>
```

**Features:**
- ✅ Disabled states with `aria-disabled`
- ✅ Loading states with `aria-busy` + spinner
- ✅ Focus visible indicators (ring-2)
- ✅ Keyboard navigation (Enter/Space)
- ✅ Touch-friendly (44x44px minimum)

**Status:** ✅ Ready to integrate in all steps

---

## 📋 Implementation Checklist

### For Each Form Step:

- [ ] Replace `FormInput` with `FormField`
- [ ] Add `required` prop to mandatory fields
- [ ] Add `autoComplete` attributes (see MDN autocomplete tokens)
- [ ] Use `NavigationButtons` component
- [ ] Add `aria-label` to icon-only buttons
- [ ] Test with keyboard only (no mouse)
- [ ] Test with screen reader (VoiceOver/NVDA)

---

## 🎹 Keyboard Navigation

### Global Shortcuts:
| Key | Action |
|-----|--------|
| `Tab` | Next focusable element |
| `Shift + Tab` | Previous focusable element |
| `Enter` | Activate button/link |
| `Space` | Activate button/checkbox |
| `Escape` | Close modal/dialog (when implemented) |

### Form Navigation:
| Key | Action |
|-----|--------|
| `Enter` | Submit form (when on submit button) |
| `Tab` | Move between fields |
| `Arrow Up/Down` | Select option in dropdown |

---

## 🔍 Testing Procedures

### 1. Keyboard-Only Test
```
✅ Can Tab through all interactive elements
✅ Focus visible at all times (blue/gold ring)
✅ Can activate all buttons with Enter/Space
✅ Tab order is logical (right-to-left for Hebrew)
✅ No keyboard traps
```

### 2. Screen Reader Test (VoiceOver on Mac)
```bash
# Turn on VoiceOver
Cmd + F5

# Navigate
VO + Right Arrow  # Next element
VO + Left Arrow   # Previous element
VO + Space        # Activate element
```

**Test scenarios:**
- [ ] Form labels are announced correctly
- [ ] Required fields are announced as "שדה חובה"
- [ ] Error messages are announced immediately
- [ ] Step changes are announced
- [ ] Loading states are announced

### 3. Browser DevTools Audit
```
1. Open Chrome DevTools
2. Go to "Lighthouse" tab
3. Check "Accessibility"
4. Run audit
5. Target: 95+ score
```

---

## 🚨 Common Accessibility Mistakes to Avoid

### ❌ DON'T:
```tsx
// Missing label
<input type="text" placeholder="שם פרטי" />

// Icon button without label
<button><XIcon /></button>

// Disabled without aria-disabled
<button disabled onClick={handler}>Submit</button>

// Empty alt text on informative images
<img src="chart.png" alt="" />

// Using div as button
<div onClick={handler}>Click me</div>
```

### ✅ DO:
```tsx
// Proper label
<FormField id="firstName" label="שם פרטי" required />

// Icon button with aria-label
<button aria-label="סגור"><XIcon /></button>

// Disabled with aria-disabled
<button disabled aria-disabled="true">Submit</button>

// Descriptive alt text
<img src="chart.png" alt="גרף תשואות שנתיות - עלייה של 15%" />

// Use button element
<button onClick={handler}>Click me</button>
```

---

## 🎨 Focus Styles

All interactive elements have visible focus indicators:

```css
focus:outline-none
focus:ring-2
focus:ring-guardian-gold
focus:ring-offset-2
```

**Never use:** `outline: none` without replacement!

---

## 📱 Touch Accessibility

All interactive elements meet WCAG 2.1 minimum touch target size:

- **Minimum:** 44x44px (mobile)
- **Buttons:** `py-4` = 48px height
- **Icons:** `w-5 h-5` (20px) inside 44x44px touch area

---

## 🌍 RTL Accessibility

All ARIA attributes work correctly in RTL:
- ✅ `dir="rtl"` on HTML tag
- ✅ Logical properties for layout
- ✅ Hebrew ARIA labels
- ✅ RTL-aware focus indicators

---

## 📚 Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Screen Reader Guide](https://webaim.org/articles/screenreader_testing/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

---

## 🎯 Next Steps

### Remaining Accessibility Tasks:

1. **Modal Dialogs** (when implemented)
   - Focus trapping
   - Escape key to close
   - Return focus on close

2. **Error Summary** (nice-to-have)
   - List all form errors at top
   - Links to each error field

3. **Contrast Checker**
   - Audit all color combinations
   - Ensure 4.5:1 ratio for text

4. **Automated Testing**
   - Add jest-axe to unit tests
   - Add pa11y to CI/CD

---

**Last Updated:** 2026-02-15
**Compliance Level:** WCAG 2.1 Level AA (In Progress)
**Test Status:** Manual testing required
