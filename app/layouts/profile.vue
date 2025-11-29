<template>
    <MainLayout>
        <ProfileDataProvider :key="username" :username="username">
            <div
                class="sticky top-0 z-10 bg-primary/80 backdrop-blur-md transition-all duration-200"
            >
                <div class="flex items-center justify-between px-4 py-3">
                    <div class="flex items-center gap-8">
                        <button
                            type="button"
                            class="flex h-8 w-8 items-center justify-center rounded-full hover:bg-hover transition-colors"
                            :aria-label="$t('navigation.back')"
                            @click="router.back()"
                        >
                            <ArrowLeft :size="20" class="text-primary" />
                        </button>
                        <div class="flex flex-col">
                            <h2 class="text-xl font-bold text-primary">
                                {{ profile?.name }}
                            </h2>
                            <!-- <p class="text-xs text-muted">
                                {{ profile?.posts_count }} {{ $t('profile.tweets') }}
                            </p> -->
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button
                            type="button"
                            class="flex h-8 w-8 items-center justify-center rounded-full hover:bg-hover transition-colors"
                            :aria-label="$t('timeline.banner.search')"
                        >
                            <Search :size="24" class="text-primary" />
                        </button>
                        <ProfileFollowAction
                            v-if="profile?.user_id && !isMyProfile"
                            :user-id="profile.user_id"
                        />
                    </div>
                </div>
            </div>

            <ProfileHeader ref="profileHeaderRef" />
            <NuxtPage :key="username" />
        </ProfileDataProvider>

        <SnackBar />
        <ConfirmtionModal />
    </MainLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowLeft, Search } from 'lucide-vue-next'
import ProfileHeader from '../modules/profile/components/ProfileHeader/ProfileHeader.vue'
import ProfileDataProvider from '../modules/profile/components/ProfileDataProvider.vue'
import SnackBar from '../modules/profile/components/ProfileContent/SubComponents/SnackBar.vue'
import ConfirmtionModal from '~/modules/profile/components/ProfileHeader/SubComponents/ConfirmtionModal.vue'
import ProfileFollowAction from '~/modules/profile/components/ProfileHeader/SubComponents/ProfileFollowAction.vue'
import { useProfileProviders } from '~/modules/profile/composables/useProfileProviders'
import { useProfileStore } from '~/modules/profile/stores/profileStore'
import MainLayout from './main-layout.vue'

useProfileProviders()

const route = useRoute()
const router = useRouter()
const username = computed(() => route.params.username as string)

const profileStore = useProfileStore()
const { profile, isMyProfile } = storeToRefs(profileStore)
</script>
