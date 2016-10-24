import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import preloader from 'preloader';

var loader = preloader({
  xhrImages: false,
  loadFullAudio: true,
});
loader.add(`${process.env.PUBLIC_URL}/scary.jpg`);
loader.add(`${process.env.PUBLIC_URL}/scream.mp3`);
loader.load();

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
