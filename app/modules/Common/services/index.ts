import { createMediaService as mediaServiceInstance } from './mediaService'
import { createSocketService as socketServiceInstance } from './socketServices'

export const createMediaService = () => {
    return mediaServiceInstance
}

export const createSocketService = () => {
    return socketServiceInstance
}
