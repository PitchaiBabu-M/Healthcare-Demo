import React, { useState, useEffect } from 'react';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const [executedActions, setExecutedActions] = useState({
    doctor: false,
    date: false,
    time: false,
    name: false,
    age: false,
    number: false,
    no: false,
    thankyou: false,
  });

  const [currentAction, setCurrentAction] = useState(null);
  const [inputvalue, setInputvalue] = useState('');


  useEffect(() => {
    const inputElement = document.querySelector('.react-chatbot-kit-chat-input');
    if (inputElement) {
      inputElement.addEventListener('input', handleInput);
    }
    
    return () => {
      if (inputElement) {
        inputElement.removeEventListener('input', handleInput);
        inputElement.value = inputvalue;
      }
    };
  }, [currentAction]);

  const handleInput = (e) => {
    const updatedvalue = e.target.value;

    switch (currentAction) {
      case 'name':
        e.target.value = updatedvalue.replace(/[^a-zA-Z. ]/g, '')

        break;
      case 'age':
        e.target.value = updatedvalue.replace(/[^0-9]/g, '').substring(0, 2);

        break;
      case 'number':
        e.target.value = updatedvalue.replace(/[^0-9]/g, '').substring(0, 10);

        break;
      default:
        break;
    }
  };


  const disableChatInput = () => {
    const chatInputContainer = document.getElementsByClassName('react-chatbot-kit-chat-input-container')[0];
    if (chatInputContainer) {
      const inputElement = chatInputContainer.querySelector('input');
      const buttonElement = chatInputContainer.querySelector('button');
      if (inputElement) {
        inputElement.disabled = true;
        buttonElement.disabled = true;
      }
    }
  };

  const enableChatInput = () => {
    const chatInputContainer = document.getElementsByClassName('react-chatbot-kit-chat-input-container')[0];
    if (chatInputContainer) {
      const inputElement = chatInputContainer.querySelector('input');
      const buttonElement = chatInputContainer.querySelector('button');
      if (inputElement) {
        inputElement.disabled = false;
        buttonElement.disabled = false;
      }
    }
  };

  const updateExecutedActions = (action) => {
    setExecutedActions((prevActions) => ({
      ...prevActions,
      [action]: true,
    }));
  };

  const initialAction = () => {
    if (!executedActions.doctor) {
      const message = createChatBotMessage('Do you need a Doctor Appointment ?', {
        widget: 'YesorNo',
      });
      updateState(message, 'doctor');
      updateExecutedActions('doctor');
    }
    disableChatInput()
  };

  const yesAction = () => {
    if (!executedActions.date) {
      const message = createChatBotMessage('Available Doctors', {
        widget: 'Doctor',
      });
      updateState(message, 'date');
      updateExecutedActions('date');
      disableChatInput()
    }
  };

  const noAction = () => {
    if (!executedActions.doctor) {
      const message = createChatBotMessage('If any enquiry contact 8807262725 or 0452-4051228 !')
      updateState(message);
      updateExecutedActions();
    }
  };

  const appointment = (doctorname) => {
    if (!executedActions.time) {
      const message = createChatBotMessage('Kindly select your Appointment date', {
        widget: "Date"
      })
      updateState(message, 'time', doctorname);
      updateExecutedActions('time');
      disableChatInput()
    }
  };

  const timeaction = (selectedDate) => {
    if (!executedActions.name) {
      const message = createChatBotMessage('Kindly select your Appointment time', {
        widget: "Time"
      })
      updateState(message, "name", null, selectedDate);
      updateExecutedActions('name');
      disableChatInput()

    }
  };

  const nameaction = (selectedTime) => {
    if (!executedActions.age) {
      setCurrentAction('name');
      const message = createChatBotMessage('Your Name ?');
      updateState(message, 'age', null, null, selectedTime);
      updateExecutedActions('age');
      enableChatInput();
    }
  };

  const ageaction = () => {
    if (!executedActions.number) {
      setCurrentAction('age');
      const message = createChatBotMessage('Your Age ?');
      updateState(message, 'number');
      updateExecutedActions('number');
      enableChatInput();
    }
  };

  const numberaction = () => {
    setCurrentAction('number');
    const message = createChatBotMessage('Your Mobile Number ?', {});
    updateState(message, 'final');
    enableChatInput();

  };

  const finalaction = (username, doctorname, selectedDate, selectedTime) => {

    const message = createChatBotMessage(`Hi, ${username} Confirm your Appointment Details :
    DoctorName : ${doctorname},
    Appointment Date : ${selectedDate},
    Appointment Time : ${selectedTime}`
      , {
        widget: "Final"
      })
    updateState(message, "thankyou");
  }

  const thankyouAction = () => {
    const message = createChatBotMessage('Thankyou for booking !')
    updateState(message);
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

  useEffect(() => {
    disableChatInput();
    return () => enableChatInput();
  }, []);

  return (
    <div>
      {children && React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            disableChatInput,
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
