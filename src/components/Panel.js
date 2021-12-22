import React, { Component } from "react";
// import ReactDOM from 'react-dom'
// import "./Dashboard.js"
// import "src/components/Dashboard.js"


export default class Panel extends Component {

 render() {
  // const { label, value, onSelect } = this.props;
  const { label, value, onSelect } = this.props;

  return (
  //  <section className="dashboard__panel" onClick={onSelect}>
  <section className="dashboard__panel" onClick={onSelect}>
    <h1 className="dashboard__panel-header">{label}</h1>
    <p className="dashboard__panel-value">{value}</p>
   </section>
  );
 }
}

