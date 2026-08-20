// eslint-disable-next-line @typescript-eslint/no-require-imports
require('@testing-library/jest-dom')

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock GSAP to avoid errors in tests
jest.mock('gsap', () => ({
  gsap: {
    registerPlugin: jest.fn(),
    utils: {
      toArray: jest.fn((selector) => []),
    },
    fromTo: jest.fn(),
    from: jest.fn(),
    to: jest.fn(),
    set: jest.fn(),
    context: jest.fn((callback) => {
      // Execute the callback and return a context object with revert method
      callback()
      return {
        revert: jest.fn(),
      }
    }),
    timeline: jest.fn(() => ({
      fromTo: jest.fn(),
      from: jest.fn(),
      to: jest.fn(),
      play: jest.fn(),
      pause: jest.fn(),
    })),
  },
  ScrollTrigger: jest.fn(),
}))

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => children,
    section: ({ children, ...props }) => children,
  },
  AnimatePresence: ({ children }) => children,
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return '<img />'
  },
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Globe: () => null,
  MessageSquare: () => null,
  Shield: () => null,
  Users: () => null,
  Lock: () => null,
  Play: () => null,
  Heart: () => null,
  Briefcase: () => null,
  Compass: () => null,
  Sun: () => null,
  Video: () => null,
  Award: () => null,
  Star: () => null,
  Quote: () => null,
  ArrowRight: () => null,
  ChevronLeft: () => null,
  ChevronRight: () => null,
  Camera: () => null,
  Megaphone: () => null,
  Palette: () => null,
  PenTool: () => null,
}))

// Suppress specific React warnings
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Not implemented: HTMLFormElement.prototype.submit') ||
        args[0].includes('Received `true` for a non-boolean attribute') ||
        args[0].includes('Received `false` for a non-boolean attribute') ||
        args[0].includes('priority') ||
        args[0].includes('fill'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
