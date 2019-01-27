import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel } from 'react-bootstrap';
import {rebase} from '../index';

export default class CompanyAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      companyName:'',
      saving:false
    }
  }

  render(){
    return (
      <div className="container-padding">
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">Company name</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl type="text" placeholder="Enter company name" value={this.state.companyName} onChange={(e)=>this.setState({companyName:e.target.value})} />
          </Col>
        </FormGroup>
        <Button bsStyle="primary" className="separate" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.addToCollection('/companies', {title:this.state.companyName})
              .then(()=>{this.setState({companyName:'',saving:false})});
          }}>{this.state.saving?'Adding...':'Add company'}</Button>
      </div>
    );
  }
}
