import React, { useState } from 'react';
import config from "../config";



export default function Finalbtn(props) {
  const [choiceMade, setChoiceMade] = useState(false);

  const { doctorname, selectedDate, selectedTime, username, age, mobileno } = props.state.userData;

  const handleYesClick = async () => {
    if (!choiceMade) {
      setChoiceMade(true);
      try {
        const response = await fetch( `${config.apiUrl}/available-timings/book`, {
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
    }
  };

  const handleNoClick = () => {
    if (!choiceMade) {
      props.actions.noAction();
      setChoiceMade(true);
    }
  }

  const thankyouAction = () => {
    if (!choiceMade) {
      props.actions.thankyouAction();
      setChoiceMade(true);
    }
  }

  return (
    <div>
      <button onClick={handleYesClick}>Yes</button>
      <button onClick={handleNoClick}>No</button>
    </div>
  );
}

