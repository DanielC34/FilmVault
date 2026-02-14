import React from "react";
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from "react-native";
import { LogOut } from "lucide-react-native";
import { useStore } from "../../store/useStore";
import AuthScreen from "../../components/AuthScreen";
import { THEME } from "../../constants";

export default function ProfileScreen() {
  const { session, isAuthLoading, user, signOut } = useStore();

  if (isAuthLoading) {
    return (
      <View className="flex-1 bg-bg items-center justify-center">
        <ActivityIndicator size="large" color={THEME.primary} />
      </View>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-bg">
      {user && (
        <View className="flex-1 p-6">
          {/* Avatar */}
          {user.avatar_url && (
            <View className="items-center mb-6">
              <Image
                source={{ uri: user.avatar_url }}
                style={{ width: 120, height: 120, borderRadius: 60 }}
              />
            </View>
          )}

          {/* User Info */}
          <View className="bg-surface rounded-lg p-4 mb-6">
            <Text className="text-textMuted text-xs uppercase tracking-wide mb-1">
              Username
            </Text>
            <Text className="text-white text-xl font-bold">
              {user.username}
            </Text>
          </View>

          <View className="bg-surface rounded-lg p-4 mb-6">
            <Text className="text-textMuted text-xs uppercase tracking-wide mb-1">
              Email
            </Text>
            <Text className="text-white text-lg">{session.user?.email}</Text>
          </View>

          {/* Stats */}
          <View className="flex-row gap-4 mb-6">
            <View className="flex-1 bg-surface rounded-lg p-4">
              <Text className="text-primary font-bold text-2xl">∞</Text>
              <Text className="text-textMuted text-xs mt-2">Collections</Text>
            </View>
            <View className="flex-1 bg-surface rounded-lg p-4">
              <Text className="text-accent font-bold text-2xl">♥</Text>
              <Text className="text-textMuted text-xs mt-2">Favorites</Text>
            </View>
          </View>

          {/* About */}
          <View className="bg-surface rounded-lg p-4 mb-auto">
            <Text className="text-white font-semibold mb-2">
              About FilmVault
            </Text>
            <Text className="text-textMuted text-sm">
              A cinephile's digital sanctuary for curating, discovering, and
              sharing their film collection.
            </Text>
          </View>

          {/* Sign Out Button */}
          <Pressable
            onPress={() => signOut()}
            className="flex-row items-center justify-center gap-2 bg-error/20 border border-error p-4 rounded-lg active:opacity-80"
          >
            <LogOut size={20} color={THEME.error} />
            <Text className="text-error font-semibold">Sign Out</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
