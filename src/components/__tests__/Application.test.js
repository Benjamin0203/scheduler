import React from "react";

import { render, cleanup } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);



describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
    const waitForElement = require("@testing-library/react").waitForElement;
    const fireEvent = require("@testing-library/react").fireEvent;

    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  
  });

  it("Tests a mock function", () => {
    // test code here...
    const fn = jest.fn((a, b) => 42);
    fn(1, 2);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveReturnedWith(42);
  });

  test.skip("does something it is supposed to do", () => {
    // test code here...
  });

});