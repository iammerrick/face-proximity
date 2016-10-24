/* global ccv, cascade */
import React from 'react';
import Scary from './Scary';
import mediaDevices from './getUserMedia';

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
      runs: 0,
      scary: false,
    };
  }
  componentDidMount() {
    const viewport = this.viewport;
    const canvas = this.canvas;
    const context = canvas.getContext('2d');

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
          });
          const inches = percentageToInches(rollingAverage(5)).toFixed(0);
          if (inches && this.state.runs > 10 && !this.start) {
            this.start = inches;
          }

          if (this.start && ((this.start - inches) >= 3)) {
            this.setState({
              scary: true,
            });
          }

          this.setState({
            inches,
            runs: this.state.runs + 1,
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
      <div>
        <canvas 
          style={{ display: 'none' }}
          ref={((canvas) => this.canvas = canvas)} 
          width={266} 
          height={200} 
        />
        <video 
          style={{display: 'none'}}
          ref={((viewport) => this.viewport = viewport)}/>         
        {this.state.scary && this.state.inches
          ? <Scary />
          : (
            <div style={{
              textAlign: 'center',
              font: '16px Helvetica',
              padding: 40,
            }}>I think you are {this.state.inches} inches away.</div>
          )
        }
      </div>
    );
  }
}

export default Proximity;
