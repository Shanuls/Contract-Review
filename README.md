# Contract Review Management System

## 1. Project Overview

The **Contract Review Management System** is a frontend web application developed using React.js.

This project helps users manage contracts, review contract details, track contract statuses, and view reports through a simple and user-friendly interface.

The application is designed to make the contract review process easier and more organized.

## 2. Technologies Used

- **React.js** – Used to build the user interface.
- **JavaScript** – Used to implement application functionality.
- **HTML5** – Used to structure the web pages.
- **CSS3** – Used for styling and responsive design.
- **Vite** – Used to run and build the React application.
- **JSON** – Used to maintain sample contract data.
- **Browser Storage** – Used to save supported application changes locally.

## 3. Project Features

### Login Page

- User login interface
- Username and password fields
- Show and hide password option
- Remember Me option
- Logout functionality

### Dashboard

- Total contract count
- Approved contract count
- Blocked contract count
- Rejected contract count
- Overdue contract indicator
- Upcoming contract deadlines
- Recent rejected contracts
- Rework changes section

### Review Queue

The Review Queue is used to view and manage contracts.

Features include:

- View all contracts
- Search contracts
- Filter contracts
- Contract status management
- Pagination
- View contract details
- Approve contracts
- Reject contracts
- Block contracts
- Rework workflow
- Audit trail
- Documents section

### Split View

Split View displays the contract list and selected contract details side by side.

Users can select a contract and view its information without leaving the page.

### Table View

Table View displays contracts in a table format.

Users can view contract information, apply filters, and access contract details.

### Reports

The Reports page displays contract-related information and visual reports.

It helps users understand the overall contract review status.

### Theme Support

The application supports:

- Light Mode
- Dark Mode
- Responsive layout

## 4. Software Requirements

Before running the project, install the following software:

1. Node.js
2. Visual Studio Code
3. A web browser such as Google Chrome

You can download Node.js from:

https://nodejs.org/

## 5. How to Run the Project

### Step 1: Open the Project

Extract the project ZIP file.

Open the extracted project folder using Visual Studio Code.

### Step 2: Open the Terminal

In VS Code, select:

Terminal → New Terminal

### Step 3: Install Dependencies

Run the following command:

```bash
npm install
```

This command installs the packages required by the project.

### Step 4: Start the Application

Run:

```bash
npm run dev
```

### Step 5: Open the Application

After running the command, Vite will display a local URL, usually:

```text
http://localhost:5173/
```

Open the URL in your browser.

The application should now be running.

## 6. Understanding the Project Structure

A typical React and Vite project contains:

```text
Contract-Review/
│
├── public/
│
├── src/
│
├── index.html
│
├── package.json
│
├── package-lock.json
│
├── vite.config.js
│
└── README.md
```

### Folder Explanation

**public/**

Stores static files that can be accessed by the browser.

**src/**

Contains the React application source code.

**index.html**

The main HTML entry point of the application.

**package.json**

Contains project information, dependencies, and scripts.

**package-lock.json**

Records the installed dependency versions.

**vite.config.js**

Contains Vite configuration settings, when present.

**README.md**

Contains project information and setup instructions.

## 7. How the Application Works

The basic application flow is:

```text
Login
  |
  v
Dashboard
  |
  v
Review Queue
  |
  +---- Split View
  |
  +---- Table View
  |
  v
Select Contract
  |
  v
View Contract Details
  |
  +---- Approve
  |
  +---- Reject
  |
  +---- Block
  |
  +---- Rework
  |
  v
View Updated Status
```

Users can also navigate to the Reports page to view contract-related summaries.

## 8. Contract Data

The application uses sample contract data in JSON format.

Example:

```json
{
  "id": "C-1001",
  "contractName": "Vendor Agreement",
  "vendor": "ABC Technologies",
  "status": "Open"
}
```

This example is for learning purposes. The actual project may use additional fields or different property names.

### What is JSON?

JSON stands for JavaScript Object Notation.

It is commonly used to store and exchange data between applications.

## 9. React Concepts Used

This project helps beginners understand several React concepts.

### Components

Components are reusable parts of a React application.

Examples:

- Login component
- Dashboard component
- Review Queue component
- Reports component

### Props

Props are used to pass data from one component to another.

### State

State is used to manage changing values in the application.

Examples:

- Selected contract
- Search input
- Active filters
- Modal visibility
- Theme selection

### Event Handling

React events are used to handle user actions.

Examples:

- Clicking buttons
- Typing in search fields
- Selecting contracts
- Opening and closing modals

### Conditional Rendering

Conditional rendering displays different content based on conditions.

For example, a modal is displayed only when the user opens it.

### Array Methods

JavaScript array methods can be used to display and filter contract data.

Common methods include:

- `map()`
- `filter()`
- `find()`
- `sort()`

## 10. Important Commands

| Command | Purpose |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `Ctrl + C` | Stop the running server |

## 11. Common Errors and Solutions

### Error: npm is not recognized

**Reason:** Node.js may not be installed or configured correctly.

**Solution:** Install Node.js and restart VS Code.

### Error: Cannot find module

**Reason:** Required dependencies may be missing.

**Solution:**

```bash
npm install
```

### Error: Port already in use

**Reason:** Another application may already be using the same port.

**Solution:** Stop the other application or use the alternative URL provided by Vite.

### Error: Blank Page

**Possible reasons:**

- JavaScript error
- Incorrect import
- Missing component
- Runtime error

**Solution:** Open browser Developer Tools and check the Console tab.

## 12. Project Limitations

- This project is primarily a frontend application.
- Sample contract data is maintained locally.
- Some application changes may depend on browser storage.
- Browser storage is not a replacement for a production database.
- The Documents section may contain sample document names without actual PDF files.
- A backend and database would be required for reliable multi-user data sharing and centralized document storage.

## 13. Learning Outcomes

By completing this project, beginners can learn:

1. How to create a React application.
2. How to build reusable components.
3. How to manage state using React.
4. How to display JSON data.
5. How to implement search and filters.
6. How to handle button click events.
7. How to create and manage modals.
8. How to build responsive layouts.
9. How to implement light and dark themes.
10. How to organize a frontend project.

## 14. Future Improvements

Possible future enhancements include:

- Backend API integration
- Database integration
- User authentication with a backend
- Role-based access control
- Centralized document storage
- Notifications
- Advanced reporting

These are possible improvements and are not part of the current implementation.

## 15. Conclusion

The Contract Review Management System is a React-based frontend project that demonstrates how to manage contract information through an interactive interface.

It provides practical experience with React components, JavaScript, JSON data, state management, filtering, conditional rendering, and responsive CSS.

