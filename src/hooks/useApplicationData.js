import { useEffect, useState } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })



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

  return { state, setDay, bookInterview, cancelInterview };
}