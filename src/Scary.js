import React from 'react';

class Scary extends React.Component {
  componentDidMount() {
  }
  render() {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        background: `url(${process.env.PUBLIC_URL}/scary.jpg) no-repeat center center fixed`,
        backgroundSize: 'cover'
      }}>
        <audio src={`${process.env.PUBLIC_URL}/scream.mp3`} autoPlay /> 
      </div>
    );
  }
}

export default Scary;
