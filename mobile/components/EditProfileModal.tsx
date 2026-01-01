import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";

interface EditProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  formData: {
    firstName: string;
    lastName: string;
    bio: string;
    location: string;
  };
  profilePictureUri?: string;
  bannerImageUri?: string;
  saveProfile: () => void;
  updateFormField: (field: string, value: string) => void;
  onProfilePictureSelect: () => void;
  onBannerImageSelect: () => void;
  isUpdating: boolean;
}

const EditProfileModal = ({
  formData,
  isUpdating,
  isVisible,
  onClose,
  saveProfile,
  updateFormField,
  profilePictureUri,
  bannerImageUri,
  onProfilePictureSelect,
  onBannerImageSelect,
}: EditProfileModalProps) => {
  const handleSave = () => {
    saveProfile();
  };

  return (
    <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={onClose}>
          <Text className="text-blue-500 text-lg">Cancel</Text>
        </TouchableOpacity>

        <Text className="text-lg font-semibold">Edit Profile</Text>

        <TouchableOpacity
          onPress={handleSave}
          disabled={isUpdating}
          className={`${isUpdating ? "opacity-50" : ""}`}
        >
          {isUpdating ? (
            <ActivityIndicator size="small" color="#1DA1F2" />
          ) : (
            <Text className="text-blue-500 text-lg font-semibold">Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Banner Image Section */}
        <View className="mb-6">
          <Text className="text-gray-500 text-sm mb-2">Banner Image</Text>
          <TouchableOpacity
            onPress={onBannerImageSelect}
            className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden items-center justify-center"
          >
            {bannerImageUri ? (
              <Image source={{ uri: bannerImageUri }} className="w-full h-full" />
            ) : (
              <View className="items-center">
                <Feather name="image" size={24} color="#657786" />
                <Text className="text-gray-500 text-sm mt-2">Tap to select banner</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Profile Picture Section */}
        <View className="mb-6">
          <Text className="text-gray-500 text-sm mb-2">Profile Picture</Text>
          <TouchableOpacity
            onPress={onProfilePictureSelect}
            className="relative w-20 h-20 rounded-full bg-gray-100 items-center justify-center overflow-hidden"
          >
            {profilePictureUri ? (
              <Image source={{ uri: profilePictureUri }} className="w-full h-full" />
            ) : (
              <View className="items-center justify-center w-full h-full">
                <Feather name="camera" size={20} color="#657786" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-500 text-sm mb-2">First Name</Text>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 text-base"
              value={formData.firstName}
              onChangeText={(text) => updateFormField("firstName", text)}
              placeholder="Your first name"
            />
          </View>

          <View>
            <Text className="text-gray-500 text-sm mb-2">Last Name</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-3 py-3 text-base"
              value={formData.lastName}
              onChangeText={(text) => updateFormField("lastName", text)}
              placeholder="Your last name"
            />
          </View>

          <View>
            <Text className="text-gray-500 text-sm mb-2">Bio</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-3 py-3 text-base"
              value={formData.bio}
              onChangeText={(text) => updateFormField("bio", text)}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View>
            <Text className="text-gray-500 text-sm mb-2">Location</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-3 py-3 text-base"
              value={formData.location}
              onChangeText={(text) => updateFormField("location", text)}
              placeholder="Where are you located?"
            />
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default EditProfileModal;
