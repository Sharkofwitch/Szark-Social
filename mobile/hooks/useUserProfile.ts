import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient, userApi } from "@/utils/api";
import { useCurrentUser } from "./useCurrentUser";
import { Alert } from "react-native";

export const useUserProfile = (username: string) => {
  const api = useApiClient();
  const { currentUser } = useCurrentUser();

  const { data: profileUser, isLoading, error } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: () => userApi.getUserByUsername(api, username).then((res) => res.data.user),
    enabled: !!username,
  });

  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: () => userApi.followUser(api, profileUser?._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error: any) => {
      Alert.alert("Error", error.response?.data?.error || "Failed to follow user");
    },
  });

  const isFollowing = profileUser?.followers?.includes(currentUser?._id || "");

  return {
    profileUser,
    isLoading,
    error,
    isFollowing,
    onFollow: () => followMutation.mutate(),
    isFollowing: isFollowing,
    isFollowLoading: followMutation.isPending,
  };
};
