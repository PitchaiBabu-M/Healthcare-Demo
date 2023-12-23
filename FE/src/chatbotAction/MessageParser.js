import React from 'react';

const MessageParser = ({ children, actions }) => {

  const {checker} = children.props.state;
  const parse = (message) => {
    
    if (checker === "doctor") {
      actions.yesAction();
    }
    if (checker === "date") {
      actions.appointment();
    }
    if (checker === "time") {
      actions.timeaction();
    }
    if (checker === "name") {
      actions.nameaction();
    }
    if (checker === "age") {
      actions.ageaction();
      children.props.state.userData.username = message
      console.log ("message", message)
    }
    if (checker === "number") {
      actions.numberaction();
      children.props.state.userData.age = message
    }
    if (checker === "final") {
      actions.finalaction(
        children.props.state.userData.username,
        children.props.state.userData.doctorname,
        children.props.state.userData.selectedDate,
        children.props.state.userData.selectedTime
      );
      children.props.state.userData.mobileno = message
    }

  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions,
        });
      })}
    </div>
  );
};

export default MessageParser;