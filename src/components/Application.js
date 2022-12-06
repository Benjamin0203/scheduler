import React, { useState, useEffect } from "react";

import axios from "axios";

import "components/Application.scss";

import DayList from "./DayList";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

import useApplicationData from "hooks/useApplicationData";
//Application component
export default function Application(props) {
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

    //Get the appointment data for the selected day
    const dailyAppointments = getAppointmentsForDay(state, state.day);

//-----------------START-----------------
 
//-----------------END-----------------

    //Map over the appointment data and return an Appointment component for each appointment
    const appointments = dailyAppointments.map((appointment) => {
      //refactor the codes to reduce the duplication of data
      const interview = getInterview(state, appointment.interview);
      return (
        <Appointment
          key={appointment.id}
          id={appointment.id}
          time={appointment.time}
          interview={interview}
          interviewers={getInterviewersForDay(state, state.day)}
          bookInterview={(id, interview) => bookInterview(id, interview)}
          cancelInterview={(id) => cancelInterview(id)}
        />
      );
    })

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu"><DayList
          days={state.days}
          value={state.day}
          onChange={setDay}
        /></nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointments}
      </section>
    </main>
  );
}
