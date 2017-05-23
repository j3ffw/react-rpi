import React from 'react';
import {render} from 'react-dom';
import { Col } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Container } from 'react-bootstrap';

  class Weather extends React.Component {
    constructor(props) {
        super(props);
        this.state = {icon: "http://openweathermap.org/img/w/50d.png", temp: "62F"};
    }

    requestFinished(data) {
      console.log(data);
      var temp = Math.round(data["main"]["temp"] * (9.0 / 5.0) - 459.67);
      var weatherId = data["weather"][0]["icon"];
      var weatherUrl = "http://openweathermap.org/img/w/" + weatherId + ".png";
      this.setState({icon: weatherUrl, temp: temp + "F"});
    }

    getWeather() {
      var url = "http://api.openweathermap.org/data/2.5/weather?zip=95112,US&APPID=fa339d5368f64a83521ba9fbe5977a4b";
      var args = { method: 'GET',
         mode: 'cors',
         cache: 'default' };

      fetch(url, args).then( (resp) => resp.json()).then( (json) => this.requestFinished(json));
    }

    render() {
       return <div className="panel">
                <div className="panel-heading">
                  <h6 className="panel-title">San Jose Weather</h6>
                </div>
                <div className="panel-body">
                  <Row>
                    <Col xs={4}><img src={this.state.icon} /></Col>
                    <Col xs={4}>Temp:{this.state.temp}</Col>
                  </Row>
                  </div>
              </div>;
    }

    tick() {
      this.getWeather();
    }

    componentDidMount() {
        this.timerID = setInterval(
          () => this.tick(),
          60000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }


  };


class TravelTime extends React.Component {
  constructor(props) {
      super(props);
      this.state = {duration: "Initializing", route: "via initializing"};
      this.directionsService = new google.maps.DirectionsService();
      this.getRoute();
    }

    tick() {
      this.getRoute()
    }

    requestFinished(result, status) {
      var txt = result.routes[0].legs[0].duration.text
      var summary = result.routes[0].summary

      this.setState({duration: txt, route: summary})
    }

    getRoute() {
        var end = "350 East Taylor St San Jose"
        var start = "1000 W Maude Avenue, Sunnyvale"
        var request = {
        origin: start,
        destination: end,
        travelMode: 'DRIVING',
        drivingOptions: { departureTime: new Date() }
      };

    this.directionsService.route(request, (result, status) => this.requestFinished(result, status));
    }


  componentDidMount() {
      this.timerID = setInterval(
        () => this.tick(),
        60000
      );
  }

  componentWillUnmount() {
      clearInterval(this.timerID);
  }


  render () {
    return   <div className="panel">
                <div className="panel-heading">
                  <h6 className="panel-title">Time to Home</h6>
                </div>
                <div className="panel-body">
                  <Row>
                    <Col xs={8}>{this.state.duration} via {this.state.route}</Col>
                  </Row>
                  </div>
              </div>;

    return <Row></Row>
  }
};

class Clock extends React.Component {
 constructor(props) {
      super(props);
      this.state = {timeStr: "12:12", dateStr: "Smarch 32"};
  }

  updateState() {
      var dateOptions = { weekday: "short", day: "numeric", year:"numeric" };
      var dateFormat = new Intl.DateTimeFormat('en-US', dateOptions).format;

      var timeOptions = { hour12: true, hour : "numeric", minute: "2-digit", second: "2-digit" };
      var timeFormat = new Intl.DateTimeFormat('en-US', timeOptions).format;


      var date = new Date()
      var timeString = timeFormat(date)
      var dateString = dateFormat(date)

      this.setState({timeStr: timeString, dateStr: dateString})
  }

  render() {

    return <div className="container-fluid">
              <div className="row">
                <div className="col-xs-4">
                  <h1>{this.state.timeStr}</h1>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-8">
                  <h4>{this.state.dateStr}</h4>
                </div>
              </div>
            </div>;
   } 


  componentDidMount() {
    this.updateState()

    this.timerID = setInterval(
      () => this.updateState(),
      100
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }


}

class App extends React.Component {
  render () {
    return <div className="container-fluid" style={{maxWidth: 800 + 'px'}}>
              <div className="row">
                <div className="col-xs-4">
                  <Clock />
                </div>
                <div className="col-xs-4">
                  <TravelTime /><Weather />
                </div>
              </div>
            </div>;
  }
};

render(<App/>, document.getElementById('app'));
