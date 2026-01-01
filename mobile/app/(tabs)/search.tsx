import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useApiClient, postApi, userApi } from "@/utils/api";
import { formatDate, formatNumber } from "@/utils/formatters";

interface TrendingTopic {
  topic: string;
  count: number;
}

interface PostResult {
  _id: string;
  content: string;
  image?: string;
  user: any;
  likes: string[];
  comments: any[];
  createdAt: string;
}

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [postResults, setPostResults] = useState<PostResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [searchType, setSearchType] = useState<"users" | "posts">("users");
  const router = useRouter();
  const api = useApiClient();

  // Fetch posts to extract trending hashtags
  const { data: postsData } = useQuery({
    queryKey: ["allPosts"],
    queryFn: () => postApi.getPosts(api).then((res) => res.data.posts),
  });

  // Extract and calculate trending topics from posts
  useEffect(() => {
    if (postsData && Array.isArray(postsData)) {
      const hashtagMap = new Map<string, number>();

      postsData.forEach((post) => {
        if (post.content) {
          // Extract hashtags from post content
          const hashtags = post.content.match(/#\w+/g) || [];
          hashtags.forEach((tag) => {
            const tagLower = tag.toLowerCase();
            hashtagMap.set(tagLower, (hashtagMap.get(tagLower) || 0) + 1);
          });
        }
      });

      // Sort by count and take top 11
      const sorted = Array.from(hashtagMap.entries())
        .map(([topic, count]) => ({ topic, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 11);

      setTrendingTopics(sorted);
    }
  }, [postsData]);

  const handleSearch = async (text: string) => {
    setSearchQuery(text);

    if (text.trim().length < 2) {
      setSearchResults([]);
      setPostResults([]);
      setSearchType("users");
      return;
    }

    setIsSearching(true);
    try {
      // Check if it's a hashtag search
      if (text.startsWith("#")) {
        // Search posts by hashtag
        const posts = postsData?.filter((post) =>
          post.content.toLowerCase().includes(text.toLowerCase())
        ) || [];
        setPostResults(posts);
        setSearchType("posts");
        setSearchResults([]);
      } else {
        // Search by username
        const response = await userApi.getUserByUsername(api, text);
        setSearchResults([response.data.user]);
        setSearchType("users");
        setPostResults([]);
      }
    } catch (error) {
      setSearchResults([]);
      setPostResults([]);
      setSearchType("users");
    } finally {
      setIsSearching(false);
    }
  };

  const handleUserPress = (username: string) => {
    router.push(`/user/${username}`);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleHashtagPress = (hashtag: string) => {
    setSearchQuery(hashtag);
    const posts = postsData?.filter((post) =>
      post.content.toLowerCase().includes(hashtag.toLowerCase())
    ) || [];
    setPostResults(posts);
    setSearchType("posts");
  };

  const handlePostUserPress = (username: string) => {
    router.push(`/user/${username}`);
    setSearchQuery("");
    setPostResults([]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* HEADER */}
      <View className="px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3">
          <Feather name="search" size={20} color="#657786" />
          <TextInput
            placeholder="Search Szark Social"
            className="flex-1 ml-3 text-base"
            placeholderTextColor="#657786"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <ScrollView className="flex-1">
        {searchQuery.length > 0 ? (
          <View className="p-4">
            {isSearching ? (
              <ActivityIndicator size="large" color="#1DA1F2" />
            ) : searchType === "posts" ? (
              postResults.length > 0 ? (
                <View>
                  <Text className="text-gray-500 text-sm mb-3">Posts with {searchQuery}</Text>
                  {postResults.map((post) => (
                    <View key={post._id} className="border-b border-gray-100 pb-3 mb-3">
                      <TouchableOpacity
                        onPress={() => handlePostUserPress(post.user.username)}
                        className="flex-row items-center mb-2"
                      >
                        <Image
                          source={{ uri: post.user.profilePicture || "" }}
                          className="w-10 h-10 rounded-full mr-2"
                        />
                        <View className="flex-1">
                          <Text className="font-bold text-gray-900 text-sm">
                            {post.user.firstName} {post.user.lastName}
                          </Text>
                          <Text className="text-gray-500 text-xs">@{post.user.username}</Text>
                        </View>
                      </TouchableOpacity>
                      <Text className="text-gray-900 text-sm mb-2">{post.content}</Text>
                      {post.image && (
                        <Image
                          source={{ uri: post.image }}
                          className="w-full h-32 rounded-lg mb-2"
                          resizeMode="cover"
                        />
                      )}
                      <View className="flex-row items-center space-x-4">
                        <Text className="text-gray-500 text-xs">
                          {formatNumber(post.comments?.length || 0)} comments
                        </Text>
                        <Text className="text-gray-500 text-xs">
                          {formatNumber(post.likes?.length || 0)} likes
                        </Text>
                        <Text className="text-gray-500 text-xs">{formatDate(post.createdAt)}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <Text className="text-gray-500 text-center mt-4">
                  No posts found with {searchQuery}
                </Text>
              )
            ) : searchResults.length > 0 ? (
              <View>
                <Text className="text-gray-500 text-sm mb-3">Users</Text>
                {searchResults.map((user) => (
                  <TouchableOpacity
                    key={user._id}
                    onPress={() => handleUserPress(user.username)}
                    className="flex-row items-center py-3 border-b border-gray-100"
                  >
                    <Image
                      source={{ uri: user.profilePicture || "" }}
                      className="w-12 h-12 rounded-full mr-3"
                    />
                    <View className="flex-1">
                      <Text className="font-bold text-gray-900">
                        {user.firstName} {user.lastName}
                      </Text>
                      <Text className="text-gray-500 text-sm">@{user.username}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text className="text-gray-500 text-center mt-4">No users found</Text>
            )}
          </View>
        ) : (
          <View className="p-4">
            <Text className="text-xl font-bold text-gray-900 mb-4">Trending for you</Text>
            {trendingTopics.length > 0 ? (
              trendingTopics.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleHashtagPress(item.topic)}
                  className="py-3 border-b border-gray-100"
                >
                  <Text className="text-gray-500 text-sm">Trending Worldwide</Text>
                  <Text className="font-bold text-gray-900 text-lg">{item.topic}</Text>
                  <Text className="text-gray-500 text-sm">{item.count} mentions</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View className="items-center justify-center py-8">
                <ActivityIndicator size="large" color="#1DA1F2" />
                <Text className="text-gray-500 mt-3">Loading trending topics...</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
