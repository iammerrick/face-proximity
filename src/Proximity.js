/* global ccv, cascade */
import React from 'react';
import Scary from './Scary';
import mediaDevices from './getUserMedia';
Number.isInteger = Number.isInteger || function(value) {
  return typeof value === "number" && 
    isFinite(value) && 
    Math.floor(value) === value;
};
const SCARE_EM_GOOD = 6; // 6 inches closer

var percentages = [];

function rollingAverage(size) {
  percentages.splice(0, percentages.length - size);
  var sum = percentages.reduce(function(total, num) {
    return total + num
  }, 0);
  return sum / percentages.length;
}

function percentageToInches(p) {
  return 49 * Math.exp(-0.023 * p);
}


class Proximity extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      scary: false,
    };
  }
  componentDidMount() {
    const viewport = this.viewport;
    const canvas = this.canvas;
    const context = canvas.getContext('2d');
    const glasses = new Image();
    glasses.src = `${process.env.PUBLIC_URL}/glasses.png`;

    mediaDevices.getUserMedia({
      audio: false,
      video: true,
    })
      .then((stream) => {
        viewport.src = URL.createObjectURL(stream);
        viewport.play();
        setInterval(() => {
          context.drawImage(viewport, 0, 0, canvas.width, canvas.height);
          const faces = ccv.detect_objects({
            canvas: ccv.pre(canvas), 
            cascade: cascade, 
            interval: 2, 
            min_neighbors: 1
          });

          faces.forEach(function(face) {
            var percentage = 100 * face.height / canvas.height;
            percentages.push(percentage);
            context.drawImage(glasses, face.x, face.y, face.width, face.height);
          });
          const inches = Math.round(percentageToInches(rollingAverage(5)));
          if (!Number.isInteger(inches)) return null;

          this.start = Math.max(this.start || 0, inches);

          if (this.start && ((this.start - inches) >= SCARE_EM_GOOD)) {
            this.setState({
              scary: true,
            });
          }

          this.setState({
            inches,
          });

        }, 200);

        return stream; 
      })
      .catch(function(error) {
        console.error(error);
      });

  }
  render() {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
      }}>
        <div style={{
          margin: 'auto',
        }}>
          <canvas 
            ref={((canvas) => this.canvas = canvas)} 
            width={532} 
            height={400} 
            style={{
              width: 532,
              height: 400,
            }}
          />
          <div style={{
            textAlign: 'center',
          }}>Try turning on your sound &amp; getting closer for more effects!</div>
        </div>
        <video 
          style={{display: 'none'}}
          ref={((viewport) => this.viewport = viewport)}/>         
        {this.state.scary && this.state.inches
          ? <Scary />
          : null
        }
      </div>
    );
  }
}

export default Proximity;
