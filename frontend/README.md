# Aid Application Checker Frontend

This version of the frontend was created for Brown Hope. This document will cover how to get it working, and what to change to make it work for your organization. 

1. [How to run locally](#How-to-run-locally)
2. [Prior Knowledge](#Expected-prior-knowledge)
3. [How to make changes](#How-to-make-changes)
    1. [Util files](#How-util-files-work)
    2. [CSS](#Config.css)
    3. [Tutorial](#Tutorial)
4. [Common issues](#Common-Issues)
    1. [Packages](#Packages)

## Expected Prior knowledge

Someone familiar with:
- Github
- An IDE
- CSS
- Node.js
- Javascript
- Google Cloud Platform

Branding choices:
- Downloaded image for customizing logo.
- Colors for customizing page
- Font choice


It is highly recommended that you use an IDE when making changes, and vscode was used on most of it. Installing vscode and extensions for code highlighting is highly recommended. 

Here are some references that will prove useful:

| Topic | Link |
| -- | -- |
| how to use css | https://www.w3schools.com/css/default.asp | 
| bootstrap styling (buttons) | https://getbootstrap.com/docs/4.0/components/buttons/ |
| html attributes for buttons | https://www.w3schools.com/tags/tag_button.asp | 
| html attributes for input | https://www.w3schools.com/html/html_form_attributes.asp |
| axios http requests | https://axios-http.com/docs/post_example | 
| vscode | https://code.visualstudio.com/ |


## How to run locally

- Ensure you have [node.js](https://nodejs.org/en/download/) installed on your machine
- Clone this repo to your local machine.
- in the terminal switch to the "BrownHopeAidApp/frontend" directory
- run npm install 
  - fixing vulnerabilities is covered in packages under common issues
- Change server in config.ts to localhost:5000
  - ensure you do not merge to development with this change. It should be set to the ip address of your server.
- run npm start 
- start up the backend (optional)

## How to make changes

The pages on the site are constructed from elements present in a util file, allowing what the user interacts with on each page to be changed. The appearance is handled in a universal css file, allowing for fonts, colors, and sizes to be tweaked until you are satisfied with the output. When changing input fields, ensure the backend is changed in a way to accomodate the changes. 

### How util files work

Most pages on this site consist of forms the user fills out. These forms are constructed from files in the frontend/util folder. The interfaces for input fields and buttons are contained in the inputUtil.ts: 

```JavaScript
export interface IFields {
  label: string, 
  id: string, 
  value: any,
  name?: string,
  placeholder?: string, 
  type?: string,
  format?: string,
  autoComplete?: string
  options?: string[], 
}
```
IFields interfaces refer to input fields. In the browser, the values are used for HTML element attributes, and occasionally formatting. 

```JavaScript
export interface IButtons {
  text: string, 
  type?: string, 
  to?: string,  // note: this will only redirect to pages on site
  bootstrapClass: string,
}
```

IButtons are of two types: Submit form or redirect. 

```JavaScript
export interface IForm{
  fields: IFields[],
  buttons: IButtons[],
  submit: Function,
  onFocus?: Function,
  submitVerify?: Function,
}
```

Forms containt fields and buttons, along with a function to call the backend on submit. onfocus is used to change the on focus function which is called when the user focuses on an input fields. Finally submitVerify is used to add another boolean value to the input verification logic, i.e. ensuring a new password is correct in both fields it should be present. 

To see how they are used, lets check out the loginUtil file: 

```JavaScript
// from loginUtil.ts
export const fields: IFields[] = [
  {
    label: "Username",
    id: "username",
    type: "textbox",
    value: "",
  },
  {
    label: "Password",
    id: "password",
    type: "password",
    value: "",
  },
]
```

Above we describe the input fields, one for username one for password
 
```JavaScript
// from loginUtil.ts
export const buttons: IButtons[] = [
  {
    text: "Login",
    type: "submit",
    bootstrapClass: "btn btn-success"
  },
  {
    text: "Create An Account",
    to: "/sign-up",
    bootstrapClass: "btn btn-secondary"
  }
]
```

Above code describes buttons that will appear on the page. 

```JavaScript
// from loginUtil.ts
export const header = "Login to your account"

// This function is used to format the request sent to the
// back end
export const LoginFormToHttpBody = (form:IFields[]) => {
  return {
    username: form[0].value,
    password: form[1].value,
  }
}
```

Header refers to text in h1 html element. LoginFormToHttpBody describes how the values will be passed to the backend in the request. 

```JavaScript
// from loginUtil.ts
export const sendLoginRequest = async (form: IFields[], afterSubmit:Function) => {
  try {
    const resp = await axios.post(routes.login, LoginFormToHttpBody(form), { withCredentials: true });
    console.log(resp.data);
    if (resp.data === "Success") {
      sessionStorage.setItem('username', form[0].value);
      window.location.reload()
    } else if (resp.data === "Failed") {
      alert("Sorry, wrong username or password. Please try again!")
    }
  } catch (err) {
    // Handle Error Here
    console.error(err);
    alert("Login Failed");
  }
};
```

Above is the function that will be used to send the request to the backend. 

```JavaScript
// from loginUtil.ts
export const form: IForm =
{
  fields: fields,
  buttons: buttons,
  submit: sendLoginRequest,
}
```

We tie all the bits of the file together here. This IForm will be used by formUtil.tsx To create the html page

### Config.css

Many css values are set in the file config.css in the styles folder. For those of you more experienced with css, the files are also in the styles folder. These values control the size, color, and text appearance. To change the font used (currently bebas-neue) change the src value of @font-face in App.css. Below are the css values and how they are used. 

| Variable | Description |
| -------- | ----------- |
| gradient | color used for gradient starting at bottom of screen|
| background-color | color of page background |
| gradient-height | How far the colored gradient goes on the page | 
| theme-color | Color used for header text and some buttons | 
| button-text-color | Color used for button text, usually overwritten by bootstrap elements |
| max-width | maximum width of all elements not in a form | 
| nav-item-width | used for width of list items in nav bar |
| logo-height | height of logo in nav bar | 
| current-page-max-width | max width the form will appear on the page |
| current-page-std-width | Width form will aim for until it hits max-width | 
| high, medium, low | Font size labeled by priority | 
| Nav, nav-weight | Font size and weight for nav text items | 
| footer, footer-weight | Font size and weight for footer text items |
| header, header-weight, header-letter-spacing | Font size, weight, and spacing for h1 elements |
| app-status-color, status, app-status-weight | Font color |  
| text-field | font size of input field | 
| label | font size for label on input fields |
| button, button-letter-spacing, button-weigt | Controls font size, spacing and weight for button elements |

### Tutorial 

Lets do an example change to the frontend where we change:
- colors
- nav image
- font
- username to email on login page 

The current page looks like: 

![before](https://user-images.githubusercontent.com/77218586/175397528-34e179d3-005f-47ed-88cb-87855c954e63.png)

First lets change the color scheme. 

```Css
  /* From config.css */
  /* color gradient at the bottom of the page */
  --gradient: #50dc64;
  --background-color: black;
  --gradient-height: 30vh;

  /* Color for header text */
  --theme-color: white;
```
![step1](https://user-images.githubusercontent.com/77218586/175397595-7baa24ab-d28d-4c22-973c-51e63b9ee956.png)

Next lets get the right logo up there. 

```JavaScript
// From navUtil.ts
export const items: navItem[] = [
  {
    href: "https://www.blackresiliencefund.com/",
    className: "logo",
    src: "BRFlogoCOLOR650px060420.png",
    alt: "BRF logo",
    imgClass: "navlogo"
  },
``` 
![step2](https://user-images.githubusercontent.com/77218586/175397613-cec4679e-fa6b-4372-8be7-cf77922649f2.png)



Next lets change the username field:


```JavaScript
// from loginUtil.ts
export const fields: IFields[] = [
  {
    label: "Email",
    id: "email",
    type: "textbox",
    value: "",
  },

// ...

export const LoginFormToHttpBody = (form: IFields[]) => {
  return {
    email: form[0].value,
    password: form[1].value,
  }
}
```


Note that the structure of LoginFormToHttpBody has changed to reflect the changes in the form. This means that the backend call needs to be adjusted to reflect this change.

Now lets change the font:
![step3](https://user-images.githubusercontent.com/77218586/175397628-413ea49c-2a3f-4b68-9ba1-752ae7c56c4b.png)


```Css
/* From app.css */
@font-face {
    font-family: header-font;
    /* route to font for header in fonts */
    src: url("../styles/fonts/RaleWay/static/Raleway-Bold.ttf")format("woff2");
}
```
![step4](https://user-images.githubusercontent.com/77218586/175397646-1409d70c-5ab9-4192-b555-9a7c00a6f41a.png)



Congratulations! you have completed the tutorial, the site is set up for a new organization! These changes will only be present on your machine, to get them into the main or development branch, you will need to follow this [wiki editing tutorial](https://github.com/PSU-CapstoneBrownHope/BrownHopeAidApp/wiki). The tutorial explains how to edit the github wiki, however the steps are the same for creating a branch in repository, until the merging step. 

Your organization's main branch should be protected, so you cannot push changes directly to it. You will have to create a pull request for your branch instead which can be done by following this [tutorial](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

## Common Issues

This section will cover some of the issues we ran into in development and how we fixed them

### Packages

With the number of dependencies on the frontend, there are commonly vulnerabilities created by outdated ones. Below are some of the ways for how to indetify the problem package and fix it. If you run into any more issues consult the FAQ section, or create an issue on the [github](https://github.com/PSU-CapstoneBrownHope/BrownHopeAidApp/).

If you run npm install and see vulnerabilities:

![vulnerabilitiesOnInstall](https://user-images.githubusercontent.com/77218586/167921834-0f0b846f-3d84-450e-8394-e660f32d12be.png)

1. run npm audit

![npmAudit](https://user-images.githubusercontent.com/77218586/167924046-8c50d3d7-1eba-43bd-af7e-4b8534d2731a.png)

This shows an audit report. The first box is surrounding the offending package nth-check. In this example there is a single dependency issue, but you might see more. The next red highlight shows something you should NOT do, as it will cause more vulnerabilities. In gray is the list of packages affected by this dependency issue. 

  1. Check if the package is in use, some packages may be in but never used. For this step you should check with your supervisor before removing a problem package. Once the package is removed run npm install again to ensure there are no other vulnerabilities. If not, you're done and can continue working. 

2. Search for package name in package-lock.json (I used vim). Using the information from the audit report we know that "css-select" is the package dependent on this vulnerable version of nth-check. 

![badPackage](https://user-images.githubusercontent.com/77218586/167924665-9194e87b-00c5-41cc-aed9-3c2b2aeb15b5.png)

In the audit report the system told us the issue was that the nth-check package was below version 2.0.1. We change that value to be "^2.0.1":

![goodPackage](https://user-images.githubusercontent.com/77218586/167924983-0f61531e-2dbd-4ccf-bdf6-c44644f47f9f.png)

now lets run npm install again

![goodInstall](https://user-images.githubusercontent.com/77218586/167925988-343f611e-e45d-489f-ae0a-5408a9aab196.png)

For those of you wanting to update the packages as they advance in the future, this is a way to sort out any new vulnerabilities. 

