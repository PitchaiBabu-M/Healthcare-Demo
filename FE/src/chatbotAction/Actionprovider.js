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

  useEffect(() => {
    const chatInputContainer = document.querySelector('.react-chatbot-kit-chat-input-container');
    const buttonElement = chatInputContainer.querySelector("button")
 
    if (!chatInputContainer) {
        console.error('Chat input container not found');
        return;
    }

    const inputElement = chatInputContainer.querySelector('input');
    if (!inputElement) {
        console.error('Input element not found');
        return;
    }

    const handleKeyDown = (e) => {
      const value = e.target.value;
  
      if (currentAction === 'name') {
          if (!/^[a-zA-Z .]*$/.test(e.key) && e.key !== 'Backspace') {
              e.preventDefault();
          }
      } else if (currentAction === 'age') {
          if (!/^[0-9]*$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Enter') {
            e.preventDefault();
        }
        if (value.length >= 2 && e.key !== 'Backspace' && e.key !== 'Enter') {
            e.preventDefault();
        }
      } else if (currentAction === 'number') {
       
        if (!/^[0-9]*$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Enter') {
            e.preventDefault();
        }
        if (value.length >= 10 && e.key !== 'Backspace' && e.key !== 'Enter') {
            e.preventDefault();
        }
        if (e.key === 'Enter' && value.length < 10) {
            e.preventDefault();
        }

        const sendButton = chatInputContainer.querySelector("button");
        if (sendButton) {
          if (value.length < 10) {
            sendButton.disabled = true; 
          } else {
            sendButton.disabled = false; 
          }
        }
      
    }
  };
  
    inputElement.addEventListener('keydown', handleKeyDown);

    return () => {
        inputElement.removeEventListener('keydown', handleKeyDown);
    };

}, [currentAction]);

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
      disableChatInput();
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
    disableChatInput()
  }

  const thankyouAction = () => {
    const message = createChatBotMessage('Thankyou for booking !')
    updateState(message);
    disableChatInput()
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
