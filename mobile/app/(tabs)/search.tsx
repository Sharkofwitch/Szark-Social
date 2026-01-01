import { Feather } from "@expo/vector-icons";
import { View, TextInput, ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TRENDING_TOPICS = [
  { topic: "#Data", tweets: "125K" },
  { topic: "#Python", tweets: "89K" },
  { topic: "#WebDevelopment", tweets: "234K" },
  { topic: "#AI", tweets: "567K" },
  { topic: "#TechNews", tweets: "138K" },
  { topic: "#ComputerScience", tweets: "62K" },
  { topic: "#Software", tweets: "1.2M" },
  { topic: "#Development", tweets: "32K" },
  { topic: "#Tesla", tweets: "2.4K" },
  { topic: "#Hardware", tweets: "903k" },
  { topic: "#Apple", tweets: "23K" },
];

const SearchScreen = () => {
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
          />
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-xl font-bold text-gray-900 mb-4">Trending for you</Text>
          {TRENDING_TOPICS.map((item, index) => (
            <TouchableOpacity key={index} className="py-3 border-b border-gray-100">
              <Text className="text-gray-500 text-sm">Trending in Technology</Text>
              <Text className="font-bold text-gray-900 text-lg">{item.topic}</Text>
              <Text className="text-gray-500 text-sm">{item.tweets} Szarks</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
