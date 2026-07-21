# Quick Testing Reference

## Commands Summary

| Command | Purpose |
|---------|---------|
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode (live reload) |
| `npm run test:coverage` | Generate coverage report |
| `npm test -- --verbose` | Run with detailed output |
| `npm test -- -t "pattern"` | Run tests matching pattern |
| `npm test -- page.functional.test.tsx` | Run specific test file |

## Test Suite Overview

### ✅ Functional Tests (33 tests)
**What:** Tests core functionality and features  
**File:** `__tests__/page.functional.test.tsx`  
**Focus:**
- Carousel auto-play (6-second intervals)
- State management
- Component rendering
- Event handling
- Accessibility structure

**Run:** `npm test page.functional.test.tsx`

### 🎯 Non-Functional Tests (42 tests)
**What:** Tests performance, accessibility, and quality  
**File:** `__tests__/page.nonfunctional.test.tsx`  
**Focus:**
- Performance metrics (< 2s render time)
- WCAG 2.1 accessibility compliance
- Browser compatibility
- Responsive design (mobile/tablet/desktop)
- Memory management

**Run:** `npm test page.nonfunctional.test.tsx`

### 🔄 Regression Tests (38 tests)
**What:** Ensures bugs don't resurface  
**File:** `__tests__/page.regression.test.tsx`  
**Focus:**
- Carousel stability
- GSAP animations
- State consistency
- Memory leaks
- Cross-browser compatibility

**Run:** `npm test page.regression.test.tsx`

## Expected Results

All 113 tests should **PASS** ✓

```
Test Suites: 3 passed, 3 total
Tests:       113 passed, 113 total
Time:        ~15-20 seconds
```

## Troubleshooting Quick Fixes

### Tests won't run
```bash
# Clear cache and reinstall
npm cache clean --force
npm install
```

### Timeout errors
- Increase Jest timeout: Add `jest.setTimeout(10000)` at test top
- Check system resources
- Disable other processes

### Memory issues
```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm test
```

### Specific test failing?
```bash
# Run just that test
npm test -- -t "test name here"

# With verbose output
npm test -- -t "test name here" --verbose
```

## Test Output Legend

| Symbol | Meaning |
|--------|---------|
| ✓ | Test passed |
| ✗ | Test failed |
| ○ | Test skipped |
| ● | Test pending |

## Coverage Report

After running `npm run test:coverage`, check:
- **statements:** Individual code statements executed
- **branches:** If/else paths covered
- **functions:** All functions called
- **lines:** All lines executed

**Target:** > 80% for all metrics

## Development Workflow

### Before starting work
```bash
npm run test:coverage
```

### During development
```bash
npm run test:watch
```

### Before committing
```bash
npm test
```

### Before deployment
```bash
npm test && npm run test:coverage
```

## File Structure

```
__tests__/
├── page.functional.test.tsx      # 33 functional tests
├── page.nonfunctional.test.tsx   # 42 non-functional tests
└── page.regression.test.tsx      # 38 regression tests

jest.config.js                     # Jest configuration
jest.setup.js                      # Global mocks & setup
TESTING.md                         # Detailed guide (this file's reference)
```

## Key Features Tested

### Carousel System ✓
- Auto-play every 6 seconds
- Slide cycling 0→1→2→0
- Timer cleanup on unmount
- Multiple carousel independence

### Animation System ✓
- GSAP ScrollTrigger initialization
- Framer Motion rendering
- Animation cleanup
- Reduced motion support

### Performance ✓
- Initial render: < 2 seconds
- DOM nodes: < 5000
- Memory: No leaks
- Re-renders: Optimized

### Accessibility ✓
- Semantic HTML
- Keyboard navigation
- Screen readers
- Color contrast
- Alt text
- ARIA landmarks

## Performance Benchmarks

| Metric | Target | Status |
|--------|--------|--------|
| Render time | < 2s | ✓ |
| Test suite | < 30s | ✓ |
| DOM nodes | < 5000 | ✓ |
| Memory leaks | 0 | ✓ |

## Next Steps

1. **Run tests:** `npm test`
2. **Check coverage:** `npm run test:coverage`
3. **Fix any failures:** Review test output
4. **Add more tests:** For new features
5. **Monitor performance:** Run regularly

## Resources

- [Jest Docs](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)

## Questions?

Refer to `TESTING.md` for comprehensive documentation.

---

**Setup Date:** July 16, 2026  
**Test Count:** 113  
**Frameworks:** Jest + React Testing Library  
**Scope:** Functional, Non-Functional, Regression
