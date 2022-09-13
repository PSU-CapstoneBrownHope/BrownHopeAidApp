import {
  IField,
  passwordVerify,
  isValidDate,
  formatDate,
  formatPhoneNumber,
} from '../util/inputUtil';

let container = document.createElement("div");

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container)
});

afterEach(() => {
  document.body.removeChild(container);
});

test("Password Verify", async () => {
  let testForm: IField[] = [
    {
      label: "New Password",
      id: "newPassword",
      type: "password",
      autoComplete: "new-password",
      value: "oneWord",
    },
    {
      label: "Confirm New Password",
      id: "verifyPassword",
      autoComplete: "new-password",
      type: "password",
      value: "another",
    },
  ]
  // not matching same length
  expect(passwordVerify(testForm)).toBe(false)

  testForm[0].value = "aLongerWord"
  // not matching diff length
  expect(passwordVerify(testForm)).toBe(false)

  testForm[0].value = "another"
  expect(passwordVerify(testForm)).toBe(true)

});

test("isValidDate", async () => {
  let dates = [
    ["", false],
    ["03/20/98", false],
    ["03/20/1998", true],
  ]
  dates.forEach((item: any) => {
    expect(isValidDate(item[0])).toBe(item[1])
  })
})

test("formate date", async () => {
  let dates = [
    ["031", "03/1"],
    ["03/192", "03/19/2"],
    ["03/19/2000", "03/19/2000"],
    ["02/31", "02/29"],
    ["04/31", "04/30"],
    ["06/31", "06/30"],
    ["09/31", "09/30"],
    ["11/31", "11/30"],
  ]
  dates.forEach((item: any) => {
    expect(formatDate(item[0])).toBe(item[1])
  })
})

test("format phone number", async () => {
  let phoneNumbers = [
    ["360", "360"],
    ["3601", "(360) 1"],
    ["(360) 1234", "(360) 123-4"],
    ["(360) 123-456789", "(360) 123-4567"],
  ]
  phoneNumbers.forEach((item: any) => {
    expect(formatPhoneNumber(item[0])).toBe(item[1])
  })
})


