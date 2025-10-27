<template>
    <div class="w-full min-h-screen bg-primary flex flex-col gap-4 p-4">
        <!-- Search Bar -->
        <div class="w-full">
            <div class="relative">
                <input
                    type="text"
                    placeholder="Search"
                    class="w-full px-4 py-3 pl-12 bg-primary border border-primary rounded-full text-primary placeholder:text-muted focus:outline-none focus:border-blue focus:bg-primary"
                />
                <svg
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </div>
        </div>

        <!-- Trending Section -->
        <div class="bg-primary rounded-2xl border border-primary overflow-hidden">
            <h2 class="px-4 py-3 text-xl font-bold text-primary">Trending</h2>
            <div class="px-4 py-3 hover:bg-hover transition-colors cursor-pointer">
                <p class="text-muted text-sm">Trending in Egypt</p>
                <p class="text-primary font-bold mt-1">#YapperTrending</p>
                <p class="text-muted text-sm">1,234 posts</p>
            </div>
            <div class="px-4 py-3 hover:bg-hover transition-colors cursor-pointer">
                <p class="text-muted text-sm">Sports · Trending</p>
                <p class="text-primary font-bold mt-1">Football News</p>
                <p class="text-muted text-sm">10.2K posts</p>
            </div>
            <div class="px-4 py-3 hover:bg-hover transition-colors cursor-pointer">
                <p class="text-muted text-sm">Technology</p>
                <p class="text-primary font-bold mt-1">AI Updates</p>
                <p class="text-muted text-sm">8.7K posts</p>
            </div>
            <button
                class="w-full px-4 py-3 text-left text-sm text-blue hover:bg-hover transition-colors"
            >
                Show more
            </button>
        </div>

        <!-- Who to Follow Section -->
        <div class="bg-primary rounded-2xl border border-primary overflow-hidden">
            <h2 class="px-4 py-3 text-xl font-bold text-primary">Who to follow</h2>
            <div
                class="px-4 py-3 flex items-center justify-between hover:bg-hover transition-colors cursor-pointer"
            >
                <div class="flex items-center gap-3">
                    <div
                        class="w-12 h-12 bg-gray rounded-full flex items-center justify-center text-white font-bold"
                    >
                        A
                    </div>
                    <div>
                        <p class="text-primary font-bold">User Name</p>
                        <p class="text-muted text-sm">@username</p>
                    </div>
                </div>
                <button
                    class="px-4 py-2 bg-blue text-white rounded-full font-bold hover:bg-blue-dark transition-colors"
                >
                    Follow
                </button>
            </div>
            <div
                class="px-4 py-3 flex items-center justify-between hover:bg-hover transition-colors cursor-pointer"
            >
                <div class="flex items-center gap-3">
                    <div
                        class="w-12 h-12 bg-gray rounded-full flex items-center justify-center text-white font-bold"
                    >
                        B
                    </div>
                    <div>
                        <p class="text-primary font-bold">Another User</p>
                        <p class="text-muted text-sm">@anotheruser</p>
                    </div>
                </div>
                <button
                    class="px-4 py-2 bg-blue text-white rounded-full font-bold hover:bg-blue-dark transition-colors"
                >
                    Follow
                </button>
            </div>
            <button
                class="w-full px-4 py-3 text-left text-sm text-blue hover:bg-hover transition-colors"
            >
                Show more
            </button>
        </div>
    </div>
</template>

<script setup lang="ts"></script>
