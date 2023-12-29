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
