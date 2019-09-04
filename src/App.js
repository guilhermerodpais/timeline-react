import React, { Component } from 'react';
import './App.css';

import icoCalendar from './assets/icons/calendar.svg';
import icoCheck from './assets/icons/check.svg';
import icoClock from './assets/icons/clock.svg';
import icoMoney from './assets/icons/money.svg';
import icoPlace from './assets/icons/place.svg';

class App extends Component {

  state = {
    events: []
  }

  componentDidMount() {
    fetch('https://storage.googleapis.com/dito-questions/events.json')
    .then(res => res.json())
    .then((data) => {
      this.setState({ events: data.events })
      console.log(this.state.events)
    })
    .catch(console.log)
  }

  render() {

    function getData(data) {
      var day = new Date(data).getDate();
      var month = new Date(data).getUTCMonth() + 1;
      var year =  new Date(data).getFullYear(); 
      return (day <= 9 ? '0':'') + day + '/' + (month <= 9 ? '0':'') + month + '/' + year;
    }

    function getTime(data) {
      var hour = new Date(data).getHours();
      var minutes = new Date(data).getMinutes();
      return hour + ':' + minutes;
    }

    function getItem(localValues, val) {
      for (var i = 0; i < localValues.length; ++i) {
          if (localValues[i].key === val) {
              return localValues[i].value;
          }
      }
      return '';
    }

    return (
      <div>
      <nav class="navbar navbar-dark bg-dark">
        <span class="navbar-brand mb-0 h1">Timeline - Compras</span>
      </nav>
      <div className="container">
        <ul className="timeline">
            {
            this.state.events
            .sort((a, b) => getData(b.timestamp).split('/').reverse().join().localeCompare(getData(a.timestamp).split('/').reverse().join()))
            .map((content, index) => content.event === "comprou" && (
            <li key={index} id={index}>
              <div className="timeline-badge"><img src={icoCheck} alt="calendar"/></div>
              <div className="timeline-panel">
                  <div className="timeline-heading">
                    <span className="timeline-item"><img src={icoCalendar} alt="calendar"/>{getData(content.timestamp)}</span>
                    <span className="timeline-item"><img src={icoClock} alt="clock"/>{getTime(content.timestamp)}</span>
                    <span className="timeline-item"><img src={icoPlace} alt="place"/>{getItem(content.custom_data, 'store_name')}</span>
                    <span className="timeline-item"><img src={icoMoney} alt="money"/>{content.revenue.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span>
                  </div>
                  <div className="timeline-body">
                    <table>
                        <thead>
                          <tr>
                              <th>Produto</th>
                              <th>Preço</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                          this.state.events.map((internalContent, internalIndex) => internalContent.event === "comprou-produto" && getItem(internalContent.custom_data, 'transaction_id') === getItem(content.custom_data, 'transaction_id') && (
                          <tr key={internalIndex}>
                              <td>{getItem(internalContent.custom_data, 'product_name')}</td>
                              <td>{getItem(internalContent.custom_data, 'product_price').toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                          </tr>
                          )
                          )
                          }
                        </tbody>
                    </table>
                  </div>
              </div>
            </li>
            )
            )}
        </ul>
      </div>
      </div>
    );
  }
}
export default App;