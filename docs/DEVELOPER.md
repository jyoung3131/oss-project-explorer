# Developer Documentation for the OSPO Open Source Project Explorer

## 1. Introduction

### 1.1. Project Overview

The purpose of this application is to allow users to add their own open-source projects to a searchable database. Contributors can then search and filter for specific projects they want to contribute to, making it easier to find opportunities aligned with their interests and skills.

This application was developed by the [Open Source Programming Office](https://ospo.cc.gatech.edu/) at the Georgia Institute of Technology in Atlanta, Georgia, USA. The original code is housed in the OSPO [GitHub repository](https://github.com/gt-ospo/oss-project-explorer).

The repository comprises a complete web application, including React UI code and an automated deployment in GitHub Actions workflows.

### 1.2. Technologies Used

This project is built using the following technologies:
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript): The primary programming language used in the project.
- [React](https://reactjs.org/docs/getting-started.html): Used in conjunction with JavaScript to build the user interfaces. 
- [Tailwind CSS](https://tailwindcss.com/docs): A CSS-framework for styling the application.
- [TanStack React Table](https://tanstack.com/table/latest/docs/introduction): A headless table UI library to build the searchable table.
- [Octokit/Github API](https://docs.github.com/en/rest?apiVersion=2022-11-28): A library for interacting with the GitHub API to handle project form submissions.

## 2. Getting Started

In order to work on the UI for this application, you will need [Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) installed for the purpose of frontend dependency management via [npm](https://docs.npmjs.com/cli/).

If you do not have a preferred web development IDE, [Visual Studio Code](https://code.visualstudio.com/) is a robust, free option that is popular in the web development community.

You need [Git](https://git-scm.com/) to clone the repository from Github and for version-control.

## 3. Project Structure

The project is organized into several key directories and files:


### 3.1. `components` Folder

The `components` folder contains the React components used to build the user interface. Each component is organized into its own sub-folder, and the sub-folder contains a single `.jsx` file corresponding to the component name.

- **AboutSection**: Displays information about the project.
- **LicenseFilter**: Handles filtering projects by their licenses.
- **Pagination**: Manages the pagination of the project table.
- **ProjectAreaFilter**: Filters projects by their area of research or focus.
- **ProjectExplorerPage**: The main page where users explore available projects.
- **ProjectFormPage**: Contains the form for users to submit new projects.
- **ProjectTable**: Displays the list of projects in a table format, allowing for sorting and filtering.
- **TitleBar**: Displays the title and search bar.

### 3.2. `data` Folder

The `data` folder contains files that manage the project's data and options.

- **licenseOptions.jsx**: Contains the available options for project licenses.
- **projectAreaOptions.jsx**: Contains the available options for project areas or research focuses.
- **useFetchProjectData.jsx**: Fetches the list of projects from the `project_list.json` file.
- **project_list.json**: The JSON file that contains all project data displayed in the application.

### 3.3. Root Files

- **App.jsx**: The main application component that integrates all other components.
- **index.jsx**: The entry point of the React application, responsible for rendering the `App` component into the DOM.


## 4. Running the Application Locally

## 5. Testing

## 6. Deployment

## 7. Maintenance

### 7.1. Updating Dependencies

### 7.2 Troubleshooting

#### 7.2.1 Front-End Debugging

#### 7.2.2 Backend Debugging

## 8. End-to-End Flow