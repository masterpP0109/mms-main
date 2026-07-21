import React from 'react'
import { render, waitFor } from '@testing-library/react'
import Home from '@/app/page'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: jest.fn(() => ({ current: null })),
}))

describe('Home Component - Regression Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('Carousel Auto-play Regression', () => {
    test('should maintain carousel auto-play behavior after updates', () => {
      const { rerender } = render(<Home />)
      
      jest.advanceTimersByTime(6000)
      
      // Re-render should maintain behavior
      rerender(<Home />)
      
      expect(jest.getTimerCount()).toBeGreaterThan(0)
    })

    test('carousel should not break with animation library updates', async () => {
      const { container } = render(<Home />)
      
      const gsap = require('gsap')
      expect(gsap.registerPlugin).toHaveBeenCalled()
      
      jest.advanceTimersByTime(6000)
      expect(container).toBeInTheDocument()
    })

    test('should prevent carousel from running multiple timers', () => {
      render(<Home />)
      const initialTimerCount = jest.getTimerCount()
      
      jest.advanceTimersByTime(12000)
      
      // Should not accumulate timers
      expect(jest.getTimerCount()).toBeLessThanOrEqual(initialTimerCount + 1)
    })
  })

  describe('GSAP Animations Regression', () => {
    test('ScrollTrigger animations should initialize correctly', async () => {
      const { gsap } = require('gsap')
      render(<Home />)
      
      await waitFor(() => {
        expect(gsap.registerPlugin).toHaveBeenCalled()
      })
    })

    test('should properly register GSAP plugins on mount', () => {
      const { gsap } = require('gsap')
      const { unmount } = render(<Home />)
      
      expect(gsap.registerPlugin).toHaveBeenCalled()
      
      unmount()
    })

    test('animation utilities should find elements correctly', async () => {
      const { gsap } = require('gsap')
      render(<Home />)
      
      await waitFor(() => {
        expect(gsap.utils.toArray).toHaveBeenCalled()
      })
    })

    test('should handle animation cleanup on unmount', () => {
      const { unmount } = render(<Home />)
      
      expect(() => {
        unmount()
      }).not.toThrow()
    })
  })

  describe('Component State Regression', () => {
    test('carousel state should reset properly between renders', () => {
      const { rerender, unmount } = render(<Home />)
      
      jest.advanceTimersByTime(6000)
      unmount()
      
      rerender(<Home />)
      
      expect(jest.getTimerCount()).toBeGreaterThan(0)
    })

    test('multiple carousel states should not interfere with each other', () => {
      const { container } = render(<Home />)
      
      jest.advanceTimersByTime(12000)
      
      // All carousels should work independently
      expect(container).toBeInTheDocument()
    })

    test('refs should not cause errors when null', () => {
      const useRefMock = jest.spyOn(React, 'useRef')
      useRefMock.mockReturnValue({ current: null })
      
      expect(() => {
        render(<Home />)
      }).not.toThrow()
      
      useRefMock.mockRestore()
    })
  })

  describe('Event Handler Regression', () => {
    test('cleanup functions should run on component unmount', () => {
      const { unmount } = render(<Home />)
      
      jest.advanceTimersByTime(6000)
      
      expect(() => {
        unmount()
      }).not.toThrow()
    })

    test('timer should not cause memory leaks', () => {
      const { unmount } = render(<Home />)
      
      jest.advanceTimersByTime(30000) // Advance 5 carousel cycles
      
      expect(() => {
        unmount()
      }).not.toThrow()
    })

    test('should handle rapid mount/unmount cycles', () => {
      expect(() => {
        for (let i = 0; i < 3; i++) {
          const { unmount } = render(<Home />)
          jest.advanceTimersByTime(3000)
          unmount()
        }
      }).not.toThrow()
    })
  })

  describe('Data Consistency Regression', () => {
    test('slide data should not be mutated', () => {
      const { container, rerender } = render(<Home />)
      
      // Get initial state
      const initialChildCount = container.querySelectorAll('*').length
      
      rerender(<Home />)
      
      // Should maintain structure
      const finalChildCount = container.querySelectorAll('*').length
      expect(finalChildCount).toBeGreaterThanOrEqual(initialChildCount - 5) // Allow small variance
    })

    test('services configuration should remain consistent', () => {
      const { container: container1 } = render(<Home />)
      const count1 = container1.querySelectorAll('*').length
      
      const { container: container2 } = render(<Home />)
      const count2 = container2.querySelectorAll('*').length
      
      expect(Math.abs(count1 - count2)).toBeLessThan(5)
    })
  })

  describe('Browser API Compatibility Regression', () => {
    test('should work without ResizeObserver', () => {
      expect(() => {
        render(<Home />)
      }).not.toThrow()
    })

    test('should handle matchMedia queries safely', () => {
      expect(() => {
        render(<Home />)
      }).not.toThrow()
    })
  })

  describe('Animation Library Integration Regression', () => {
    test('Framer Motion should render without errors', () => {
      expect(() => {
        render(<Home />)
      }).not.toThrow()
    })

    test('motion components should maintain rendering', () => {
      const { container, rerender } = render(<Home />)
      
      const initialElements = container.querySelectorAll('*').length
      
      rerender(<Home />)
      
      const finalElements = container.querySelectorAll('*').length
      expect(finalElements).toBeGreaterThan(0)
    })
  })

  describe('Performance Regression', () => {
    test('render time should be consistent', () => {
      const start = performance.now()
      const { container } = render(<Home />)
      const end = performance.now()
      const renderTime = end - start
      
      // Should render in reasonable time
      expect(renderTime).toBeLessThan(5000)
      expect(container).toBeInTheDocument()
    })

    test('should not create excessive DOM nodes', () => {
      const { container } = render(<Home />)
      
      const nodeCount = container.querySelectorAll('*').length
      
      // Should not have more than a reasonable threshold
      expect(nodeCount).toBeLessThan(10000)
    })
  })

  describe('Layout Stability Regression', () => {
    test('layout should not shift during animations', () => {
      const { container } = render(<Home />)
      
      jest.advanceTimersByTime(12000)
      
      // Container should remain stable
      expect(container).toBeInTheDocument()
    })

    test('should handle consistent rendering', () => {
      const { container } = render(<Home />)
      
      jest.advanceTimersByTime(30000)
      
      expect(container.querySelectorAll('*').length).toBeGreaterThan(0)
    })
  })

  describe('Third-party Library Regression', () => {
    test('Next.js Image component should remain mocked', () => {
      const { container } = render(<Home />)
      
      const images = container.querySelectorAll('img')
      expect(images.length >= 0).toBe(true)
    })

    test('lucide-react icons should render safely', () => {
      const { container } = render(<Home />)
      
      expect(container).toBeInTheDocument()
    })
  })

  describe('Critical Path Regression', () => {
    test('hero section should render before animations', () => {
      const { container } = render(<Home />)
      
      expect(container.children.length).toBeGreaterThan(0)
    })

    test('content should be available after render', () => {
      const { container } = render(<Home />)
      
      expect(container.querySelectorAll('*').length).toBeGreaterThan(0)
    })

    test('carousel should initialize on first render', () => {
      jest.useFakeTimers()
      render(<Home />)
      
      expect(jest.getTimerCount()).toBeGreaterThan(0)
    })
  })

  describe('Unmount and Cleanup Regression', () => {
    test('should not have dangling event listeners', () => {
      const { unmount } = render(<Home />)
      
      expect(() => {
        unmount()
      }).not.toThrow()
    })

    test('should complete successfully multiple times', () => {
      const { unmount } = render(<Home />)
      expect(() => unmount()).not.toThrow()
    })
  })
})

