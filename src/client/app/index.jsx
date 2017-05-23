import React from 'react';
import {render} from 'react-dom';
import { Col } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Container } from 'react-bootstrap';

  class Weather extends React.Component {
    constructor(props) {
        super(props);
        this.state = {icon: "http://openweathermap.org/img/w/50d.png", temp: "62F"};
       // this.getWeather();
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
       return <Row>
                <Col xs={1}><img src={this.state.icon} /></Col>
                <Col xs={4}>Temp:{this.state.temp}</Col>
              </Row>;
    }
  };


class TravelTime extends React.Component {
  constructor(props) {
      super(props);
      this.state = {duration: "14 min", route: "via 101 S"};
      this.directionsService = new google.maps.DirectionsService();
    //  this.getRoute();
    }

    tick() {
      
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
        5000
      );
  }

  componentWillUnmount() {
      clearInterval(this.timerID);
  }


  render () {
    return <Row><Col xs={4}><span className="glyphicon glyphicon-road" aria-hidden="true"></span>{this.state.duration} via {this.state.route}</Col></Row>
  }
};

class App extends React.Component {
  render () {
    return <div className="container-fluid" style={{maxWidth: 800 + 'px'}}> <TravelTime /><Weather /></div>;
  }
};

render(<App/>, document.getElementById('app'));
