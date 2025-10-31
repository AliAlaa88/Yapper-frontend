<template>
    <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" @click.self="closeModal">
        <div
            class="relative w-full h-full flex items-start justify-center overflow-y-auto py-4 sm:py-8"
        >
            <div
                id="edit-profile-modal"
                class="relative w-full max-w-[600px] bg-black rounded-2xl mx-4"
                @click.stop
            >
                <EditProfileHeader
                    :is-valid="isFormValid"
                    :is-saving="isSaving"
                    @close="closeModal"
                    @save="handleSave"
                />

                <EditProfileCover
                    :cover-url="coverUrl"
                    @upload="handleCoverUpload"
                    @remove="handleCoverRemove"
                />

                <EditProfileAvatar
                    :avatar-url="avatarUrl"
                    @upload="handleAvatarUpload"
                    @remove="handleAvatarRemove"
                />

                <EditProfileForm v-model="formData" />

                <input
                    id="cover-file-input"
                    ref="coverFileInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleCoverFileChange"
                />
                <input
                    id="avatar-file-input"
                    ref="avatarFileInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleAvatarFileChange"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'nuxt/app'
import { storeToRefs } from 'pinia'
import { useProfilePhotoStore } from '../../stores/photo'
import { useUserInfoQuery } from '../../queries/useUserInfoQuery'
import { useEditProfileMutation } from '../../queries/useEditProfileQuery'
import EditProfileHeader from './SubComponents/EditProfileHeader.vue'
import EditProfileCover from './SubComponents/EditProfileCover.vue'
import EditProfileAvatar from './SubComponents/EditProfileAvatar.vue'
import EditProfileForm from './SubComponents/EditProfileForm.vue'

const route = useRoute()
const router = useRouter()

const username = route.params.username as string
const userQuery = useUserInfoQuery(username)
const user = computed(() => userQuery.data.value)

const photoStore = useProfilePhotoStore()
const { photoUrl: avatarUrl, coverUrl } = storeToRefs(photoStore)

const formData = ref({
    name: '',
    bio: '',
    country: '',
    created_at: '',
})

const coverFileInput = ref<HTMLInputElement | null>(null)
const avatarFileInput = ref<HTMLInputElement | null>(null)

// Edit profile mutation - will be initialized when user is available
const userId = computed(() => user.value?.id || '')
const editProfileMutation = useEditProfileMutation(userId.value, username)

const isSaving = computed(() => editProfileMutation.isPending.value)

onMounted(() => {
    if (user.value) {
        formData.value = {
            name: user.value.name || '',
            bio: user.value.bio || '',
            country: user.value.country || '',
            created_at: user.value.created_at || '',
        }
        photoStore.setPhotoUrl(user.value.avatar_url || '')
        photoStore.setCoverUrl(user.value.cover_url || '')
    }
})

const isFormValid = computed(() => {
    return formData.value.name.trim().length > 0
})

const closeModal = () => {
    router.push(`/profile/${route.params.username}`)
}

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        closeModal()
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    photoStore.clearPhotoUrl()
    photoStore.clearCoverUrl()
})

const handleCoverUpload = () => {
    coverFileInput.value?.click()
}

const handleAvatarUpload = () => {
    avatarFileInput.value?.click()
}

const handleCoverFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            const result = e.target?.result as string
            photoStore.setCoverUrl(result)
        }
        reader.readAsDataURL(file)
    }
}

const handleAvatarFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            const result = e.target?.result as string
            photoStore.setPhotoUrl(result)
        }
        reader.readAsDataURL(file)
    }
}

const handleCoverRemove = () => {
    photoStore.clearCoverUrl()
    if (coverFileInput.value) {
        coverFileInput.value.value = ''
    }
}

const handleAvatarRemove = () => {
    photoStore.clearPhotoUrl()
    if (avatarFileInput.value) {
        avatarFileInput.value.value = ''
    }
}

const handleSave = async () => {
    if (!user.value) return

    const updates = {
        name: formData.value.name,
        bio: formData.value.bio,
        country: formData.value.country,
        created_at: formData.value.created_at,
        avatar_url: avatarUrl.value || undefined,
        cover_url: coverUrl.value || undefined,
    }

    try {
        await editProfileMutation.mutateAsync(updates)
        closeModal()
    } catch (error) {
        console.error('Failed to save profile:', error)
    }
}
</script>
