# Aid Application Checker Frontend

This version of the frontend was created for Brown Hope. This document will cover how to get it working, and what to change to make it work for your organization. 

# How to run locally

- Ensure you have [node.js](https://nodejs.org/en/download/) installed on your machine
- Clone this repo to your local machine.
- in the terminal switch to the "BrownHopeAidApp/frontend" directory
- run npm install 
  - fixing vulnerabilities is covered in common issues
- Change server in config.ts to localhost:5000
  - ensure you do not merge to development with this change. It should be set to the ip address of your server. 

# Common Issues

This section will cover some of the issues we ran into in development and how we fixed them

## Packages

With the number of dependencies on the frontend, there are commonly vulnerabilities created by outdated ones. To fix these vulnerabilities, you will need to fix the file packagelock.json. Below are the steps for how to indetify the problem package and fix it. If you run into any more issues consult the FAQ section, or create an issue on the [github](https://github.com/PSU-CapstoneBrownHope/BrownHopeAidApp/)

