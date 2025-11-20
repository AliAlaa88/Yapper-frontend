import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';

const mockAuthService = {
    getUserData: vi.fn(),
};

const mockRouter = {
    push: vi.fn(),
    replace: vi.fn(),
};

const mockUserStore = {
    setAuth: vi.fn(),
    logout: vi.fn(),
    user: null,
    accessToken: null,
};

vi.mock('vue-router', () => ({
    useRouter: () => mockRouter,
}));

vi.mock('#app', () => ({
    useNuxtApp: () => ({
        $authService: mockAuthService,
    }),
    useRuntimeConfig: () => ({
        public: {
            apiUrl: 'http://localhost:3000',
        },
    }),
    useRouter: () => mockRouter,
}));

vi.stubGlobal('useRouter', () => mockRouter);

Object.defineProperty(globalThis.process, 'client', {
    value: true,
    writable: true,
    configurable: true,
});

vi.mock('~/modules/auth/stores/userStore', () => ({
    useUserStore: () => mockUserStore,
}));

import SuccessPage from '~/modules/auth/components/success.vue';

const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

delete (window as any).location;
window.location = {
    search: '',
} as any;

function mountSuccessPage(token: string = '') {
    window.location.search = token ? `?token=${token}` : '';

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    return mount(SuccessPage, {
        global: {
            plugins: [[VueQueryPlugin, { queryClient }]],
            mocks: {
                useRouter: () => mockRouter,
                useNuxtApp: () => ({
                    $authService: mockAuthService,
                }),
                useRuntimeConfig: () => ({
                    public: {
                        apiUrl: 'http://localhost:3000',
                    },
                }),
            },
            stubs: {
            },
        },
    });
}

describe('OAuth Existing Account Flow - Success Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.clear();
        mockUserStore.user = null;
        mockUserStore.accessToken = null;
        window.location.search = '';
    });

    afterEach(() => {
        vi.clearAllMocks();
        localStorageMock.clear();
    });

    describe('Initial Rendering', () => {
        it('should render loading state initially', () => {
            const wrapper = mountSuccessPage('test-token-123');
            expect(wrapper.text()).toContain('Loading...');
            expect(wrapper.find('.fixed.inset-0').exists()).toBe(true);
        });

    });

    describe('Token Handling', () => {
          it('should handle special characters in token', async () => {
            const specialToken = 'token-with-special-chars_123.456!@#';
            const mockUserData = {
                data: {
                    id: '777',
                    name: 'Sa3fan Test',
                    email: 'Sa3fan@Developer.com',
                    username: 'sa3fan_test',
                },
            };

            mockAuthService.getUserData.mockResolvedValue(mockUserData);

            mountSuccessPage(specialToken);
            await flushPromises();

            expect(mockUserStore.accessToken).toBe(specialToken);
        });
        it('should extract token from URL parameters', () => {
            const token = 'oauth-access-token-123';
            mountSuccessPage(token);
            
            expect(mockUserStore.accessToken).toBe(token);
        });

        it('should store token in localStorage', () => {
            const token = 'oauth-access-token-456';
            mountSuccessPage(token);
            
            expect(localStorageMock.getItem('access_token')).toBe(token);
        });

        it('should store token in user store', () => {
            const token = 'oauth-access-token-789';
            mountSuccessPage(token);
            
            expect(mockUserStore.accessToken).toBe(token);
        });
    });

    describe('User Data Fetching', () => {
        it('should call getUserData when token is present', async () => {
            const token = 'valid-oauth-token';
            const mockUserData = {
                data: {
                    id: '123',
                    name: 'Sa3fan Test',
                    email: 'Sa3fan@Developer.com',
                    username: 'sa3fan_test',
                    avatar_url: 'https://example.com/sa3fan.jpg',
                    google_id: 'google-123',
                },
            };

            mockAuthService.getUserData.mockResolvedValue(mockUserData);

            mountSuccessPage(token);
            await flushPromises();

            expect(mockAuthService.getUserData).toHaveBeenCalled();
        });

        it('should set auth data when user data fetch succeeds', async () => {
            const token = 'valid-oauth-token-abc';
            const mockUserData = {
                data: {
                    id: '456',
                    name: 'Sa3fan Test',
                    email: 'Sa3fan@Developer.com',
                    username: 'sa3fan_test',
                    avatar_url: 'https://example.com/sa3fan.jpg',
                    facebook_id: 'facebook-456',
                },
            };

            mockAuthService.getUserData.mockResolvedValue(mockUserData);

            mountSuccessPage(token);
            await flushPromises();

            expect(mockUserStore.setAuth).toHaveBeenCalledWith({
                access_token: token,
                user: mockUserData.data,
            });
        });

    });

    describe('Error Handling', () => {
        it('should logout user when getUserData fails', async () => {
            const token = 'invalid-token';
            
            mockAuthService.getUserData.mockRejectedValue({
                response: {
                    status: 401,
                    data: {
                        message: 'Invalid token',
                    },
                },
            });

            mountSuccessPage(token);
            await flushPromises();

            expect(mockUserStore.logout).toHaveBeenCalled();
        });

    });


    describe('Loading State Management', () => {
        it('should start with loading state showing', () => {
            const wrapper = mountSuccessPage('test-token');
            expect(wrapper.find('.fixed.inset-0').exists()).toBe(true);
            expect(wrapper.text()).toContain('Loading...');
        });

        it('should show loading during authentication', async () => {
            const mockUserData = {
                data: {
                    id: '999',
                    name: 'Sa3fan Test',
                    email: 'Sa3fan@Developer.com',
                    username: 'sa3fan_test',
                },
            };

            mockAuthService.getUserData.mockResolvedValue(mockUserData);

            const wrapper = mountSuccessPage('test-token');
            
            expect(wrapper.find('.fixed.inset-0').exists()).toBe(true);
        });

    });
});
