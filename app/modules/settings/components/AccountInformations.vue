<template>
    <DetailedPanel title="Account information">
        <DetailedRow :category="categories[0] ?? { label: '', content: '', href: '' }" />
        <DetailedRow :category="categories[1] ?? { label: '', content: '', href: '' }" />
        <div
            class="block relative px-5 py-3 rounded transition-colors text-primary
            border-t border-b border-primary">
            <div class="flex justify-between items-center">
                <div>
                    <span class="block text-[15px] text-primary">Account creation</span>
                    <p class="text-muted text-[13px]">
                    </p>
                </div>
                <ChevronRight class="opacity-40 group-hover:text-white absolute right-3" />
            </div>
        </div>
        <DetailedRow :category="categories[2] ?? { label: '', content: '', href: '' }" />
        <DetailedRow :category="categories[3] ?? { label: '', content: '', href: '' }" />
        <DetailedRow :category="categories[4] ?? { label: '', content: '', href: '' }">
            <p class="text-muted text-[13px]">
                Change your date of birth on your profile.
            </p>
        </DetailedRow>
        <DetailedRow :category="categories[5] ?? { label: '', content: '', href: '' }" />
    </DetailedPanel>
</template>

<script lang="ts" setup>
import type { User } from '~/modules/Common/types/user'
import DetailedPanel from './DetailedPanel.vue'
import DetailedRow from './DetailedRow.vue'
import { getUser } from '~/utils/helpers'
const user = getUser() as User

const categories = [
    { label: 'Username', content: user.username, href: '/settings/screen_name' },
    { label: 'Email', content: user.email, href:'/settings/email'},
    { label: 'Country', content: user.country, href: '/settings/country' },
    { label: 'Languages', content: 'English, Arabic', href: '/settings/languages' },
    { label: 'Birth date', content: 'mar 23', href: '/settings/profile' },
    { label: 'Age', content: '34', href: '/settings/your_twitter_data/age' },
    { label: 'Account creation', content: user.created_at, href: '/settings/your_twitter_data/account_creation' },
]
</script>
