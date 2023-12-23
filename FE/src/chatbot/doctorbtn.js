import React from 'react';

export default function Doctorbtn (props) {

  const appointment = (doctorname) => {
    props.actions.appointment(doctorname);
  }

  return (
    <div>
      <button className='fdoc-btn' onClick={() => appointment("Dr.JothiPriya")} >Dr.JothiPriya</button>
      <button className='sdoc-btn' onClick={() => appointment("Dr.Vasudevan")}>Dr.Vasudevan</button>
    </div>
  );
}
