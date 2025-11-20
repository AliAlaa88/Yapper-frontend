export interface UploadMediaResponse {
    data: {
        url: string
        filename: string
        size: number
        mime_type: string
    }
    count: number
    message: string
}
