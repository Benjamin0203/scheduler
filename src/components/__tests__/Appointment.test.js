import React from "react";

import { render, cleanup } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);



// describe("Application", () => {

//   it("renders without crashing", () => {
//     render(<Application />);
//   });

//   it("Tests a mock function", () => {
//     // test code here...
//     const fn = jest.fn((a, b) => 42);
//     fn(1, 2);
//     expect(fn).toHaveBeenCalledTimes(1);
//     expect(fn).toHaveReturnedWith(42);
//   });

//   test.skip("does something it is supposed to do", () => {
//     // test code here...
//   });

// });