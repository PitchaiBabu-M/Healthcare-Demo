import React, { useState } from 'react';

export default function AppointBtn(props) {
  const [choiceMade, setChoiceMade] = useState(false);

  const yesAction = () => {
    if (!choiceMade) {
      props.actions.yesAction();
      setChoiceMade(true);
    }
  }

  const noAction = () => {
    if (!choiceMade) {
      props.actions.noAction();
      setChoiceMade(true);
    }
  }

  return (
    <div>
      <button className='yes-btn' onClick={yesAction} >
        Yes
      </button>
      <button className='no-btn' onClick={noAction} >
        No
      </button>
    </div>
  );
}

