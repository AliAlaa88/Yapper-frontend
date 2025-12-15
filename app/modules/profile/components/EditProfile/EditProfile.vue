<template>
    <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
        <div
            class="relative w-full h-full flex items-start justify-center overflow-y-auto py-4 sm:py-8"
        >
            <div
                id="edit-profile-modal"
                ref="editProfileModalRef"
                class="relative w-full max-w-[600px] bg-primary rounded-2xl mx-4"
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

                <EditProfileForm
                    v-model="formData"
                    @update:is-birth-date-valid="isBirthDateValid = $event"
                />

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
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'nuxt/app'
import { useProfileStore } from '../../stores/profileStore'
import { storeToRefs } from 'pinia'
import { useEditProfileMutation } from '../../queries/useEditProfileQuery'
import EditProfileHeader from './SubComponents/EditProfileHeader.vue'
import EditProfileCover from './SubComponents/EditProfileCover.vue'
import EditProfileAvatar from './SubComponents/EditProfileAvatar.vue'
import EditProfileForm from './SubComponents/EditProfileForm.vue'
import { useUserStore } from '~/modules/auth/stores/userStore'

const userStore = useUserStore()
const { user: storeUser } = storeToRefs(userStore)
const router = useRouter()
const profileStore = useProfileStore()
const { profile: user } = storeToRefs(profileStore)
const userId = computed(() => user.value?.user_id || '')
const username = computed(() => user.value?.username || '')
const { editProfileMutation, uploadCoverPhotoMutation, uploadAvatarMutation } =
    useEditProfileMutation(userId.value, username.value)

const isSaving = computed(
    () =>
        editProfileMutation.isPending.value ||
        uploadCoverPhotoMutation.isPending.value ||
        uploadAvatarMutation.isPending.value,
)

const formData = ref({
    name: '',
    bio: '',
    country: '',
    birth_date: '',
})

const avatarUrl = ref<string | null>(null)
const coverUrl = ref<string | null>(null)
const isBirthDateValid = ref(true)
const coverFileInput = ref<HTMLInputElement | null>(null)
const avatarFileInput = ref<HTMLInputElement | null>(null)
const editProfileModalRef = ref<HTMLElement | null>(null)

onMounted(() => {
    if (user.value) {
        formData.value = {
            name: user.value.name || '',
            bio: user.value.bio || '',
            country: user.value.country || '',
            birth_date: user.value.birth_date || '',
        }
        avatarUrl.value = user.value.avatar_url || ''
        coverUrl.value = user.value.cover_url || ''
    }
})

const isFormValid = computed(() => {
    return formData.value.name.trim().length > 0 && isBirthDateValid.value
})

const closeModal = () => {
    router.back()
}

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        closeModal()
    }
}

const handleClickOutside = (event: MouseEvent) => {
    if (editProfileModalRef.value && !editProfileModalRef.value.contains(event.target as Node)) {
        closeModal()
    }
}

onMounted(async () => {
    window.addEventListener('keydown', handleKeydown)
    await nextTick()
    setTimeout(() => {
        document.addEventListener('click', handleClickOutside, true)
    }, 0)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    document.removeEventListener('click', handleClickOutside, true)
})

const handleCoverUpload = () => {
    coverFileInput.value?.click()
}

const handleAvatarUpload = () => {
    avatarFileInput.value?.click()
}

const handleCoverFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
        try {
            const imageUrl = await uploadCoverPhotoMutation.mutateAsync(file)
            coverUrl.value = imageUrl
        } catch (error) {
            console.error('Failed to upload cover photo:', error)
        }
    }
}

const handleAvatarFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
        try {
            const imageUrl = await uploadAvatarMutation.mutateAsync(file)
            avatarUrl.value = imageUrl
        } catch (error) {
            console.error('Failed to upload avatar:', error)
        }
    }
}

const handleCoverRemove = () => {
    coverUrl.value = null
    if (coverFileInput.value) {
        coverFileInput.value.value = ''
    }
}

const handleAvatarRemove = () => {
    avatarUrl.value = null
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
        birth_date: formData.value.birth_date,
        avatar_url: avatarUrl.value || null,
        cover_url: coverUrl.value || null,
    }

    try {
        await editProfileMutation.mutateAsync(updates)
        // Update the userStore with partial updates
        if (storeUser.value && user.value?.user_id) {
            userStore.updateUser({
                name: updates.name,
                bio: updates.bio,
                country: updates.country,
                birth_date: updates.birth_date,
                avatar_url: updates.avatar_url ?? undefined,
            })
        }
        closeModal()
    } catch (error) {
        console.error('Failed to save profile:', error)
    }
}
</script>
