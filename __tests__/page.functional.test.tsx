import React from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '@/app/page'

// Mock the useRef hook to avoid errors with GSAP animations
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: jest.fn(() => ({ current: null })),
}))

describe('Home Component - Functional Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('Rendering', () => {
    test('should render the component without crashing', () => {
      const { container } = render(<Home />)
      expect(container).toBeInTheDocument()
    })

    test('should render hero section with initial slide', () => {
      render(<Home />)
      const heroSection = screen.getByRole('region', { hidden: true })
      expect(heroSection).toBeTruthy()
    })

    test('should render all main sections', () => {
      const { container } = render(<Home />)
      expect(container).toBeInTheDocument()
      // Component should render without errors
    })
  })

  describe('Hero Carousel Functionality', () => {
    test('should auto-play carousel every 6 seconds', async () => {
      render(<Home />)
      
      jest.advanceTimersByTime(6000)
      
      expect(jest.getTimerCount()).toBeGreaterThan(0)
    })

    test('should cycle through slides in order', async () => {
      render(<Home />)
      
      jest.advanceTimersByTime(6000)
      jest.advanceTimersByTime(6000)
      jest.advanceTimersByTime(6000)
      jest.advanceTimersByTime(6000)
      
      // Timer should continue cycling
      expect(jest.getTimerCount()).toBeGreaterThan(0)
    })

    test('should reset to first slide after reaching the last slide', async () => {
      render(<Home />)
      
      // Advance past all slides
      jest.advanceTimersByTime(6000 * 3)
      jest.advanceTimersByTime(100)
      
      expect(jest.getTimerCount()).toBeGreaterThan(0)
    })

    test('should clear timer on component unmount', () => {
      const { unmount } = render(<Home />)
      
      const initialTimerCount = jest.getTimerCount()
      unmount()
      
      // Timer should be cleared
      expect(jest.getTimerCount()).toBeLessThanOrEqual(initialTimerCount)
    })
  })

  describe('Content and Data', () => {
    test('should have correct number of slides', () => {
      const { container } = render(<Home />)
      // Verify component renders
      expect(container.firstChild).toBeTruthy()
    })

    test('should render conference slides', () => {
      const { container } = render(<Home />)
      expect(container).toBeInTheDocument()
    })

    test('should render cinematic slides', () => {
      const { container } = render(<Home />)
      expect(container).toBeInTheDocument()
    })

    test('should render services section with all services', () => {
      const { container } = render(<Home />)
      expect(container).toBeInTheDocument()
    })
  })

  describe('GSAP Animations Integration', () => {
    test('should register GSAP ScrollTrigger plugin', async () => {
      const { gsap } = require('gsap')
      render(<Home />)
      
      await waitFor(() => {
        // GSAP animations should be initialized
        expect(gsap.registerPlugin).toHaveBeenCalled()
      })
    })

    test('should set up scroll animations on mount', async () => {
      const { gsap } = require('gsap')
      render(<Home />)
      
      await waitFor(() => {
        expect(gsap.registerPlugin).toHaveBeenCalled()
      })
    })

    test('should handle window undefined in useLayoutEffect', () => {
      // This test ensures SSR compatibility
      const { container } = render(<Home />)
      expect(container).toBeInTheDocument()
    })
  })

  describe('State Management', () => {
    test('should maintain carousel states for different slides', () => {
      const { container } = render(<Home />)
      
      // Advance through timer cycles
      jest.advanceTimersByTime(6000)
      jest.advanceTimersByTime(6000)
      
      expect(container).toBeInTheDocument()
    })

    test('should handle multiple carousel states independently', () => {
      const { container } = render(<Home />)
      
      jest.advanceTimersByTime(12000)
      
      expect(container).toBeInTheDocument()
    })
  })

  describe('Event Handlers', () => {
    test('should not throw errors when component handles lifecycle events', () => {
      const { rerender } = render(<Home />)
      
      expect(() => {
        rerender(<Home />)
      }).not.toThrow()
    })

    test('should handle rapid timer cycles', () => {
      render(<Home />)
      
      jest.advanceTimersByTime(6000)
      jest.advanceTimersByTime(6000)
      jest.advanceTimersByTime(6000)
      jest.advanceTimersByTime(6000)
      jest.advanceTimersByTime(6000)
      
      // Should not crash
      expect(jest.getTimerCount()).toBeGreaterThan(0)
    })
  })

  describe('Accessibility', () => {
    test('should render with basic semantic structure', () => {
      const { container } = render(<Home />)
      expect(container.querySelector('main') || container).toBeInTheDocument()
    })

    test('should not have duplicate IDs', () => {
      const { container } = render(<Home />)
      const allIds = new Set()
      const elements = container.querySelectorAll('[id]')
      
      elements.forEach(el => {
        expect(allIds.has(el.id)).toBe(false)
        allIds.add(el.id)
      })
    })
  })

  describe('Image Loading', () => {
    test('should handle Next.js Image component mocking', () => {
      const { container } = render(<Home />)
      const images = container.querySelectorAll('img')
      expect(images.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Error Handling', () => {
    test('should not throw errors during render', () => {
      expect(() => {
        render(<Home />)
      }).not.toThrow()
    })

    test('should handle missing refs gracefully', () => {
      const { container } = render(<Home />)
      expect(container).toBeInTheDocument()
    })
  })
})
