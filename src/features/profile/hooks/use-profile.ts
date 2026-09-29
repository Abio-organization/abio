import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateProfile,
  updateProfileAvatar,
} from "@/features/profile/api/profile.api";
import { useAuthStore } from "@/features/auth/store/auth-store";
import type { Profile, User } from "@/features/auth/types";
import { queryKeys } from "@/shared/lib/query-keys";

function mergeProfileIntoUser(
  user: User | null,
  profile: Profile,
): User | null {
  if (!user) return user;
  return { ...user, profile };
}

function invalidatePublicProfiles(
  queryClient: ReturnType<typeof useQueryClient>,
  ...usernames: Array<string | null | undefined>
) {
  const uniqueUsernames = new Set(
    usernames.filter((username): username is string => Boolean(username)),
  );
  return Promise.all(
    [...uniqueUsernames].map((username) =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.userProfile(username),
        refetchType: "all",
      }),
    ),
  );
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: (payload: Partial<Profile> & { displayName?: string }) =>
      updateProfile(payload),
    onSuccess: (res) => {
      const nextUser = mergeProfileIntoUser(user, res.data);
      if (nextUser) {
        const merged = res.data.user?.name
          ? { ...nextUser, name: res.data.user.name }
          : nextUser;
        setUser(merged);
        queryClient.setQueryData(queryKeys.user, merged);
      }
      void invalidatePublicProfiles(
        queryClient,
        user?.profile?.username,
        res.data.username,
      );
    },
  });
}

export function useUpdateProfileAvatar() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: (file: File) => updateProfileAvatar(file),
    onSuccess: (res) => {
      const nextUser = mergeProfileIntoUser(user, res.data);
      if (nextUser) {
        setUser(nextUser);
        queryClient.setQueryData(queryKeys.user, nextUser);
      }
      void invalidatePublicProfiles(
        queryClient,
        user?.profile?.username,
        res.data.username,
      );
    },
  });
}
