import { useLocalSearchParams } from "expo-router";
import { useUserProfile } from "@/hooks/useUserProfile";
import { usePosts } from "@/hooks/usePosts";
import { Feather } from "@expo/vector-icons";
import { format } from "date-fns";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import PostsList from "@/components/PostsList";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const UserProfileScreen = () => {
  const { username } = useLocalSearchParams<{ username: string }>();
  const insets = useSafeAreaInsets();
  const { currentUser } = useCurrentUser();

  const { profileUser, isLoading, isFollowing, onFollow, isFollowLoading } = useUserProfile(
    username || ""
  );

  const {
    posts: userPosts,
    refetch: refetchPosts,
    isLoading: isRefetching,
  } = usePosts(username);

  const isOwnProfile = currentUser?.username === username;

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  if (!profileUser) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500">User not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <View>
          <Text className="text-xl font-bold text-gray-900">
            {profileUser.firstName} {profileUser.lastName}
          </Text>
          <Text className="text-gray-500 text-sm">{userPosts.length} Posts</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetchPosts}
            tintColor="#1DA1F2"
          />
        }
      >
        <Image
          source={{
            uri:
              profileUser.bannerImage ||
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
          }}
          className="w-full h-48"
          resizeMode="cover"
        />

        <View className="px-4 pb-4 border-b border-gray-100">
          <View className="flex-row justify-between items-end -mt-16 mb-4">
            <Image
              source={{ uri: profileUser.profilePicture || "" }}
              className="w-32 h-32 rounded-full border-4 border-white"
            />
            {!isOwnProfile && (
              <TouchableOpacity
                className={`px-6 py-2 rounded-full ${
                  isFollowing ? "border border-gray-300" : "bg-blue-500"
                }`}
                onPress={onFollow}
                disabled={isFollowLoading}
              >
                <Text
                  className={`font-semibold ${isFollowing ? "text-gray-900" : "text-white"}`}
                >
                  {isFollowLoading ? "..." : isFollowing ? "Following" : "Follow"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="mb-4">
            <View className="flex-row items-center mb-1">
              <Text className="text-xl font-bold text-gray-900 mr-1">
                {profileUser.firstName} {profileUser.lastName}
              </Text>
              <Feather name="check-circle" size={20} color="#1DA1F2" />
            </View>
            <Text className="text-gray-500 mb-2">@{profileUser.username}</Text>
            {profileUser.bio && (
              <Text className="text-gray-900 mb-3">{profileUser.bio}</Text>
            )}

            {profileUser.location && (
              <View className="flex-row items-center mb-2">
                <Feather name="map-pin" size={16} color="#657786" />
                <Text className="text-gray-500 ml-2">{profileUser.location}</Text>
              </View>
            )}

            {profileUser.createdAt && (
              <View className="flex-row items-center mb-3">
                <Feather name="calendar" size={16} color="#657786" />
                <Text className="text-gray-500 ml-2">
                  Joined {format(new Date(profileUser.createdAt), "MMMM yyyy")}
                </Text>
              </View>
            )}

            <View className="flex-row">
              <TouchableOpacity className="mr-6">
                <Text className="text-gray-900">
                  <Text className="font-bold">{profileUser.following?.length || 0}</Text>
                  <Text className="text-gray-500"> Following</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text className="text-gray-900">
                  <Text className="font-bold">{profileUser.followers?.length || 0}</Text>
                  <Text className="text-gray-500"> Followers</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <PostsList username={profileUser.username} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfileScreen;
