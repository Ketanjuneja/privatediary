import { Theme } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { Calendar } from 'react-native-calendars';

interface CalendarSelectorProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  theme: 'light' | 'dark' | null;
}

const CalendarSelector: React.FC<CalendarSelectorProps> = ({ selectedDate, setSelectedDate, theme }) => {
  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString ? new Date(day.dateString) : new Date());
  };

  const calendarTheme = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    calendarBackground: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    textSectionTitleColor: theme === 'dark' ? '#ffffff' : '#000000',
    selectedDayBackgroundColor: '#00adf5',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#00adf5',
    dayTextColor: theme === 'dark' ? '#ffffff' : '#2d4150',
    textDisabledColor: theme === 'dark' ? '#4d4d4d' : '#d9e1e8',
    monthTextColor: theme === 'dark' ? '#ffffff' : '#2d4150',
    arrowColor: theme === 'dark' ? '#ffffff' : '#2d4150',
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate.toISOString().split('T')[0]]: { selected: true, marked: true },
        }}
        maxDate={new Date().toISOString().split('T')[0]}
        theme={calendarTheme}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
});

export default CalendarSelector;