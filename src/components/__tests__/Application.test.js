import React from "react";
import axios from "axios";


import { render, cleanup, waitForElement, fireEvent, getByAltText, getByText, getAllByTestId, getByPlaceholderText, queryByText, queryByAltText, waitForElementToBeRemoved } from "@testing-library/react";

import Application from "components/Application";

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

  

  //Test ONE: Check if the application loads data, books an interview and reduces the spots remaining for Monday by 1
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);
    
    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointments = getAllByTestId(container, "appointment")

    const appointment = appointments[0];
    
    //----------check no spots remaining for Monday----------------

    // const day = getAllByTestId(container, "day").find(day =>
    //   queryByText(day, "Monday")
    // );

    // // console.log(prettyDOM(day));

    // expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();

//--------------------------------------------------------------

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    // console.log(prettyDOM(appointment));
  
  });

  //Test TWO: Check if the application loads data, cancels an interview and increases the spots remaining for Monday by 1
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
  
    fireEvent.click(queryByAltText(appointment, "Delete"));
  
    // 4. Check that the confirmation message is shown.
    expect(
      getByText(appointment, "Are you sure you want to delete?")
    ).toBeInTheDocument();
  
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));
  
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
  
    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));
  
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
  
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  //Test THREE: Check if the application loads data, edits an interview and keeps the spots remaining for Monday the same
  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => { 
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
  
    fireEvent.click(queryByAltText(appointment, "Edit"));
  
    // 4. Check that the edit form is shown.
    expect(
      getByPlaceholderText(appointment, "Enter Student Name")
    ).toBeInTheDocument();
  
    // 5. Change the name and save.
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
  
    fireEvent.click(getByText(appointment, "Save"));
  
    // 6. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
  
    // 7. Wait until the element with the "Archie Cohen" is displayed.
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
  
    // 8. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
  
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  //Test FOUR: Check if the application shows the save error when failing to save an appointment
  it("shows the save error when failing to save an appointment", async () => {
    
    axios.put.mockRejectedValueOnce();
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    await waitForElementToBeRemoved(() => getByText(appointment, "Saving"));
    expect(getByText(appointment, "Could not save appointment.")).toBeInTheDocument();

  });

  //Test FIVE: Check if the application shows the delete error when failing to delete an existing appointment
  it("shows the delete error when failing to delete an existing appointment", async () => {
      
      axios.delete.mockRejectedValueOnce();
      const { container } = render(<Application />);
  await waitForElement(() => getByText(container, "Archie Cohen"));
  const appointments = getAllByTestId(container, "appointment");
  const appointment = appointments.find(appointment => queryByText(appointment, "Archie Cohen"));

  fireEvent.click(getByAltText(appointment, "Delete"));
  expect(getByText(appointment, /Are you sure you want to delete?/i)).toBeInTheDocument();
  fireEvent.click(getByText(appointment, "Confirm"));
  expect(getByText(appointment, "Deleting")).toBeInTheDocument();
  await waitForElementToBeRemoved(() => getByText(appointment, "Deleting"));
  expect(getByText(appointment, "Could not delete appointment.")).toBeInTheDocument();
  });
  
});