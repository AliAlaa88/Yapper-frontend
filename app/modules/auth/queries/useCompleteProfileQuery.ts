import { useMutation } from "@tanstack/vue-query";

// Update Profile Picture
export const useUpdateProfilePictureMutation = (
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void
) => {
  const { $authService } = useNuxtApp();

  return useMutation({
    mutationFn: async (profilePicture: string) => {
      return await $authService.updateProfilePicture(profilePicture);
    },
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      if (onError) onError(error);
    },
  });
};

// Update Username
export const useUpdateUsernameMutation = (
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void
) => {
  const { $authService } = useNuxtApp();

  return useMutation({
    mutationFn: async (username: string) => {
      return await $authService.updateUsername(username);
    },
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      if (onError) onError(error);
    },
  });
};

// Update Language
export const useUpdateLanguageMutation = (
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void
) => {
  const { $authService } = useNuxtApp();

  return useMutation({
    mutationFn: async (language: string) => {
      return await $authService.updateLanguage(language);
    },
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      if (onError) onError(error);
    },
  });
};

// Update Interests
export const useUpdateInterestsMutation = (
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void
) => {
  const { $authService } = useNuxtApp();

  return useMutation({
    mutationFn: async (interests: string[]) => {
      return await $authService.updateInterests(interests);
    },
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      if (onError) onError(error);
    },
  });
};
