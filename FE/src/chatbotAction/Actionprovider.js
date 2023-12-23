import React from 'react';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  
  const initialAction = () => {
    const message = createChatBotMessage('Do you need Doctor Appointment ?', {
      widget: "YesorNo"
    })
    updateState (message,"doctor" );
  }

  const yesAction = () => {
    const message = createChatBotMessage('Available Doctors', {
      widget: "Doctor"
    })
    updateState (message, "date" );
  }

  const noAction = () => {
    const message = createChatBotMessage('How can I help you ?')
    updateState (message, "doctor");
  }

  const appointment = (doctorname) => {
    const message = createChatBotMessage('Kindly select your Appointment date', {
      widget: "Date"

    })
    updateState(message, 'time', doctorname);
  }

  const timeaction = (selectedDate) => {
    const message = createChatBotMessage('Kindly select your Appointment time', {
      widget: "Time"

    })
    updateState (message, "name", null, selectedDate); 
  }

  const nameaction = (selectedTime) => {
    const message = createChatBotMessage('Your Name ?')
    updateState (message, "age", null, null, selectedTime);
  }

  const ageaction = () => {
    const message = createChatBotMessage('Your Age ?')
    updateState (message, "number");
  }

  const numberaction = () => {
    const message = createChatBotMessage('Your Mobile Number ?', {
    })
    updateState (message, "final");
  }

  const finalaction = (username,doctorname,selectedDate,selectedTime ) => {
    const message = createChatBotMessage(`Hi, ${username} Confirm your Appointment Details :
    DoctorName : ${doctorname},
    Appointment Date : ${selectedDate},
    Appointment Time : ${selectedTime}`
     , {
      widget : "Final"
    })
    updateState (message, "thakyou");
  }

  const thankyouAction = () => {
    const message = createChatBotMessage('Thankyou for booking !')
    updateState (message);
  }

  const updateState = (message, checker, doctorname = null, selectedDate = null, selectedTime = null) => {
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
      checker,
      userData: {
        ...prev.userData,
        doctorname: doctorname !== null ? doctorname : prev.userData.doctorname,
        selectedDate: selectedDate !== null ? selectedDate : prev.userData.selectedDate,
        selectedTime: selectedTime !== null ? selectedTime : prev.userData.selectedTime,
      },
    }));
  };
  
  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            initialAction,
            yesAction,
            noAction,
            appointment,
            timeaction,
            nameaction,
            ageaction,
            numberaction,
            finalaction,
            thankyouAction
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;