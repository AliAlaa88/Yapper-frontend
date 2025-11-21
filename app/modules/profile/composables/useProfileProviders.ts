import { provide } from 'vue'
import { useSnackbar } from './useSnackbar'
import { useConfirmation } from './useConfirmation'

export function useProfileProviders() {
    const confirmation = useConfirmation()
    provide('confirmation', confirmation)

    const snackbar = useSnackbar()
    provide('snackbar', snackbar)

    return {
        confirmation,
        snackbar,
    }
}
