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
import { useNavigation } from 'expo-router';
import { useTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { db } from '@/database/db';

interface Question {
  id: number;
  question: string;
  placeholder: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "How are you feeling today and what contributed to this mood?",
    placeholder: "Describe your emotions and what influenced them..."
  },
  {
    id: 2,
    question: "What was the highlight of your day?",
    placeholder: "Share the best moment or experience from today..."
  },
  {
    id: 3,
    question: "What challenged you today and how did you handle it?",
    placeholder: "Reflect on any difficulties and your response..."
  },
  {
    id: 4,
    question: "What are you grateful for today?",
    placeholder: "List the things you appreciate from today..."
  },
  {
    id: 5,
    question: "What would you like to improve or do differently tomorrow?",
    placeholder: "Think about tomorrow's goals and improvements..."
  }
];

const QuestionAnswerMode: React.FC = ({route}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { date } = useLocalSearchParams<{ date: string }>();
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const currentDate = date || new Date().toISOString().split('T')[0];
 
  useEffect(() => {
    loadEntry();
  }, [currentDate]);

  const loadEntry = async () => {
    try {
      await db.init();
      const entry = await db.getEntry(currentDate, 'qa');
      if (entry) {
        try {
          const parsedAnswers = JSON.parse(entry.content);
          setAnswers(parsedAnswers);
        } catch (error) {
          console.error('Error parsing saved answers:', error);
        }
      }
    } catch (error) {
      console.error('Error loading entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const saveEntry = async () => {
    const hasAnswers = Object.values(answers).some(answer => answer.trim());
    
    if (!hasAnswers) {
      Alert.alert('No Answers', 'Please answer at least one question before saving.');
      return;
    }

    setIsSaving(true);
    try {
      const success = await db.setEntry(currentDate, 'qa', JSON.stringify(answers));
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

  const getAnsweredCount = () => {
    return Object.values(answers).filter(answer => answer.trim()).length;
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
      justifyContent: 'space-between',
    },
    dateText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.primary,
      marginLeft: 8,
    },
    progressText: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    content: {
      flex: 1,
      padding: 20,
    },
    questionCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    questionHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    questionNumber: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      marginTop: 2,
    },
    questionNumberText: {
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: 12,
    },
    questionText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      flex: 1,
      lineHeight: 22,
    },
    textInputContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 16,
      minHeight: 100,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    textInputFocused: {
      borderColor: theme.colors.primary,
      borderWidth: 2,
    },
    textInput: {
      fontSize: 15,
      color: theme.colors.text,
      textAlignVertical: 'top',
      lineHeight: 20,
      minHeight: 68,
    },
    wordCount: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textAlign: 'right',
      marginTop: 8,
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
    introContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
    },
    introTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
    },
    introText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="help-circle-outline" size={48} color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading your questions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const hasAnswers = Object.values(answers).some(answer => answer.trim());
  const answeredCount = getAnsweredCount();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Q&A Journal</Text>
          <TouchableOpacity
            style={[styles.saveButton, (!hasAnswers || isSaving) && styles.saveButtonDisabled]}
            onPress={saveEntry}
            disabled={!hasAnswers || isSaving}
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
          </View>
          <Text style={styles.progressText}>
            {answeredCount}/{questions.length} answered
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.introContainer}>
            <Text style={styles.introTitle}>Guided Reflection</Text>
            <Text style={styles.introText}>
              Take a moment to reflect on your day through these thoughtful questions. 
              Answer as many as you feel comfortable with - there's no pressure to complete them all.
            </Text>
          </View>

          {questions.map((question) => {
            const answer = answers[question.id] || '';
            const wordCount = answer.trim().split(/\s+/).filter(word => word.length > 0).length;
            
            return (
              <QuestionCard
                key={question.id}
                question={question}
                answer={answer}
                onAnswerChange={(text) => updateAnswer(question.id, text)}
                wordCount={answer.trim() ? wordCount : 0}
                theme={theme}
                styles={styles}
              />
            );
          })}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

interface QuestionCardProps {
  question: Question;
  answer: string;
  onAnswerChange: (text: string) => void;
  wordCount: number;
  theme: any;
  styles: any;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answer,
  onAnswerChange,
  wordCount,
  theme,
  styles,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.questionCard}>
      <View style={styles.questionHeader}>
        <View style={styles.questionNumber}>
          <Text style={styles.questionNumberText}>{question.id}</Text>
        </View>
        <Text style={styles.questionText}>{question.question}</Text>
      </View>
      
      <View style={[styles.textInputContainer, isFocused && styles.textInputFocused]}>
        <TextInput
          style={styles.textInput}
          value={answer}
          onChangeText={onAnswerChange}
          placeholder={question.placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          multiline
          textAlignVertical="top"
          returnKeyType="default"
          blurOnSubmit={false}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
      
      {wordCount > 0 && (
        <Text style={styles.wordCount}>
          {wordCount} word{wordCount !== 1 ? 's' : ''}
        </Text>
      )}
    </View>
  );
};

export default QuestionAnswerMode;