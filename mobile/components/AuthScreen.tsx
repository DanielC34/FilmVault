import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Sparkles, Eye, EyeOff } from "lucide-react-native";
import { useStore } from "../store/useStore";
import { THEME, SPACING } from "../constants";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    signInWithPassword,
    signUpWithEmail,
    signInAsGuest,
    signInWithGoogle,
  } = useStore();

  const handleAuth = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    const success = isLogin
      ? await signInWithPassword(email, password)
      : await signUpWithEmail(email, password);
    setIsLoading(false);
    if (success) {
      setEmail("");
      setPassword("");
    }
  };

  return (
    <ScrollView className="flex-1 bg-bg">
      <View className="flex-1 p-6 justify-center min-h-screen">
        {/* Header */}
        <View className="mb-8 items-center">
          <Sparkles size={48} color={THEME.primary} />
          <Text className="text-3xl font-bold text-white mt-4">FilmVault</Text>
          <Text className="text-textMuted text-base mt-2">
            {isLogin ? "Welcome Back" : "Join the Vault"}
          </Text>
        </View>

        {/* Form */}
        <View className="gap-4">
          {/* Email Input */}
          <View>
            <Text className="text-white font-semibold mb-2">Email</Text>
            <TextInput
              className="bg-surface text-white p-4 rounded-lg border border-surface"
              placeholder="your@email.com"
              placeholderTextColor={THEME.textMuted}
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
              keyboardType="email-address"
            />
          </View>

          {/* Password Input */}
          <View>
            <Text className="text-white font-semibold mb-2">Password</Text>
            <View className="relative">
              <TextInput
                className="bg-surface text-white p-4 rounded-lg border border-surface pr-12"
                placeholder="••••••••"
                placeholderTextColor={THEME.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <Eye size={20} color={THEME.textMuted} />
                ) : (
                  <EyeOff size={20} color={THEME.textMuted} />
                )}
              </Pressable>
            </View>
          </View>

          {/* Auth Button */}
          <Pressable
            onPress={handleAuth}
            disabled={isLoading}
            className="bg-primary p-4 rounded-lg mt-4 active:opacity-80"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={THEME.background} />
            ) : (
              <Text className="text-bg text-center font-bold text-lg">
                {isLogin ? "Sign In" : "Sign Up"}
              </Text>
            )}
          </Pressable>

          {/* Toggle Auth Mode */}
          <Pressable
            onPress={() => {
              setIsLogin(!isLogin);
              setEmail("");
              setPassword("");
            }}
            disabled={isLoading}
          >
            <Text className="text-center text-textMuted">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <Text className="text-primary font-bold">
                {isLogin ? "Sign Up" : "Sign In"}
              </Text>
            </Text>
          </Pressable>
        </View>

        {/* Divider */}
        <View className="flex-row items-center my-6">
          <View className="flex-1 h-px bg-surface" />
          <Text className="text-textMuted px-4">Or continue as</Text>
          <View className="flex-1 h-px bg-surface" />
        </View>

        {/* Guest Mode */}
        <Pressable
          onPress={() => signInAsGuest()}
          disabled={isLoading}
          className="bg-surface border border-primary p-4 rounded-lg active:opacity-80"
        >
          <Text className="text-primary text-center font-semibold">
            Guest Mode
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
