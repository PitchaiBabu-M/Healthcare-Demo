import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TimeBtn(props) {
   const {doctorname, selectedDate} = props.state.userData
    const [bookedSlots, setBookedSlots] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
            const response = await axios.get(`https://apidemo.5ytechno.com/available-timings?doctor=${doctorname}&date=${selectedDate}`);

          setBookedSlots(response.data);
        } catch (error) {
          console.error('Error fetching booked slots:', error);
        }
      };
  
      fetchData();
    }, []); 
  
    const handletimeChange = (event) => {
        const selectedTime = event.target.value;
        if (selectedTime) {
          props.actions.nameaction(selectedTime);
        }
      };

    return (
        <div>
            <select onChange = {handletimeChange}>
                <option value="">Select a time</option>
                {bookedSlots.map((slot, index) => (
                    <option key={index} value={slot}>
                        {slot}
                    </option>
                ))}
            </select>
        </div>
    )
}

