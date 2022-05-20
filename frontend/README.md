# Aid Application Checker Frontend

This version of the frontend was created for Brown Hope. This document will cover how to get it working, and what to change to make it work for your organization. 

1. [How to run locally](#How-to-run-locally)
2. [Common issues](#Common-Issues)
    1. [Packages](#Packages)
3. [How to make changes](#How-to-make-changes)
    1. [Changing buttons and fields](#Changing-buttons-and-fields)


## How to run locally

- Ensure you have [node.js](https://nodejs.org/en/download/) installed on your machine
- Clone this repo to your local machine.
- in the terminal switch to the "BrownHopeAidApp/frontend" directory
- run npm install 
  - fixing vulnerabilities is covered in packages under common issues
- Change server in config.ts to localhost:5000
  - ensure you do not merge to development with this change. It should be set to the ip address of your server.

## Common Issues

This section will cover some of the issues we ran into in development and how we fixed them

### Packages

With the number of dependencies on the frontend, there are commonly vulnerabilities created by outdated ones. Below are some of the ways for how to indetify the problem package and fix it. If you run into any more issues consult the FAQ section, or create an issue on the [github](https://github.com/PSU-CapstoneBrownHope/BrownHopeAidApp/).

If you run npm install and see vulnerabilities:

![vulnerabilitiesOnInstall](https://user-images.githubusercontent.com/77218586/167921834-0f0b846f-3d84-450e-8394-e660f32d12be.png)

1. run npm audit

![npmAudit](https://user-images.githubusercontent.com/77218586/167924046-8c50d3d7-1eba-43bd-af7e-4b8534d2731a.png)

This shows an audit report. The first box is surrounding the offending package nth-check. In this example there is a single dependency issue, but you might see more. The next red highlight shows something you should NOT do, as it will cause more vulnerabilities. In gray is the list of packages affected by this dependency issue. 

2. Search for package name in package-lock.json (I used vim). Using the information from the audit report we know that "css-select" is the package dependent on this vulnerable version of nth-check. 

![badPackage](https://user-images.githubusercontent.com/77218586/167924665-9194e87b-00c5-41cc-aed9-3c2b2aeb15b5.png)

In the audit report the system told us the issue was that the nth-check package was below version 2.0.1. We change that value to be "^2.0.1":

![goodPackage](https://user-images.githubusercontent.com/77218586/167924983-0f61531e-2dbd-4ccf-bdf6-c44644f47f9f.png)

now lets run npm install again

![goodInstall](https://user-images.githubusercontent.com/77218586/167925988-343f611e-e45d-489f-ae0a-5408a9aab196.png)

For those of you wanting to update the packages as they advance in the future, this is a way to sort out any new vulnerabilities. 

## How to make changes

The pages on the site are constructed from elements present in a util file, allowing what the user interacts with on each page to be changed. The appearance is handled in a universal css file, allowing for fonts, colors, and sizes to be tweaked until you are satisfied with the output. When changing input fields, ensure the backend is changed in a way to accomodate the changes. 

### Changing buttons and fields

Most pages on this site consist of forms the user fills out. These forms are constructed from files in the frontend/util folder. 

The input fields and buttons are interfaces declared in frontend/util/inputUtil. Those interfaces are used in util files of the same name to create arrays that represent the elements on the screen. For example, here is the config file for login: 

