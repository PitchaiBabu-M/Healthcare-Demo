import React from 'react';

const MessageParser = ({ children, actions }) => {

  const { checker } = children.props.state;

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
      // Update the state correctly using the setState function
      children.props.setState(prevState => ({
        ...prevState,
        userData: {
          ...prevState.userData,
          username: message
        }
      }));
    }
    if (checker === "number") {
      actions.numberaction();
      // Update the state correctly using the setState function
      children.props.setState(prevState => ({
        ...prevState,
        userData: {
          ...prevState.userData,
          age: message
        }
      }));
    }
    if (checker === "final") {
      actions.finalaction(
        children.props.state.userData.username,
        children.props.state.userData.doctorname,
        children.props.state.userData.selectedDate,
        children.props.state.userData.selectedTime
      );
      // Update the state correctly using the setState function
      children.props.setState(prevState => ({
        ...prevState,
        userData: {
          ...prevState.userData,
          mobileno: message
        }
      }));
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
