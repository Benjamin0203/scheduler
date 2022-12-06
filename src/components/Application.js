import React, { useState, useEffect } from "react";

import axios from "axios";

import "components/Application.scss";

import DayList from "./DayList";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

//Application component
export default function Application(props) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  //Get the appointment data for the selected day
  const dailyAppointments = getAppointmentsForDay(state, state.day);


  /*
  We don't want to make the request every time the component renders. Instead, we need to remove the dependency. We do that by passing a function to setState.
  */
  const setDay = day => setState(prev => ({ ...prev, day }));


  //test
  // console.log(state.interviewers);



  useEffect(() => {
    const promise1 = axios.get("/api/days");
    const promise2 = axios.get("/api/appointments");
    const promise3 = axios.get("/api/interviewers")
    const promises = [promise1, promise2, promise3]
    Promise.all(
      promises
    ).then(
      (all) => {
        setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }))
      }
    )
  }, []);

  // axios.get("/api/days")
  // .then(response => {
  //   console.log(response);
  //   // setDays([...response.data])
  // })

  //change the local state when we book an interview
  function bookInterview(id, interview) {
    // console.log(id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    setState({
      ...state,
      appointments
    });
    return axios.put(`/api/appointments/${id}`, { interview })
  }

  //change the local state when we cancel an interview
  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`).then((res) => {
      console.log('in cancelInterview - .then - res', res)
      const appointment = {
        ...state.appointments[id],
        interview: null
      };
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };

      //Test
      // console.log("state: ", state, "appointments: ", appointments);

      setState({
        ...state,
        appointments
      });
    })
  }

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
        {dailyAppointments.map((appointment) => {
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
          //----------------------------
          //old code:
          // return <Appointment key={appointment.id} {...appointment} />;
        })}
      </section>
    </main>
  );
}
