import { describe, it, expect } from 'vitest'
import { useMe } from '../../composables/useMe'

describe('useMe', () => {
    it('returns true when username matches', () => {
        const { isMe } = useMe('mhassan123')
        expect(isMe).toBe(true)
    })

    it('returns false when username does not match', () => {
        const { isMe } = useMe('differentuser')
        expect(isMe).toBe(false)
    })
})
