export function getAppointmentsForDay(state, day) {
  //... returns an array of appointments for that day
  const filteredNames = state.days.filter((dayObj) => dayObj.name === day);
  if (filteredNames.length === 0) {
    return [];
  } else {
    const filteredAppointments = filteredNames[0].appointments.map((appointment) => state.appointments[appointment]);
    return filteredAppointments;
  }
}

export function getInterview(state, interview) {
  //... returns an object that contains the interview data when we pass it an object that contains the interviewer
  if (interview) {
    return {
      interviewer: {...state.interviewers[interview.interviewer]},
      student: interview.student
    }
    } else {
    return null;
  }
}