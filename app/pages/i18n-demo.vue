<template>
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
            <!-- Header Section -->
            <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h1 class="text-4xl font-bold text-gray-900 mb-2">
                            {{ $t('demo.title') }}
                        </h1>
                        <p class="text-xl text-gray-600">
                            {{ $t('demo.subtitle') }}
                        </p>
                    </div>
                    <!-- Language Switcher -->
                    <div class="flex gap-2">
                        <button
                            v-for="locale in availableLocales"
                            :key="locale.code"
                            @click="switchLocale(locale.code)"
                            :class="[
                                'px-6 py-3 rounded-lg font-semibold transition-all',
                                currentLocale === locale.code
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                            ]"
                        >
                            {{ locale.name }}
                        </button>
                    </div>
                </div>
                <p class="text-gray-700 leading-relaxed">
                    {{ $t('demo.description') }}
                </p>
                <div class="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p class="text-sm font-semibold text-blue-900">
                        {{ $t('currentLocale') }}:
                        <span class="font-mono">{{ currentLocale }}</span> ({{ currentDirection }})
                    </p>
                </div>
            </div>

            <!-- Features Overview -->
            <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">
                    {{ $t('features.title') }}
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div class="text-green-600 font-semibold">
                            ✓ {{ $t('features.translation') }}
                        </div>
                    </div>
                    <div class="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div class="text-green-600 font-semibold">
                            ✓ {{ $t('features.pluralization') }}
                        </div>
                    </div>
                    <div class="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div class="text-green-600 font-semibold">
                            ✓ {{ $t('features.interpolation') }}
                        </div>
                    </div>
                    <div class="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div class="text-green-600 font-semibold">
                            ✓ {{ $t('features.formatting') }}
                        </div>
                    </div>
                    <div class="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div class="text-green-600 font-semibold">✓ {{ $t('features.rtl') }}</div>
                    </div>
                </div>
            </div>

            <!-- Translation Examples -->
            <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">
                    1. {{ $t('features.translation') }}
                </h2>
                <div class="space-y-4">
                    <div class="p-4 bg-gray-50 rounded-lg">
                        <p class="text-lg">{{ $t('welcome') }}</p>
                        <p class="text-sm text-gray-500 mt-1">Key: welcome</p>
                    </div>
                    <div class="p-4 bg-gray-50 rounded-lg">
                        <p class="text-lg">{{ $t('hello') }} / {{ $t('goodbye') }}</p>
                        <p class="text-sm text-gray-500 mt-1">Keys: hello, goodbye</p>
                    </div>
                </div>
            </div>

            <!-- Interpolation Examples -->
            <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">
                    2. {{ $t('features.interpolation') }}
                </h2>
                <div class="space-y-4">
                    <div class="p-4 bg-gray-50 rounded-lg">
                        <p class="text-lg">{{ $t('examples.greeting', { name: userName }) }}</p>
                        <p class="text-sm text-gray-500 mt-1">Variable: name = "{{ userName }}"</p>
                    </div>
                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            {{ $t('form.name') }}:
                        </label>
                        <input
                            v-model="userName"
                            type="text"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            :placeholder="$t('form.name')"
                        />
                    </div>
                </div>
            </div>

            <!-- Pluralization Examples -->
            <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">
                    3. {{ $t('features.pluralization') }}
                </h2>
                <div class="space-y-4">
                    <div class="p-4 bg-gray-50 rounded-lg">
                        <p class="text-lg mb-4">{{ $t('examples.userCount', userCount) }}</p>
                        <div class="flex items-center gap-4">
                            <button
                                @click="userCount = Math.max(0, userCount - 1)"
                                class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                -
                            </button>
                            <span class="text-xl font-bold">{{ userCount }}</span>
                            <button
                                @click="userCount++"
                                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <div class="p-4 bg-gray-50 rounded-lg">
                        <p class="text-lg mb-4">
                            {{ $t('examples.itemCount', { count: itemCount }, itemCount) }}
                        </p>
                        <div class="flex items-center gap-4">
                            <button
                                @click="itemCount = Math.max(0, itemCount - 1)"
                                class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                -
                            </button>
                            <span class="text-xl font-bold">{{ itemCount }}</span>
                            <button
                                @click="itemCount++"
                                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Date & Number Formatting -->
            <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">
                    4. {{ $t('features.formatting') }}
                </h2>
                <div class="space-y-4">
                    <div class="p-4 bg-gray-50 rounded-lg">
                        <p class="text-sm font-semibold text-gray-600 mb-2">Date:</p>
                        <p class="text-lg">{{ formattedDate }}</p>
                    </div>
                    <div class="p-4 bg-gray-50 rounded-lg">
                        <p class="text-sm font-semibold text-gray-600 mb-2">Number:</p>
                        <p class="text-lg">{{ formattedNumber }}</p>
                    </div>
                    <div class="p-4 bg-gray-50 rounded-lg">
                        <p class="text-sm font-semibold text-gray-600 mb-2">Currency:</p>
                        <p class="text-lg">{{ formattedCurrency }}</p>
                    </div>
                </div>
            </div>

            <!-- Form Example -->
            <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">5. Form Labels Example</h2>
                <form class="space-y-4" @submit.prevent>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            {{ $t('form.name') }}
                        </label>
                        <input
                            type="text"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            :placeholder="$t('form.name')"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            {{ $t('form.email') }}
                        </label>
                        <input
                            type="email"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            :placeholder="$t('form.email')"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            {{ $t('form.password') }}
                        </label>
                        <input
                            type="password"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            :placeholder="$t('form.password')"
                        />
                    </div>
                    <div class="flex gap-4">
                        <button
                            type="submit"
                            class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            {{ $t('form.submit') }}
                        </button>
                        <button
                            type="button"
                            class="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                        >
                            {{ $t('form.cancel') }}
                        </button>
                    </div>
                </form>
            </div>

            <!-- Navigation Example -->
            <div class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">6. Navigation Example</h2>
                <nav class="flex flex-wrap gap-4">
                    <a
                        href="#"
                        class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                    >
                        {{ $t('navigation.home') }}
                    </a>
                    <a
                        href="#"
                        class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                    >
                        {{ $t('navigation.profile') }}
                    </a>
                    <a
                        href="#"
                        class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                    >
                        {{ $t('navigation.settings') }}
                    </a>
                    <a
                        href="#"
                        class="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                    >
                        {{ $t('navigation.logout') }}
                    </a>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const currentLocale = computed(() => locale.value)
const availableLocales = computed(() => locales.value)
const currentDirection = computed(() => {
    const currentLocaleObj = locales.value.find((l: any) => l.code === locale.value)
    return currentLocaleObj?.dir || 'ltr'
})

const userName = ref('Ahmed')
const userCount = ref(0)
const itemCount = ref(1)

const switchLocale = async (newLocale: string) => {
    await setLocale(newLocale)
}

const currentDate = new Date()
const formattedDate = computed(() => {
    return new Intl.DateTimeFormat(locale.value, {
        dateStyle: 'full',
        timeStyle: 'short',
    }).format(currentDate)
})

const formattedNumber = computed(() => {
    return new Intl.NumberFormat(locale.value).format(1234567.89)
})

const formattedCurrency = computed(() => {
    return new Intl.NumberFormat(locale.value, {
        style: 'currency',
        currency: locale.value === 'ar' ? 'SAR' : 'USD',
    }).format(9999.99)
})
</script>
