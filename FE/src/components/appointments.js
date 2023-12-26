import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function Appointments() {
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [bookedAppointments, setBookedAppointments] = useState([]);

    const handleDoctorChange = async (e) => {
        const selectedValue = e.target.value;
        setSelectedDoctor(selectedValue);
      
        try {
            const response = await axios.get(`http://localhost:4000/available-timings/${selectedValue}`);
            console.log("response", response.data); 
            setBookedAppointments(response.data);

        } catch (error) {
            console.error('Error fetching available timings:', error);
            setBookedAppointments([]);
        }
    };  

    return (
        <div>
            <h2>Booked Appointments</h2>
            <br/>
            <select
                className="form-select mb-3 w-25"
                value={selectedDoctor}
                onChange={handleDoctorChange}

            >
                <option value="">Select a doctor</option>
                <option value="Dr.JothiPriya">Dr.JothiPriya</option>
                <option value="Dr.Vasudevan">Dr.Vasudevan</option>
            </select>

            <Calendar
                localizer={localizer}
                events={bookedAppointments.map(appointment => ({
                    title: `${appointment.user_name}'s appointment`,
                    start: moment(`${appointment.date} ${appointment.timing}`, 'YYYY-MM-DD HH:mm').toDate(),
                    end: moment(`${appointment.date} ${appointment.timing}`, 'YYYY-MM-DD HH:mm').add(15, 'minutes').toDate(), 
                }))}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }} 
                timeslots={1} 
                min={moment().set({ hour: 9, minute: 0 }).toDate()}
                max={moment().set({ hour: 18, minute: 30 }).toDate()} 
                step={15} 
            />
        </div>
    );
}
