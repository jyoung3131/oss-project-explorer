# Customization of this Repo

This page presents details on the customization steps you need to follow in order to customize this repository for your own use.

## Changing the Color Scheme

To change the color scheme of this project, navigate to `tailwind.config.js`. This file defines custom colors and fonts used for this project. You may add/remove any colors/fonts you'd like.

Ex: The color "gtgold" is defined in this file and is used in `TitleBar.jsx` to set the background color of the title bar to "gtgold" by including the line "bg-gtgold" in the className of the root `div`.

## Adding your own logo

To change the logo of this website:
1. Add your image file to the `public` folder.
2. Change the `src={gt-logo.png}` line to `src={<filename>}` in `TitleBar.jsx`

To change the website tab's title and logo:
1. Navigate to `index.html` and change the title in the `<title>` tag.
2. In the `public` folder, replace `favicon.ico` with whatever image you'd like to use for the tab logo. Make sure to replace the file ending to `.ico`.

## Changing the Github Issue template link

If you created a new Github Issue template yml file and would like the link in the project form to direct to your template, you must replace the link in the `<div>` in `ProjectForm.jsx` related to the Github Issue.

To do this, replace the URL using this format:

https://github.com/{repo_owner}/{repo_name}/issues/new?assignees=&labels=&template={template_filename}&title={issue_default_title}

Replace the following:
1. `{repo_owner}`: The repo owner's username
2. `{repo_name}`: The name of the repo
3. `{template_filename}`: The name of the yml filename, including the .yml extension name
4. `{issue_default_title}`: The default title you'd like all issues of this template to have

## Updating Github permissions for your organization

To use this repository, you need to set up a helper account that can trigger and process the necessary GitHub actions. 