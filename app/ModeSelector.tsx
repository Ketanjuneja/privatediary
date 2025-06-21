import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const ModeSelector: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const today = new Date().toISOString().split('T')[0];

  const handleDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const navigateToMode = (mode: 'FreeText' | 'QuestionAnswer') => {
    navigation.navigate(`${mode}Mode`, {date: selectedDate + 'T00:00:00'});
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingTop: 20,
      paddingHorizontal: 20,
      paddingBottom: 10,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    scrollContent: {
      flexGrow: 1,
      padding: 20,
    },
    calendarContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 30,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    calendarTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    modeSection: {
      marginTop: 10,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 24,
    },
    buttonContainer: {
      gap: 16,
    },
    modeButton: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 20,
      borderWidth: 2,
      borderColor: theme.colors.border,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    modeButtonPressed: {
      backgroundColor: `${theme.colors.primary}15`,
      borderColor: theme.colors.primary,
      transform: [{ scale: 0.98 }],
    },
    buttonHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    buttonIcon: {
      marginRight: 12,
    },
    buttonTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      flex: 1,
    },
    buttonDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    selectedDateContainer: {
      backgroundColor: `${theme.colors.primary}20`,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: `${theme.colors.primary}40`,
    },
    selectedDateText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.primary,
      textAlign: 'center',
    },
  });

  const calendarTheme = {
    backgroundColor: 'transparent',
    calendarBackground: 'transparent',
    textSectionTitleColor: theme.colors.textSecondary,
    selectedDayBackgroundColor: theme.colors.primary,
    selectedDayTextColor: '#ffffff',
    todayTextColor: theme.colors.primary,
    dayTextColor: theme.colors.text,
    textDisabledColor: theme.colors.textSecondary,
    dotColor: theme.colors.primary,
    selectedDotColor: '#ffffff',
    arrowColor: theme.colors.primary,
    monthTextColor: theme.colors.text,
    indicatorColor: theme.colors.primary,
    textDayFontFamily: 'System',
    textMonthFontFamily: 'System',
    textDayHeaderFontFamily: 'System',
    textDayFontWeight: '400',
    textMonthFontWeight: '600',
    textDayHeaderFontWeight: '600',
    textDayFontSize: 16,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 14,
  };

  const formatDate = (dateString: string) => {
    
    const date = new Date(dateString+ 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Diary</Text>
        <Text style={styles.headerSubtitle}>Choose a date and mode to begin</Text>
      </View>
      
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.calendarContainer}>
          <Text style={styles.calendarTitle}>Select Date</Text>
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: theme.colors.primary,
              },
            }}
            maxDate={today}
            theme={calendarTheme}
            firstDay={1}
            enableSwipeMonths={true}
          />
        </View>

        {selectedDate && (
          <View style={styles.selectedDateContainer}>
            <Text style={styles.selectedDateText}>
              Selected: {formatDate(selectedDate)}
            </Text>
          </View>
        )}

        <View style={styles.modeSection}>
          <Text style={styles.sectionTitle}>Select Diary Mode</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.modeButton}
              onPress={() => navigateToMode('FreeText')}
              activeOpacity={0.7}
            >
              <View style={styles.buttonHeader}>
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={theme.colors.primary}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonTitle}>Free Text Mode</Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </View>
              <Text style={styles.buttonDescription}>
                Express yourself freely with an open text area. Perfect for daily thoughts, experiences, and reflections.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modeButton}
              onPress={() => navigateToMode('QuestionAnswer')}
              activeOpacity={0.7}
            >
              <View style={styles.buttonHeader}>
                <Ionicons
                  name="help-circle-outline"
                  size={24}
                  color={theme.colors.primary}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonTitle}>Question & Answer Mode</Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </View>
              <Text style={styles.buttonDescription}>
                Guided journaling with thoughtful prompts to help you explore deeper insights and self-reflection.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ModeSelector;