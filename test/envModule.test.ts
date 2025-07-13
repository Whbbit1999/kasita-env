import { describe, expect, it, beforeEach } from 'vitest'
import { visibleLines, setActiveEditor, getActiveEditor } from '../src/state'
import { isEnvFile, getLineVisibility, toggleLineVisibility } from '../src/envUtils'

describe('state.ts', () => {
  beforeEach(() => {
    // Clear the map before each test
    visibleLines.clear()
    setActiveEditor(undefined)
  })

  it('should set and get active editor', () => {
    const mockEditor: any = { document: { uri: { toString: () => 'file:///test.env' } } }
    setActiveEditor(mockEditor)
    expect(getActiveEditor()).toBe(mockEditor)
  })

  it('should manage visibleLines correctly', () => {
    const uri = 'file:///test.env'
    expect(visibleLines.has(uri)).toBe(false)

    // Add a line
    toggleLineVisibility(uri, 0)
    expect(visibleLines.has(uri)).toBe(true)
    expect(visibleLines.get(uri)?.has(0)).toBe(true)

    // Toggle off
    toggleLineVisibility(uri, 0)
    expect(visibleLines.get(uri)?.has(0)).toBe(false)
  })
})

describe('envUtils.ts', () => {
  it('should correctly identify environment files', () => {
    expect(isEnvFile({ fileName: 'test.env', languageId: '' } as any)).toBe(true)
    expect(isEnvFile({ fileName: 'test.env.local', languageId: '' } as any)).toBe(true)
    expect(isEnvFile({ fileName: 'test.txt', languageId: 'dotenv' } as any)).toBe(true)
    expect(isEnvFile({ fileName: 'test.txt', languageId: 'env' } as any)).toBe(true)
    expect(isEnvFile({ fileName: 'test.js', languageId: 'javascript' } as any)).toBe(false)
  })

  it('should get line visibility', () => {
    const uri = 'file:///test.env'
    visibleLines.set(uri, new Set([5, 10]))

    expect(getLineVisibility(uri, 5)).toBe(true)
    expect(getLineVisibility(uri, 10)).toBe(true)
    expect(getLineVisibility(uri, 1)).toBe(false)
    expect(getLineVisibility('file:///another.env', 5)).toBe(false)
  })

  it('should toggle line visibility', () => {
    const uri = 'file:///test.env'

    // Initially not visible
    expect(toggleLineVisibility(uri, 0)).toBe(true) // Becomes visible
    expect(getLineVisibility(uri, 0)).toBe(true)

    // Toggle again, becomes not visible
    expect(toggleLineVisibility(uri, 0)).toBe(false) // Becomes hidden
    expect(getLineVisibility(uri, 0)).toBe(false)

    // Test with a new line
    expect(toggleLineVisibility(uri, 1)).toBe(true)
    expect(getLineVisibility(uri, 1)).toBe(true)
  })
})
