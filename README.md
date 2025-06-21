# Private Diary App

## Overview
The Private Diary App is a React Native application built with Expo that allows users to maintain a private diary. The app features two modes: Free Text Mode and Question Answer Mode, enabling users to reflect on their daily experiences and thoughts securely.

## Features
- **Splash Screen**: Displays the app logo and a privacy lock design.
- **Mode Selector**: Users can choose between Free Text Mode and Question Answer Mode.
- **Calendar Selector**: Users can select past dates to view or enter diary entries.
- **Free Text Mode**: Users can share their thoughts for a selected date.
- **Question Answer Mode**: Users can respond to reflective questions for each day.
- **SQLite Database**: All entries are stored securely in an SQLite database with encryption.

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd private-diary-app
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   expo start
   ```

## Usage
- Launch the app to see the splash screen.
- Select a mode (Free Text or Question Answer) from the mode selector.
- Use the calendar to choose a date and enter your diary entries.
- In Free Text Mode, type your thoughts in the provided textbox.
- In Question Answer Mode, answer the reflective questions presented on each screen.

## Questions for Reflection
1. What was the highlight of your day?
2. What challenges did you face today, and how did you overcome them?
3. What did you learn today?
4. How did you feel throughout the day?
5. What are you grateful for today?

## Database and Encryption
The app uses SQLite for data storage, and all user entries are encrypted before being saved to ensure privacy. The encryption and decryption logic is handled in the `src/database/encryption.ts` file.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.