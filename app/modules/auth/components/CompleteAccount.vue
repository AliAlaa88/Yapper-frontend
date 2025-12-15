<template>
    <ProfilePicture
        v-if="showProfilePicture"
        v-model:profilePicture="profileData.profilePicture"
        @next="onProfilePictureNext"
        @skip="onProfilePictureSkip"
        @close="onClose"
    />
    <Username
        v-if="showUsername"
        v-model:username="profileData.username"
        @next="onUsernameNext"
        @skip="onUsernameSkip"
        @back="onUsernameBack"
        @close="onClose"
        :Recommendations="props.Recommendations"
    />
    <Language
        v-if="showLanguage"
        v-model:selectedLanguage="profileData.language"
        @next="onLanguageNext"
        @skip="onLanguageSkip"
        @back="onLanguageBack"
        @close="onClose"
    />
    <Interests
        v-if="showInterests"
        v-model:selectedInterests="profileData.interests"
        @next="onInterestsNext"
        @skip="onInterestsSkip"
        @back="onInterestsBack"
        @close="onClose"
    />
    <WhoToFollow
        v-if="showWhoToFollow"
        @finish="onWhoToFollowFinish"
        @back="onWhoToFollowBack"
        @close="onClose"
    />
    <!-- Loading screen while fetching user data -->
    <div
        v-if="showLoading"
        class="fixed inset-0 flex flex-col items-center justify-center bg-primary z-50"
    >
        <Logo imgClass="w-16 mb-6 animate-pulse" />
        <div class="text-primary text-xl font-semibold">{{ $t('auth.common.loading') }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import ProfilePicture from './subComponents/CompleteAccountComponents/ProfilePicture.vue'
import Username from './subComponents/CompleteAccountComponents/Username.vue'
import Language from './subComponents/CompleteAccountComponents/Language.vue'
import Interests from './subComponents/CompleteAccountComponents/Interests.vue'
import WhoToFollow from './subComponents/CompleteAccountComponents/WhoToFollow.vue'
import Logo from '~/modules/Common/components/Logo'
import { useRouter } from 'vue-router'
import { useGetUserQuery } from '../queries/useGetuserQuery'
import { useUserStore } from '~/modules/auth/stores/userStore'
const userStore = useUserStore()
const router = useRouter()
const showProfilePicture = ref(false)
const showUsername = ref(false)
const showLanguage = ref(false)
const showInterests = ref(false)
const showWhoToFollow = ref(false)
const showLoading = ref(false)
const enableUserQuery = ref(false)
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
// Centralized profile completion state
const profileData = reactive({
    profilePicture: null as string | null,
    username: null as string | null,
    language: null as string | null,
    interests: [] as string[],
})

const props = defineProps<{
    Recommendations: string[]
    skipImg?: boolean
}>()

if (props.skipImg) {
    showUsername.value = true
} else {
    showProfilePicture.value = true
}

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'finish', data: typeof profileData): void
}>()

// Profile Picture handlers
const onProfilePictureNext = (imageUrl: string) => {
    profileData.profilePicture = imageUrl
    showProfilePicture.value = false
    showUsername.value = true
}

const onProfilePictureSkip = () => {
    profileData.profilePicture = null
    showProfilePicture.value = false
    showUsername.value = true
}

// Username handlers
const onUsernameNext = (username: string) => {
    profileData.username = username
    showUsername.value = false
    showLanguage.value = true
}

const onUsernameSkip = () => {
    profileData.username = null
    showUsername.value = false
    showLanguage.value = true
}

const onUsernameBack = () => {
    showUsername.value = false
    if (props.skipImg) {
        onClose()
    } else {
        showProfilePicture.value = true
    }
}

// Language handlers
const onLanguageNext = (language: string) => {
    profileData.language = language
    showLanguage.value = false
    showInterests.value = true
}

const onLanguageSkip = () => {
    profileData.language = null
    showLanguage.value = false
    showInterests.value = true
}

const onLanguageBack = () => {
    showLanguage.value = false
    showUsername.value = true
}

const getUserQuery = useGetUserQuery(
    enableUserQuery,
    (data) => {
        // Get token from store (should already be set from previous auth step)
        const token = userStore.getAccessToken()
        if (!token) {
            console.error('Token missing when completing account')
            userStore.logout()
            router.push('/auth')
            return
        }
        userStore.setAuth({
            access_token: token,
            user: data.data,
        })
        emit('finish', profileData)
        router.push('/')
    },
    (error) => {
        console.error('Failed to fetch user data after complete account:', error)
        // Still navigate even if fetch fails, user data might already be in store
        emit('finish', profileData)
        router.push('/')
    },
)

// Interests handlers
const onInterestsNext = (interests: string[]) => {
    profileData.interests = interests
    showInterests.value = false
    showWhoToFollow.value = true
}

const onInterestsSkip = () => {
    profileData.interests = []
    showInterests.value = false
    showWhoToFollow.value = true
}

const onInterestsBack = () => {
    showInterests.value = false
    showLanguage.value = true
}

// Who to Follow handlers
const onWhoToFollowFinish = (followedUsers: string[]) => {
    showWhoToFollow.value = false
    showLoading.value = true
    enableUserQuery.value = true
}


const onWhoToFollowBack = () => {
    showWhoToFollow.value = false
    showInterests.value = true
}

const onClose = () => {
    router.push('/')
}
</script>
