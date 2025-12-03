# SpecCheck --- Codebase Documentation

## 1. Overview

SpecCheck is a web application designed to help users easily find and
view detailed specifications about their vehicles. Many car owners are
unaware of important information about their cars---such as engine type,
battery details, or transmission specs. Existing apps often make finding
this information slow and frustrating.

SpecCheck simplifies this process by allowing users to: 
- Search for a car by make, model, and year
- Register their own car
- View key specifications instantly
- Ask SpecCheck AI Agent about specific car details
- Manage car profiles through a simple UI

The project includes both a backend API (Firestore + Node.js) and a
frontend built with HTML/CSS/JS. End-to-end testing is done using
Selenium WebDriver and GitHub Actions.

## 2. Tech Stack

### Frontend

- HTML5, eJs, CSS3, JavaScript
- Bootstrap 5 for styling

### Backend

- Node.js
   - express to handle GET/POST requests
   - express-session for session handling
   - bcrypt to handle password hashing
- Firebase Firestore database
- OpenAI API
- CarQuery API

### Testing

- Selenium WebDriver (JavaScript) for automated functional testing
- ChromeDriver
- GitHub Actions CI for automated testing
- Chai for test assertions
- Mocha for test execution

### Tools

- dotenv for environment variables
- Git, GitHub

## 3. Setup Instructions

### Requirements

- Node.js 24+
- Firebase CLI installed
- Chrome installed
- serviceAccountKey.json
- .env

### Installation

    git clone https://github.com/BeckHarper13/7082_Project_Group10/
    cd 7082_Project_Group10
    npm install

### Environment Variables

    apiKey
    apiKey
    projectId
    storageBucket
    messagingSenderId
    appId
    OPENAI_API_KEY

### Run Backend

    node index.js

### Run Tests
#### To run tests, serviceAccountKey.json and .env files are required

    npm test

### Run Tests Headless

    npm run test:headless

### Run Specific Test

    npx mocha ./tests/<test-name>.test.js

## 4. Architecture

SpecCheck uses a lightweight client/server architecture: Frontend → Backend → Firestore

## 5. Key Modules and Files

- index.js --- App server
- database.js --- DB access layer
- FetchUserInfo.js --- DB control layer
- Frontend JS --- fetch calls & DOM updates
- Frontend eJs --- dynamic rendering of pages
- Frontend partials --- reusable components used on multiple pages
  -     7082_Project_Group10/public/html/partials
- Code Reviews 7082 Group 10.pdf
- Final Presentation 7082 Group 10.pdf
- functional-tests-7082-group10.mp4
- HLD Doc 7082 Group 10.pdf
- README.MD

## 6. Database Structure

### Users
| Field          | Type        |
|----------------|-------------|
| id             | string      |
| createdAt      | dateTime    |
| email          | string      |
| passwwordHash  | string      |
| username       | string      |
| cars           | Array{Cars} |

### Cars

| Field      | Type        |
|------------|-------------|
| id         | string      |
| createdAt  | dateTime    |
| make       | string      |
| model      | string      |
| trimId     | string      |
| notes      | string      |


## 7. Known Issues

- OpenAI API responses too slow

## 8. Future Improvements

- Change email/password functionality
- Better UI
- Mobile app version
- Physical dongle that plugs into your car and can connect with app
- Photos for cars

## 9. Contributors

- Navjot Kehal - Front End and AI developer
- Timur Reziapov - Front end and UI/UX developer
- Beck Harper - Full Stack and developer (CarQuery API)
- Bryan Le - Backend developer
