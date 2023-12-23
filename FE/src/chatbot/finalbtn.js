import React from 'react';

export default function Finalbtn(props) {
  const { doctorname, selectedDate, selectedTime, username, age, mobileno } = props.state.userData;

  const handleYesClick = async () => {
    try {
      const response = await fetch('https://apidemo.5ytechno.com/api/available-timings/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctor: doctorname,
          date: selectedDate,
          time: selectedTime,
          name: username,
          age,
          mobile: mobileno,
        }),
      });

      if (response.ok) {
        thankyouAction();
        console.log('Appointment booked successfully!');
      } else {
        console.error('Failed to book appointment');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleNoClick = () => {
    props.actions.noAction();
  }

  const thankyouAction = () => {
    props.actions.thankyouAction();
  }

  return (
    <div>
      <button onClick={handleYesClick}>Yes</button>
      <button onClick={handleNoClick}>No</button>
    </div>
  );
}
