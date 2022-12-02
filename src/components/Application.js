import React, {useState, useEffect} from "react";

import axios from "axios";

import "components/Application.scss";

import DayList from "./DayList";
import Appointment from "components/Appointment";
import { getAppointmentsForDay } from "helpers/selectors";


export default function Application(props) {
  
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  })

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  /*
  We don't want to make the request every time the component renders. Instead, we need to remove the dependency. We do that by passing a function to setState.
  */
  const setDay = day => setState(prev => ({ ...prev, day }));
  // const setDays = days => setState(prev => ({ ...prev, days }));
  
console.log(state.day);

  useEffect(() => {
    const promise1 = axios.get("/api/days");
    const promise2 = axios.get("/api/appointments");
    const promises = [promise1, promise2]
    Promise.all(
      promises
    ).then(
      (all) => {
        setState(prev => ({...prev, days: all[0].data, appointments: all[1].data}))
      }
    )    
  }, []);

  // axios.get("/api/days")
  // .then(response => {
  //   console.log(response);
  //   // setDays([...response.data])
  // })

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
          return <Appointment key={appointment.id} {...appointment} />;
        })}
      </section>
    </main>
  );
}
