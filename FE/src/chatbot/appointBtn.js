import React from 'react';

export default function AppointBtn(props) {
  const yesAction = () => {
    props.actions.yesAction();
  }

  const noAction = () => {
    props.actions.noAction();
  }

  return (
    <div>
      <button className='yes-btn' onClick = {() => yesAction()}>Yes</button>
      <button className='no-btn' onClick = {() => noAction()}>No</button>
    </div>
  );
}
