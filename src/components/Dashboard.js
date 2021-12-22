import React, { Component } from "react";
// import ReactDOM from 'react-dom'
// import "src/components/Dashboard.js"
import classnames from "classnames";
import Loading from "./Loading";
import Panel from "./Panel";
import axios from "axios";
import {
  getTotalInterviews,
  getLeastPopularTimeSlot,
  getMostPopularDay,
  getInterviewsPerDay
  } from "../helpers/selectors";
import { setInterview } from "../helpers/reducers";


// const data = [
//   {
//     id: 1,
//     label: "Total Interviews",
//     value: 6
//   },
//   {
//     id: 2,
//     label: "Least Popular Time Slot",
//     value: "1pm"
//   },
//   {
//     id: 3,
//     label: "Most Popular Day",
//     value: "Wednesday"
//   },
//   {
//     id: 4,
//     label: "Interviews Per Day",
//     value: "2.3"
//   }
// ];

const data = [
  {
    id: 1,
    label: "Total Interviews",
    getValue: getTotalInterviews
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    getValue: getLeastPopularTimeSlot
  },
  {
    id: 3,
    label: "Most Popular Day",
    getValue: getMostPopularDay
  },
  {
    id: 4,
    label: "Interviews Per Day",
    getValue: getInterviewsPerDay
  }
];

class Dashboard extends Component {
  state = { 
    loading: true, 
    focused: null,
    days: [],
    appointments: {},
    interviews: {}
  };
  
  constructor(props) {
    super(props);
    localStorage.setItem("loading", JSON.stringify(this.state.loading));
    this.selectPanel = this.selectPanel.bind(this);
  }

  
  componentDidMount() {
  
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(([days, appointments, interviewers]) => {
      this.setState({
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data,
        loading: false
      });
    });
        
    this.socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    this.socket.onmessage = event => {
      const data = JSON.parse(event.data);

      if (typeof data === "object" && data.type === "SET_INTERVIEW") {
        this.setState(previousState =>
          setInterview(previousState, data.id, data.interview)
        );
      }
    };


    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) {
      this.setState({ focused });
    }
  
  } 
  
  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }
  
  componentWillUnmount(){
    this.socket.close()
  }
  
  selectPanel = id => {
    this.setState((previousState) => ({
      focused: previousState.focused !== null ? null : id
    }));
  }
  
  render() {
  
  const dashboardClasses = classnames("dashboard", {
    "dashboard--focused": this.state.focused
  });
  
  const panels = data
    .filter(
      panel => this.state.focused === null || this.state.focused === panel.id
    )
    .map(panel => (
      // <Panel
      //   key={panel.id}
      //   id={panel.id}
      //   label={panel.label}
      //   value={panel.value}
      //   onSelect={() => {this.selectPanel(panel.id)}}
      // />
      <Panel
 key={panel.id}
 label={panel.label}
 value={panel.getValue(this.state)}
 onSelect={() => this.selectPanel(panel.id)}
/>

    ));

    if (this.state.loading) {
      return <Loading />
    }

    return (
    <>  
      <main className={dashboardClasses}>
        {panels}
      </main>
    </>
    ) 
  }
}

export default Dashboard;