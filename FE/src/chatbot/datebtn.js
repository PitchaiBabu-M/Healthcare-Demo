import React from 'react'

export default function Datebtn(props) {

    const handleDateChange = (event) => {
        const selectedDate = event.target.value;
        if (selectedDate) {
          props.actions.timeaction(selectedDate);
        }
      };

    return (
        <div>
      <input type="date" id="appointmentdate" onChange={handleDateChange} />
        </div>
    )
}

