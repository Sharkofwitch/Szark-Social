import SignOutButton from "@/components/SignOutButton";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
        <Text className="text-xl font-bold text-gray-900">Home</Text>
        <SignOutButton />
      </View>
    </SafeAreaView>
  );
};
export default HomeScreen;
