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
