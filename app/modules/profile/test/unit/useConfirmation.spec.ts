import { it, expect, vi, describe, afterEach } from 'vitest'
import { useConfirmation } from '../../composables/useConfirmation'

describe('useConfirmation', () => {
    afterEach(() => {
        vi.resetAllMocks()
    })

    it('should initialize showConfirmation with false', () => {
        const { showConfirmation } = useConfirmation()
        expect(showConfirmation.value).toBe(false)
    })

    it('should initialize confirmData with empty values', () => {
        const { showConfirmation, confirmData } = useConfirmation()
        expect(showConfirmation.value).toBe(false)
        expect(confirmData.value).toEqual({
            username: '',
            header: '',
            bgColor: '',
            text: '',
            action: '',
            hover: '',
            message: '',
            handleClick: null as null | (() => void),
        })
    })

    it('should show confirmation with all data', () => {
        const { showConfirmation, confirmData, handleShowConfirmation } = useConfirmation()
        const mockHandleClick = vi.fn()
        const username = 'hagar'
        handleShowConfirmation(
            'Block',
            'Block',
            'bg-red-500',
            'text-white',
            'hover:bg-red-500/85',
            `They will be able to see your public posts,
            but will no longer be able to engage with them.
            @${username} will also not be able to follow or message you,
            and you will not see notifications from them. `,
            mockHandleClick,
            username,
        )
        expect(showConfirmation.value).toBe(true)
        expect(confirmData.value).toEqual({
            username: username,
            header: 'Block',
            bgColor: 'bg-red-500',
            text: 'text-white',
            action: 'Block',
            hover: 'hover:bg-red-500/85',
            message: `They will be able to see your public posts,
            but will no longer be able to engage with them.
            @${username} will also not be able to follow or message you,
            and you will not see notifications from them. `,
            handleClick: mockHandleClick,
        })
    })

    it('should show confirmation without username in the header', () => {
        const { showConfirmation, confirmData, handleShowConfirmation } = useConfirmation()
        const mockHandleClick = vi.fn()
        const username = 'hagar'
        handleShowConfirmation(
            'Remove',
            'Remove this follower',
            'bg-red-500',
            'text-white',
            'hover:bg-red-500/85',
            `@${username} will be removed from
            your followers and won’t be notified by Yappper.
            They can follow you again in the future. `,
            mockHandleClick,
        )
        expect(showConfirmation.value).toBe(true)
        expect(confirmData.value).toEqual({
            username: '',
            header: 'Remove this follower',
            bgColor: 'bg-red-500',
            text: 'text-white',
            action: 'Remove',
            hover: 'hover:bg-red-500/85',
            message: `@${username} will be removed from
            your followers and won’t be notified by Yappper.
            They can follow you again in the future. `,
            handleClick: mockHandleClick,
        })
    })

    it('should execute handleClick', () => {
        const { confirmData, handleShowConfirmation } = useConfirmation()
        const mockHandleClick = vi.fn()
        const username = 'hagar'
        handleShowConfirmation(
            'Remove',
            'Remove this follower',
            'bg-red-500',
            'text-white',
            'hover:bg-red-500/85',
            `@${username} will be removed from
            your followers and won’t be notified by Yappper.
            They can follow you again in the future. `,
            mockHandleClick,
        )
        confirmData.value.handleClick?.()
        expect(confirmData.value.handleClick).toHaveBeenCalled()
    })
})
