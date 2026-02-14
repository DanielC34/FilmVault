import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from "react-native";
import { Plus, Trash2 } from "lucide-react-native";
import { useStore } from "../../store/useStore";
import AuthScreen from "../../components/AuthScreen";
import { THEME } from "../../constants";

export default function ListsScreen() {
  const { session, isAuthLoading, watchlists, deleteWatchlist } = useStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [newListDesc, setNewListDesc] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { createWatchlist } = useStore();

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

  const handleCreateList = async () => {
    if (!newListTitle.trim()) {
      Alert.alert("Error", "Please enter a vault name");
      return;
    }
    setIsCreating(true);
    await createWatchlist(newListTitle, newListDesc);
    setIsCreating(false);
    setNewListTitle("");
    setNewListDesc("");
    setShowCreateModal(false);
  };

  const handleDeleteList = (id: string) => {
    const list = watchlists.find((w) => w.id === id);
    if (list?.is_system_list) {
      Alert.alert("Cannot delete", "System vaults cannot be deleted.");
      return;
    }
    Alert.alert(
      "Delete Vault?",
      `Are you sure you want to delete "${list?.title}"?`,
      [
        { text: "Cancel", onPress: () => {} },
        {
          text: "Delete",
          onPress: () => deleteWatchlist(id),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-surface">
        <Text className="text-2xl font-bold text-white">My Vaults</Text>
        <Pressable
          onPress={() => setShowCreateModal(true)}
          className="bg-primary p-3 rounded-lg active:opacity-80"
        >
          <Plus size={24} color={THEME.background} />
        </Pressable>
      </View>

      {/* Watchlists */}
      <FlatList
        data={watchlists}
        renderItem={({ item }) => (
          <Pressable
            className="flex-row items-center px-4 py-4 border-b border-surface active:bg-surface"
            onPress={() => {}}
          >
            <View className="flex-1">
              <Text className="text-lg font-semibold text-white">
                {item.title}
              </Text>
              {item.description && (
                <Text className="text-textMuted text-sm mt-1">
                  {item.description}
                </Text>
              )}
              <Text className="text-textMuted text-xs mt-1">
                {item.item_count || 0} items
              </Text>
            </View>
            {!item.is_system_list && (
              <Pressable
                onPress={() => handleDeleteList(item.id)}
                className="p-2 active:opacity-60"
              >
                <Trash2 size={20} color={THEME.error} />
              </Pressable>
            )}
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-textMuted">No vaults yet</Text>
          </View>
        }
      />

      {/* Create Modal */}
      {showCreateModal && (
        <View className="absolute inset-0 bg-black/50 flex items-end">
          <View className="w-full bg-surface rounded-t-2xl p-6 pb-8">
            <Text className="text-xl font-bold text-white mb-4">
              Create New Vault
            </Text>

            <TextInput
              className="bg-bg text-white p-3 rounded-lg mb-3 border border-bg"
              placeholder="Vault Name"
              placeholderTextColor={THEME.textMuted}
              value={newListTitle}
              onChangeText={setNewListTitle}
            />

            <TextInput
              className="bg-bg text-white p-3 rounded-lg mb-4 border border-bg"
              placeholder="Description (optional)"
              placeholderTextColor={THEME.textMuted}
              value={newListDesc}
              onChangeText={setNewListDesc}
              multiline
              numberOfLines={3}
            />

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setShowCreateModal(false)}
                disabled={isCreating}
                className="flex-1 bg-bg p-3 rounded-lg active:opacity-80"
              >
                <Text className="text-white text-center font-semibold">
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={handleCreateList}
                disabled={isCreating}
                className="flex-1 bg-primary p-3 rounded-lg active:opacity-80"
              >
                {isCreating ? (
                  <ActivityIndicator size="small" color={THEME.background} />
                ) : (
                  <Text className="text-bg text-center font-semibold">
                    Create
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
