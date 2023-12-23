import React from 'react';

const CloseButton = ({ closeChatbot }) => (
  <button onClick={closeChatbot} style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
    Close
  </button>
);

export default CloseButton;
