import { useState } from "react";
import { Alert } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient, userApi } from "../utils/api";
import { useCurrentUser } from "./useCurrentUser";
import * as ImagePicker from "expo-image-picker";

export const useProfile = () => {
  const api = useApiClient();

  const queryClient = useQueryClient();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    location: "",
  });
  const [profilePictureUri, setProfilePictureUri] = useState<string | undefined>();
  const [bannerImageUri, setBannerImageUri] = useState<string | undefined>();
  const { currentUser } = useCurrentUser();

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      const formDataToSend = new FormData();

      // Add text fields
      Object.keys(profileData).forEach((key) => {
        formDataToSend.append(key, profileData[key]);
      });

      // Add images if they exist
      if (profilePictureUri) {
        const profileFile = {
          uri: profilePictureUri,
          type: "image/jpeg",
          name: "profilePicture.jpg",
        };
        formDataToSend.append("profilePicture", profileFile as any);
      }

      if (bannerImageUri) {
        const bannerFile = {
          uri: bannerImageUri,
          type: "image/jpeg",
          name: "bannerImage.jpg",
        };
        formDataToSend.append("bannerImage", bannerFile as any);
      }

      return api.put("/users/profile", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setIsEditModalVisible(false);
      setProfilePictureUri(undefined);
      setBannerImageUri(undefined);
      Alert.alert("Success", "Profile updated successfully!");
    },
    onError: (error: any) => {
      Alert.alert("Error", error.response?.data?.error || "Failed to update profile");
    },
  });

  const openEditModal = () => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        bio: currentUser.bio || "",
        location: currentUser.location || "",
      });
      setProfilePictureUri(currentUser.profilePicture);
      setBannerImageUri(currentUser.bannerImage);
    }
    setIsEditModalVisible(true);
  };

  const updateFormField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const pickProfilePicture = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfilePictureUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const pickBannerImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        setBannerImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  return {
    isEditModalVisible,
    formData,
    openEditModal,
    closeEditModal: () => setIsEditModalVisible(false),
    saveProfile: () => updateProfileMutation.mutate(formData),
    updateFormField,
    isUpdating: updateProfileMutation.isPending,
    refetch: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
    profilePictureUri,
    bannerImageUri,
    pickProfilePicture,
    pickBannerImage,
  };
};
