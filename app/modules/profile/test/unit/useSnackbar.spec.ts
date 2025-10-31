import { it, expect, vi, describe, afterEach } from 'vitest'
import { useSnackbar } from '../../composables/useSnackbar'

describe('useSnackbar', () => {

    afterEach(() => {
        vi.resetAllMocks()
    })

    it('should initialize snackbar with empty values', () => {
        const { snackbar } = useSnackbar()
        expect(snackbar.value).toEqual({
            username: '',
            message: '',
            action: '',
            handleClick: null as null | (() => void),
        })
    })

    it('should initialize showSnackbar with false', () => {
        const { showSnackbar } = useSnackbar()
        expect(showSnackbar.value).toBe(false)
    })

    it('should show snackbar with all data', () => {
        const { showSnackbar, snackbar, handleShowSnackbar } = useSnackbar()
        const mockHandleClick = vi.fn()
        handleShowSnackbar('Hello', 'tester', 'Continue', mockHandleClick)
        expect(showSnackbar.value).toBe(true)
        expect(snackbar.value.message).toBe('Hello')
        expect(snackbar.value.username).toBe('tester')
        expect(snackbar.value.action).toBe('Continue')
        expect(snackbar.value.handleClick).toBe(mockHandleClick)
    })

    it('should show snackbar with only message', () => {
        const { showSnackbar, snackbar, handleShowSnackbar } = useSnackbar()
        handleShowSnackbar('test message only')
        expect(showSnackbar.value).toBe(true)
        expect(snackbar.value.message).toBe('test message only')
        expect(snackbar.value.username).toBe('')
        expect(snackbar.value.action).toBe('')
        expect(snackbar.value.handleClick).toBeNull()
    })

    it('should hide snackbar after 4 seconds', () => {
        vi.useFakeTimers()
        const { showSnackbar, snackbar, handleShowSnackbar } = useSnackbar()

        handleShowSnackbar('Hello', 'tester')
        expect(showSnackbar.value).toBe(true)
        expect(snackbar.value.message).toBe('Hello')
        expect(snackbar.value.username).toBe('tester')
        expect(snackbar.value.action).toBe('')
        expect(snackbar.value.handleClick).toBeNull()

        vi.advanceTimersByTime(4000)
        expect(showSnackbar.value).toBe(false)
    })

    it('should execute handleClick', () => {
        const { snackbar, handleShowSnackbar } = useSnackbar()
        const mockHandleClick = vi.fn()
        handleShowSnackbar('Hello', 'tester', 'Continue', mockHandleClick)
        snackbar.value.handleClick?.()
        expect(snackbar.value.handleClick).toHaveBeenCalled()
    })
})
