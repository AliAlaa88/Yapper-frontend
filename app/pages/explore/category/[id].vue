<template>
    <div class="min-h-screen">
        <CategoryPage :category-id="categoryId" @category-loaded="handleCategoryLoaded" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft } from 'lucide-vue-next'
import CategoryPage from '~/modules/explore/components/categoryTweets/index.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const categoryId = computed(() => route.params.id as string)
const categoryName = ref<string>('')

const handleCategoryLoaded = (category: any) => {
    if (category?.name) {
        categoryName.value = category.name
    }
}

definePageMeta({
    layout: 'main-layout',
    middleware: ['auth'],
})
</script>
