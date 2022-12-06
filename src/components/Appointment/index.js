import React from "react";
import "../Appointment/styles.scss";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";


import useVisualMode from "hooks/useVisualMode";


export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVE = "SAVE";
  const DELETE = "DELETE";
  const CONFIRM = "CONFIRM";


  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {

    transition(SAVE);

    const interview = {
      student: name,
      interviewer
    };

    
    props.bookInterview(props.id, interview)
    .then(() => transition(SHOW))
  };

  function destroy() {
    transition(DELETE);
    props.cancelInterview(props.id)
    .then(() => {
      transition(EMPTY)
    })
  }
  

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition("CREATE")} />}
      
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition("CONFIRM")}
        />
      )}
      
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you want to delete?"
          onConfirm={destroy}
          onCancel={back}
        />
      )}
 
      {mode === DELETE && (
        <Status message="Deleting" />
      )}
      {mode === SAVE && (
        <Status message="Saving" />
      )}


      {/* {props.interview ? <Show student={props.interview.student} interviewer={props.interview.interviewer} /> : <Empty />} */}
    </article>
  );
}