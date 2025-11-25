import { useMutation } from "@tanstack/vue-query";

// Update Profile Picture
export const useUpdateProfilePictureMutation = (
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void
) => {
  const { $authService } = useNuxtApp();

  return useMutation({
    mutationKey: ['updateProfilePicture'],
    mutationFn: ({ profilePicture }: { profilePicture: File }) =>$authService.updateProfilePicture(profilePicture),
    retry: false,
    onSuccess: (data) => onSuccess?.(data),
    onError: (error) => onError?.(error),
  });
};

// Update Username
export const useUpdateUsernameMutation = (
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void
) => {
  const { $authService } = useNuxtApp();

  return useMutation({
    mutationKey: ['updateUsername'],
    mutationFn: ({ username }: { username: string }) => $authService.updateUsername(username),
    retry: false,
    onSuccess: (data) => onSuccess?.(data),
    onError: (error) => onError?.(error),
  });
};

// Update Language
export const useUpdateLanguageMutation = (
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void
) => {
  const { $authService } = useNuxtApp();

  return useMutation({
    mutationKey: ['updateLanguage'],
    mutationFn: ({ language }: { language: string }) => $authService.updateLanguage(language),
    retry: false,
    onSuccess: (data) => onSuccess?.(data),
    onError: (error) => onError?.(error),
  });
};

// get Interests
export const useFetchInterests = (
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void
) => {
  const { $authService } = useNuxtApp();
  return useMutation({
    mutationKey: ['getInterests'],
    mutationFn: () => $authService.getInterests(),
    retry: false,
    onSuccess: (data) => onSuccess?.(data),
    onError: (error) => onError?.(error),
  });
}

// Update Interests
export const useUpdateInterestsMutation = (
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void
) => {
  const { $authService } = useNuxtApp();

  return useMutation({
    mutationKey: ['updateInterests'],
    mutationFn: ({ categoryIds }: { categoryIds: number[] }) => $authService.updateInterests(categoryIds),
    retry: false,
    onSuccess: (data) => onSuccess?.(data),
    onError: (error) => onError?.(error),
  });
};

export const useUpdateProfileMutation = (
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void
) => {
  const { $authService } = useNuxtApp();
  console.log("inside the mutation of profile update")
  return useMutation({
    mutationKey: ['updateProfile'],
    mutationFn: ({image_url}: {image_url: any}) => $authService.updateProfile(image_url),
    retry: false,
    onSuccess: (data) => onSuccess?.(data),
    onError: (error) => onError?.(error),  
  });
};
