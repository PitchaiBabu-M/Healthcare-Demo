import React from 'react';

export default function Datebtn(props) {
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    if (selectedDate) {
      props.actions.timeaction(selectedDate);
    }
  };

  return (
    <div>
      <input type="date" id="appointmentdate" onChange={handleDateChange} min={minDate} />
    </div>
  );
}