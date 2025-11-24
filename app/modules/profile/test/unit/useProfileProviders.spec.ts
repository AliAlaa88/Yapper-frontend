import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useProfileProviders } from '../../composables/useProfileProviders'
import { ref } from 'vue'

const mockConfirmation = {
    showConfirmation: ref(false),
    confirmData: ref({
        username: '',
        header: '',
        bgColor: '',
        text: '',
        action: '',
        hover: '',
        message: '',
        handleClick: null as null | (() => void),
    }),
    handleShowConfirmation: vi.fn(),
}

const mockSnackbar = {
    showSnackbar: ref(false),
    snackbar: ref({
        username: '',
        message: '',
        action: '',
        handleClick: null as null | (() => void),
    }),
    handleShowSnackbar: vi.fn(),
}

vi.mock('../../composables/useConfirmation', () => ({
    useConfirmation: () => mockConfirmation,
}))

vi.mock('../../composables/useSnackbar', () => ({
    useSnackbar: () => mockSnackbar,
}))

describe('useProfileProviders', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns confirmation object', () => {
        const result = useProfileProviders()

        expect(result.confirmation).toBeDefined()
        expect(result.confirmation).toBe(mockConfirmation)
    })

    it('returns snackbar object', () => {
        const result = useProfileProviders()

        expect(result.snackbar).toBeDefined()
        expect(result.snackbar).toBe(mockSnackbar)
    })

    it('confirmation has expected properties and methods', () => {
        const result = useProfileProviders()

        expect(result.confirmation.showConfirmation).toBeDefined()
        expect(result.confirmation.confirmData).toBeDefined()
        expect(result.confirmation.handleShowConfirmation).toBeDefined()
    })

    it('snackbar has expected properties and methods', () => {
        const result = useProfileProviders()

        expect(result.snackbar.showSnackbar).toBeDefined()
        expect(result.snackbar.snackbar).toBeDefined()
        expect(result.snackbar.handleShowSnackbar).toBeDefined()
    })
})
