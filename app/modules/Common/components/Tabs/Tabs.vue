<template>
    <div class="w-full border-b border-primary bg-primary">
        <ul class="flex">
            <li
                v-for="tab in tabs"
                :key="tab.value"
                class="flex-1 text-center cursor-pointer transition-all duration-200 hover:bg-hover"
                @click="handleChange(tab.value)"
                :id="tab.test_id"
            >
                <button
                    class="relative w-full px-4 py-4 text-base font-medium transition-colors duration-200"
                    :class="
                        activeTab === tab.value ? 'text-primary' : 'text-muted'
                    "
                >
                    {{ tab.label }}
                    <span
                        v-if="activeTab === tab.value"
                        class="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-accent rounded-full"
                    />
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
interface Tab {
    label: string
    value: string
    test_id?: string
}

interface Props {
    tabs: Tab[]
    activeTab: string
    onChange: (tab: string) => void
}

const { tabs, activeTab, onChange } = defineProps<Props>()

const handleChange = (tab: string) => {
    onChange(tab)
}
</script>
