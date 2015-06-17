
var Timer = React.createClass({
  getInitialState: function() {
    return {
        secondsElapsed: 0,
        isPaused: true,
        targetSeconds: 0,
        progressPercent: 0,
        progressColor: "#FFFFFF"
    };
  },
  tick: function() {
      this.setState({secondsElapsed: this.state.secondsElapsed + 1}, function() {
          this.updateProgress();
      });
  },
  updateProgress: function() {
    //console.log('Elapsed: ' + this.state.secondsElapsed + ' Target: ' + this.state.targetSeconds);
    var progressPercent = 0;
    if(this.state.targetSeconds > 0) {
        progressPercent = (this.state.secondsElapsed/this.state.targetSeconds);
    }
    if(progressPercent > 1) progressPercent = 1;
    
    
    var progressColor;
    
    if(progressPercent < 1) {
        var r = 100;
        var g = 100;
        var b = 100;
        if(progressPercent > .75) {
            var percentLeft = (1-progressPercent) / .25;
            var r = Math.floor(100 + 155*(1-percentLeft));
            var g = Math.floor(100*percentLeft);
            var b = Math.floor(100*percentLeft);
        }
        progressColor = 'rgb(' + r + ',' + g + ',' + b + ')';
    } else {
        if(this.state.secondsElapsed % 2 == 0) {
            progressColor = "#000000";
        } else {
            progressColor = "#FF0000";
        }
    }
    
    
    this.setState({
        progressPercent: progressPercent * 100,
        progressColor: progressColor
    });
  },
  componentDidMount: function() {
    //this.start();
  },
  componentWillUnmount: function() {
    this.stop();
  },
  start: function() {
    this.interval = setInterval(this.tick, 1000);
    this.setState({ isPaused: false }, function() {
        this.updateProgress();
    });
  },
  stop: function() {
    clearInterval(this.interval);  
    var me = this;
    this.setState({ 
        isPaused: true,
        secondsElapsed: 0, 
        targetSeconds: 0},
        function() {
            me.updateProgress();
        });
  },
  toggle: function() {
    if(this.state.isPaused) {
        this.start();
    } else {
        this.stop();   
    }
  },
  addMinutes: function(minutes) {
      this.setState({ targetSeconds: this.state.targetSeconds + (minutes * 60)});
      if(this.state.isPaused) this.start();
  },
  formatSeconds: function(seconds) {
      var sign = seconds < 0 ? '-' : '';
      // remove sign
      if(seconds < 0)
        seconds = seconds * -1;
    return sign + Math.floor(seconds/60) + ':' + ('0' + seconds%60).slice(-2);
  },
  render: function() {
    var style = {
        backgroundColor: this.state.isPaused ? "#0000AA" : "#00AA00"
    };
    var progressStyle = {
        position: 'Absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: this.state.progressPercent + '%',
        backgroundColor: this.state.progressColor
    };
    return (
      <div className="ktimer" style={style}>
        <div className="progress" style={progressStyle}></div>
        <div className="targetTime">
            { this.formatSeconds(this.state.targetSeconds) }
        </div>
        <div className="elapsedTime">
            { this.formatSeconds(this.state.targetSeconds - this.state.secondsElapsed) }
        </div>
        <div className="pauseButton" onClick={this.stop}>
            Reset
        </div>
        <div className="timeButtons">
            <div className="timeButton" onClick={this.addMinutes.bind(this, 0.5)}>0:30</div>
            <div className="timeButton" onClick={this.addMinutes.bind(this, 1)}>1:00</div>
            <div className="timeButton" onClick={this.addMinutes.bind(this, 5)}>5:00</div>
            <div className="timeButton" onClick={this.addMinutes.bind(this, 10)}>10:00</div>
        </div>
      </div>
    );
  }
});

