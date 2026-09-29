import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createLink,
  deleteLink,
  getAllLinks,
  reorderLinks,
  updateLink,
  updateLinkIcon,
} from "@/features/links/api/links.api";
import type { Link } from "@/features/links/types";
import { queryKeys } from "@/shared/lib/query-keys";
import { useAuthStore } from "@/features/auth/store/auth-store";

function invalidatePublicProfile(
  queryClient: ReturnType<typeof useQueryClient>,
  username: string | null | undefined,
) {
  if (!username) return;
  void queryClient.invalidateQueries({
    queryKey: queryKeys.userProfile(username),
    refetchType: "all",
  });
}

export function useGetAllLinks() {
  return useQuery({
    queryKey: queryKeys.links,
    queryFn: async () => {
      const res = await getAllLinks();
      return res.data;
    },
  });
}

export function useCreateLink() {
  const queryClient = useQueryClient();
  const username = useAuthStore((s) => s.user?.profile?.username);

  return useMutation({
    mutationFn: (payload: Pick<Link, "title" | "url" | "platform">) =>
      createLink(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.links });
      invalidatePublicProfile(queryClient, username);
    },
  });
}

export function useUpdateLinkIcon() {
  const queryClient = useQueryClient();
  const username = useAuthStore((s) => s.user?.profile?.username);

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      updateLinkIcon(id, file),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.links });
      invalidatePublicProfile(queryClient, username);
    },
  });
}

export function useUpdateLink() {
  const queryClient = useQueryClient();
  const username = useAuthStore((s) => s.user?.profile?.username);

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Pick<Link, "title" | "url" | "platform" | "isVisible">>;
    }) => updateLink(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.links });
      invalidatePublicProfile(queryClient, username);
    },
  });
}

export function useDeleteLink() {
  const queryClient = useQueryClient();
  const username = useAuthStore((s) => s.user?.profile?.username);

  return useMutation({
    mutationFn: (id: string) => deleteLink(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.links });
      invalidatePublicProfile(queryClient, username);
    },
  });
}

/** Optimistic — drag-reorder needs to feel instant, not wait on a round trip. */
export function useReorderLinks() {
  const queryClient = useQueryClient();
  const username = useAuthStore((s) => s.user?.profile?.username);

  return useMutation({
    mutationFn: (links: Array<{ id: string; displayOrder: number }>) =>
      reorderLinks(links),
    onMutate: async (links) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.links });
      const previous = queryClient.getQueryData<Link[]>(queryKeys.links);
      const order = new Map(links.map((l) => [l.id, l.displayOrder]));

      queryClient.setQueryData<Link[]>(queryKeys.links, (current) =>
        current
          ? [...current]
              .map((link) => ({
                ...link,
                displayOrder: order.get(link.id) ?? link.displayOrder,
              }))
              .sort((a, b) => a.displayOrder - b.displayOrder)
          : current,
      );

      return { previous };
    },
    onError: (_err, _links, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.links, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.links });
      invalidatePublicProfile(queryClient, username);
    },
  });
}
