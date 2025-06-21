import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { db } from '@/database/db';

const FreeTextMode: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const { date } = useLocalSearchParams<{ date: string }>();
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const currentDate = date || new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadEntry();
  }, [currentDate]);

  const loadEntry = async () => {
    try {
      await db.init();
      const entry = await db.getEntry(currentDate, 'free');
      if (entry) {
        setText(entry.content);
      }
    } catch (error) {
      console.error('Error loading entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveEntry = async () => {
    if (!text.trim()) {
      Alert.alert('Empty Entry', 'Please write something before saving.');
      return;
    }

    setIsSaving(true);
    try {
      const success = await db.setEntry(currentDate, 'free', text.trim());
      if (success) {
        Alert.alert('Saved', 'Your diary entry has been saved successfully!');
      } else {
        Alert.alert('Error', 'Failed to save your entry. Please try again.');
      }
    } catch (error) {
      console.error('Error saving entry:', error);
      Alert.alert('Error', 'An unexpected error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const dateStr = date.toDateString();
    const todayStr = today.toDateString();
    const yestStr = yesterday.toDateString();

    if (dateStr === todayStr) {
      return 'Today';
    } else if (dateStr === yestStr) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.surface,
      paddingTop: 20,
      paddingHorizontal: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    backButton: {
      padding: 8,
      marginLeft: -8,
      marginRight: 8,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      flex: 1,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    saveButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
      opacity: 0.6,
    },
    saveButtonText: {
      color: '#ffffff',
      fontWeight: '600',
      marginLeft: 4,
    },
    dateContainer: {
      backgroundColor: `${theme.colors.primary}15`,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    dateText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.primary,
      marginLeft: 8,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    promptContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    promptTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
    },
    promptText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    textInputContainer: {
      flex: 1,
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 20,
      minHeight: 200,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
      textAlignVertical: 'top',
      lineHeight: 24,
    },
    placeholderStyle: {
      color: theme.colors.textSecondary,
    },
    wordCount: {
      position: 'absolute',
      bottom: 12,
      right: 16,
      fontSize: 12,
      color: theme.colors.textSecondary,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      overflow: 'hidden',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginTop: 12,
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="document-text-outline" size={48} color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading your entry...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Free Writing</Text>
          <TouchableOpacity
            style={[styles.saveButton, (!text.trim() || isSaving) && styles.saveButtonDisabled]}
            onPress={saveEntry}
            disabled={!text.trim() || isSaving}
          >
            <Ionicons
              name={isSaving ? "hourglass-outline" : "save-outline"}
              size={16}
              color="#ffffff"
            />
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.promptContainer}>
            <Text style={styles.promptTitle}>Share Your Thoughts</Text>
            <Text style={styles.promptText}>
              This is your personal space to express yourself freely. Write about your day, 
              your feelings, dreams, goals, or anything that comes to mind. There are no rules 
              here - just let your thoughts flow naturally.
            </Text>
          </View>

          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={text}
              onChangeText={setText}
              placeholder="Share your thoughts..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              autoFocus={!text}
              textAlignVertical="top"
              returnKeyType="default"
              blurOnSubmit={false}
            />
            {text.length > 0 && (
              <Text style={styles.wordCount}>
                {wordCount} word{wordCount !== 1 ? 's' : ''}
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FreeTextMode;