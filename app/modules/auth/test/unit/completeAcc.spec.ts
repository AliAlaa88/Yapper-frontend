import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';
import CompleteAccount from '../../components/CompleteAccount.vue';
import ProfilePicture from '../../components/subComponents/CompleteAccountComponents/ProfilePicture.vue';
import Username from '../../components/subComponents/CompleteAccountComponents/Username.vue';
import Language from '../../components/subComponents/CompleteAccountComponents/Language.vue';
import Interests from '../../components/subComponents/CompleteAccountComponents/Interests.vue';

// Mock Nuxt app
vi.mock('#app', () => ({
    useNuxtApp: () => ({
        $authService: {},
    }),
    useRuntimeConfig: () => ({
        public: {
            apiUrl: 'http://localhost:3000',
        },
    }),
}));

function mountCompleteAccount(props = {}) {
    const defaultProps = {
        Recommendations: ['user123', 'user456', 'user789'],
        skipImg: false,
        ...props,
    };

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    return mount(CompleteAccount, {
        props: defaultProps,
        global: {
            plugins: [[VueQueryPlugin, { queryClient }]],
            stubs: {
            },
        },
    });
}

describe('CompleteAccount Component', () => {
    describe('Initial Rendering', () => {
        it('should render ProfilePicture step first when skipImg is false', () => {
            const wrapper = mountCompleteAccount({ skipImg: false });
            expect(wrapper.findComponent(ProfilePicture).exists()).toBe(true);
            expect(wrapper.findComponent(Username).exists()).toBe(false);
        });

        it('should skip ProfilePicture and show Username when skipImg is true', () => {
            const wrapper = mountCompleteAccount({ skipImg: true });
            expect(wrapper.findComponent(ProfilePicture).exists()).toBe(false);
            expect(wrapper.findComponent(Username).exists()).toBe(true);
        });
    });

    describe('Profile Picture Step', () => {
        it('should move to Username step when Next is clicked', async () => {
            const wrapper = mountCompleteAccount({ skipImg: false });
            const profilePicComponent = wrapper.findComponent(ProfilePicture);
            
            await profilePicComponent.vm.$emit('next', 'https://example.com/avatar.jpg');
            await flushPromises();

            expect(wrapper.findComponent(ProfilePicture).exists()).toBe(false);
            expect(wrapper.findComponent(Username).exists()).toBe(true);
        });

        it('should move to Username step when Skip is clicked', async () => {
            const wrapper = mountCompleteAccount({ skipImg: false });
            const profilePicComponent = wrapper.findComponent(ProfilePicture);
            
            await profilePicComponent.vm.$emit('skip');
            await flushPromises();

            expect(wrapper.findComponent(ProfilePicture).exists()).toBe(false);
            expect(wrapper.findComponent(Username).exists()).toBe(true);
        });

        it('should emit close when Close is clicked', async () => {
            const wrapper = mountCompleteAccount({ skipImg: false });
            const profilePicComponent = wrapper.findComponent(ProfilePicture);
            
            await profilePicComponent.vm.$emit('close');
            await flushPromises();

            expect(wrapper.emitted('close')).toBeTruthy();
        });
    });

    describe('Username Step', () => {
        it('should receive recommendations prop', () => {
            const recommendations = ['s3fan_test', 's3fan_test2', 's3fan_test3'];
            const wrapper = mountCompleteAccount({ 
                skipImg: true, 
                Recommendations: recommendations 
            });
            
            const usernameComponent = wrapper.findComponent(Username);
            expect(usernameComponent.props('Recommendations')).toEqual(recommendations);
        });

        it('should move to Language step when Next is clicked', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true });
            const usernameComponent = wrapper.findComponent(Username);
            
            await usernameComponent.vm.$emit('next', 's3fan_test');
            await flushPromises();

            expect(wrapper.findComponent(Username).exists()).toBe(false);
            expect(wrapper.findComponent(Language).exists()).toBe(true);
        });

        it('should move to Language step when Skip is clicked', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true });
            const usernameComponent = wrapper.findComponent(Username);
            
            await usernameComponent.vm.$emit('skip');
            await flushPromises();

            expect(wrapper.findComponent(Username).exists()).toBe(false);
            expect(wrapper.findComponent(Language).exists()).toBe(true);
        });

        it('should go back to ProfilePicture when Back is clicked (if not skipped)', async () => {
            const wrapper = mountCompleteAccount({ skipImg: false });
            
            const profilePicComponent = wrapper.findComponent(ProfilePicture);
            await profilePicComponent.vm.$emit('next', 'https://example.com/avatar.jpg');
            await flushPromises();

            const usernameComponent = wrapper.findComponent(Username);
            await usernameComponent.vm.$emit('back');
            await flushPromises();

            expect(wrapper.findComponent(Username).exists()).toBe(false);
            expect(wrapper.findComponent(ProfilePicture).exists()).toBe(true);
        });
    });

    describe('Language Step', () => {

        it('should move to Interests step when Next is clicked', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true });
            
            const usernameComponent = wrapper.findComponent(Username);
            await usernameComponent.vm.$emit('next', 's3fan_test');
            await flushPromises();

            const languageComponent = wrapper.findComponent(Language);
            await languageComponent.vm.$emit('next', 'English');
            await flushPromises();

            expect(wrapper.findComponent(Language).exists()).toBe(false);
            expect(wrapper.findComponent(Interests).exists()).toBe(true);
        });

        it('should move to Interests step when Skip is clicked', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true });
            
            const usernameComponent = wrapper.findComponent(Username);
            await usernameComponent.vm.$emit('skip');
            await flushPromises();

            const languageComponent = wrapper.findComponent(Language);
            await languageComponent.vm.$emit('skip');
            await flushPromises();

            expect(wrapper.findComponent(Language).exists()).toBe(false);
            expect(wrapper.findComponent(Interests).exists()).toBe(true);
        });

        it('should go back to Username when Back is clicked', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true });
            
            const usernameComponent = wrapper.findComponent(Username);
            await usernameComponent.vm.$emit('next', 'myusername');
            await flushPromises();

            const languageComponent = wrapper.findComponent(Language);
            await languageComponent.vm.$emit('back');
            await flushPromises();

            expect(wrapper.findComponent(Language).exists()).toBe(false);
            expect(wrapper.findComponent(Username).exists()).toBe(true);
        });
    });

    describe('Interests Step', () => {
        it('should emit finish with all collected data when Finish is clicked', async () => {
            const wrapper = mountCompleteAccount({ skipImg: false });
            
            let component = wrapper.findComponent(ProfilePicture);
            await component.vm.$emit('next', 'https://example.com/my-avatar.jpg');
            await flushPromises();

            component = wrapper.findComponent(Username);
            await component.vm.$emit('next', 'sa3fan_test');
            await flushPromises();

            component = wrapper.findComponent(Language);
            await component.vm.$emit('next', 'English');
            await flushPromises();

            component = wrapper.findComponent(Interests);
            await component.vm.$emit('finish', ['Technology', 'Sports', 'Music']);
            await flushPromises();

            expect(wrapper.emitted('finish')).toBeTruthy();
            const finishEvent = wrapper.emitted('finish')?.[0];
            expect(finishEvent).toBeDefined();
            expect(finishEvent?.[0]).toEqual({
                profilePicture: 'https://example.com/my-avatar.jpg',
                username: 'sa3fan_test',
                language: 'English',
                interests: ['Technology', 'Sports', 'Music'],
            });
        });

        it('should emit finish with null/empty values when all steps are skipped', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true });
            
            let component = wrapper.findComponent(Username);
            await component.vm.$emit('skip');
            await flushPromises();

            component = wrapper.findComponent(Language);
            await component.vm.$emit('skip');
            await flushPromises();

            component = wrapper.findComponent(Interests);
            await component.vm.$emit('skip');
            await flushPromises();

            expect(wrapper.emitted('finish')).toBeTruthy();
            const finishEvent = wrapper.emitted('finish')?.[0];
            expect(finishEvent?.[0]).toEqual({
                profilePicture: null,
                username: null,
                language: null,
                interests: [],
            });
        });

        it('should go back to Language when Back is clicked', async () => {
            const wrapper = mountCompleteAccount({ skipImg: true });
            
            let component = wrapper.findComponent(Username);
            await component.vm.$emit('skip');
            await flushPromises();

            component = wrapper.findComponent(Language);
            await component.vm.$emit('skip');
            await flushPromises();

            component = wrapper.findComponent(Interests);
            await component.vm.$emit('back');
            await flushPromises();

            expect(wrapper.findComponent(Interests).exists()).toBe(false);
            expect(wrapper.findComponent(Language).exists()).toBe(true);
        });
    });

    describe('Complete Flow Navigation', () => {
        it('should navigate forward through all steps with Next', async () => {
            const wrapper = mountCompleteAccount({ skipImg: false });
            
            expect(wrapper.findComponent(ProfilePicture).exists()).toBe(true);

            await wrapper.findComponent(ProfilePicture).vm.$emit('next', 'avatar.jpg');
            await flushPromises();
            expect(wrapper.findComponent(Username).exists()).toBe(true);

            await wrapper.findComponent(Username).vm.$emit('next', 'username');
            await flushPromises();
            expect(wrapper.findComponent(Language).exists()).toBe(true);

            await wrapper.findComponent(Language).vm.$emit('next', 'English');
            await flushPromises();
            expect(wrapper.findComponent(Interests).exists()).toBe(true);

            await wrapper.findComponent(Interests).vm.$emit('finish', ['Tech']);
            await flushPromises();
            expect(wrapper.emitted('finish')).toBeTruthy();
        });
    });

    describe('Close Event Propagation', () => {
        it('should emit close from any step', async () => {
            const wrapper = mountCompleteAccount({ skipImg: false });
            
            await wrapper.findComponent(ProfilePicture).vm.$emit('close');
            expect(wrapper.emitted('close')).toBeTruthy();
            
            const wrapper2 = mountCompleteAccount({ skipImg: true });
            await wrapper2.findComponent(Username).vm.$emit('close');
            expect(wrapper2.emitted('close')).toBeTruthy();
        });
    });

    describe('Data Persistence During Navigation', () => {
        it('should preserve data when navigating back and forth', async () => {
            const wrapper = mountCompleteAccount({ skipImg: false });
            
            await wrapper.findComponent(ProfilePicture).vm.$emit('next', 'first-avatar.jpg');
            await flushPromises();

            await wrapper.findComponent(Username).vm.$emit('next', 'firstusername');
            await flushPromises();

            await wrapper.findComponent(Language).vm.$emit('back');
            await flushPromises();

            await wrapper.findComponent(Username).vm.$emit('next', 'secondusername');
            await flushPromises();

            await wrapper.findComponent(Language).vm.$emit('skip');
            await flushPromises();

            await wrapper.findComponent(Interests).vm.$emit('finish', ['Gaming']);
            await flushPromises();

            const finishEvent = wrapper.emitted('finish')?.[0];
            expect(finishEvent?.[0].username).toBe('secondusername');
            expect(finishEvent?.[0].profilePicture).toBe('first-avatar.jpg');
        });
    });
});
