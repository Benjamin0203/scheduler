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

//---------1----------------
function findDay(day) {
  const daysOfWeek = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4
  }
  return daysOfWeek[day]
}
//---------1----------------


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

    //------2--------
    const dayOfWeek = findDay(state.day)

    let day = {
      ...state.days[dayOfWeek],
      spots: state.days[dayOfWeek]
    }

    if (!state.appointments[id].interview) {
      day = {
        ...state.days[dayOfWeek],
        spots: state.days[dayOfWeek].spots - 1
      } 
    } else {
      day = {
        ...state.days[dayOfWeek],
        spots: state.days[dayOfWeek].spots
      } 
    }

    let days = state.days
    days[dayOfWeek] = day;
    //---2-----------------

    // setState({
    //   ...state,
    //   appointments
    // });
    return axios.put(`/api/appointments/${id}`, { interview })
    .then(res => {
      setState({
        ...state,
        appointments,
        days
        })
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

      //------3--------
      const dayOfWeek = findDay(state.day)

    const day = {
      ...state.days[dayOfWeek],
      spots: state.days[dayOfWeek].spots + 1
    }

    let days = state.days
    days[dayOfWeek] = day;
    //---3-----------------

      setState({
        ...state,
        appointments,
        days
      });
    })
  }

  return { state, setDay, bookInterview, cancelInterview };
}