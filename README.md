# Project Title

This project is a mobile application designed to improve productivity and motivation through task management, leveraging gamification principles. Users can create, edit, and manage tasks while tracking their progress through points, streaks, and achievements. The app offers a customizable experience, allowing users to tailor their task categories and preferences. It supports offline functionality for guest users and syncs data across devices for authenticated users via Firebase. Additional features include daily and weekly mission resets, mindful task pacing, and a flexible state management system powered by Zustand and AsyncStorage.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Installation

Pre-requisites
```bash
# Globally instsall react-native-cli and expo-cli
sudo npm install -g react-native-cli
sudo npm install —global expo-cli

```

```bash
# Clone the repository
git clone https://github.com/cimatong/flow/.git

# Navigate to the project directory
cd your-repository

# Install dependencies
yarn install

# If you are using npm
rm -rf yarn.lock
npm install
```

## Usage

Instructions on how to run or use the project.

```bash
# To run the development server
yarn start

# if you are using npm
npm start
```

## Features

- **Quest Management:** Users can create, edit, delete, and complete tasks (referred to as "quests"). Each quest can be categorized by importance, due date, and notes for detailed task tracking.
  
- **Streak and Achievement Tracking:** Gamified elements like streaks, task points, and achievements are implemented to boost user engagement. Users are rewarded for consecutive task completions and milestones, enhancing motivation and accountability.

- **Data Persistence:** The application supports both guest and authenticated users. Guest users' data is stored locally using AsyncStorage, while authenticated users' data is synced across devices via Firebase, ensuring seamless access.

- **Daily and Weekly Resets:** The app automatically resets daily and weekly quests to help users stay on track with their task goals. This reset ensures a fresh start each day or week, maintaining consistent productivity.

- **Offline Functionality:** Guest users can manage their tasks offline, with data synced once reconnected to the internet. This ensures users can continue using the app even when not connected to a network.

- **Customizable Experience:** Users can personalize their quest categories, customize task priorities, and manage their task flow, allowing for a flexible task management system tailored to individual needs.

- **Proactive Reminders (Future Extension):** Future versions will include more advanced reminders to prompt users to take breaks and stay on top of their mental well-being while managing their tasks.

These features combine to provide a comprehensive and gamified task management experience, tailored to enhance productivity and personal well-being.

## Technologies Used

- **React Native** - Frontend framework
- **Firebase** - Authentication and database
- **Zustand** - State Management
- **AsyncStorage** - Local storage management
- **Tamagui** - UI library
- **Expo** - Development environment

## Contributing

Contributions are welcome! Please create an issue or a pull request if you want to contribute to the project.

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Carlo Imatong - [carloimatong@gmail.com](mailto:carloimatong@gmail.com)

Project Link: [https://github.com/cimatong/flow/.git](https://github.com/cimatong/flow/.git)
