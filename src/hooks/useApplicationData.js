import { useEffect, useState } from "react";
import axios from "axios";
//spots remaining

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

  const getSpots = (state, newAppointements) => {
    const dayIndex = state.days.findIndex(day => day.name === state.day);
    const currentDay = state.days[dayIndex];
    const listOfAppointmentIds = currentDay.appointments;
  
    const listOfFreeAppointments = listOfAppointmentIds.filter(id => !newAppointements[id].interview);
  
    const spots = listOfFreeAppointments.length;
    return [dayIndex, spots];
  }



  const updateSpots = function() {
    axios.get('/api/days')
      .then((res) => {
        
        setState(prev => ({...prev, days: res.data}))
     
      })
  }



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



    // setState({
    //   ...state,
    //   appointments
    // });
    return axios.put(`/api/appointments/${id}`, { interview })
    .then(res => {
      
      setState({
        ...state,
        appointments,
        })
        const [today, spots] = getSpots(state, appointments); const day = {...state.days[today], spots:spots}; const days = [...state.days]; days.splice(today, 1, day);
        updateSpots();
    })
  }

  //change the local state when we cancel an interview
  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`).then((res) => {
      // console.log('in cancelInterview - .then - res', res)
  
  
      const appointment = {
        ...state.appointments[id],
        interview: null
      };
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };

      setState({
        ...state,
        appointments,
      });
      
      const [today, spots] = getSpots(state, appointments); const day = {...state.days[today], spots:spots}; const days = [...state.days]; days.splice(today, 1, day);
      updateSpots();
    })
  }

  return { state, setDay, bookInterview, cancelInterview };
}