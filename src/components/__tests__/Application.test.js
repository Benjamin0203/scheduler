import React from "react";

import { render, cleanup, getAllByPlaceholderText } from "@testing-library/react";

import Application from "components/Application";

const waitForElement = require("@testing-library/react").waitForElement;
const fireEvent = require("@testing-library/react").fireEvent;
const prettyDOM = require("@testing-library/react").prettyDOM;
const getByAltText = require("@testing-library/react").getByAltText;
const getByText = require("@testing-library/react").getByText;
const getAllByTestId = require("@testing-library/react").getAllByTestId;
const getByPlaceholderText = require("@testing-library/react").getByPlaceholderText;

afterEach(cleanup);



describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
   
    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
  
    await waitForElement(() => getByText("Monday"));
  
    fireEvent.click(getByText("Tuesday"));
  
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
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

  //Test 1: Check if the application loads data, books an interview and reduces the spots remaining for Monday by 1
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);
    
    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointments = getAllByTestId(container, "appointment")

    const appointment = appointments[0];


    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    console.log(prettyDOM(appointment));
  
  });

});