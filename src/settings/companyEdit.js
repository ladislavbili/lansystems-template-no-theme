import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel, Alert } from 'react-bootstrap';
import {rebase} from '../index';

export default class CompanyEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      companyName:'',
      loading:true,
      saving:false
    }
    this.setData.bind(this);
    rebase.get('companies/'+this.props.match.params.id, {
      context: this,
    }).then((company)=>this.setData(company));
  }

  setData(data){
    this.setState({companyName:data.title,loading:false})
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      rebase.get('companies/'+props.match.params.id, {
        context: this,
      }).then((company)=>this.setData(company));
    }
  }

  render(){
    return (
      <div className="container-padding">
        {
          this.state.loading &&
          <Alert bsStyle="success">
            Loading data...
          </Alert>
        }
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">Company name</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl type="text" placeholder="Enter company name" value={this.state.companyName} onChange={(e)=>this.setState({companyName:e.target.value})} />
          </Col>
        </FormGroup>
        <Button bsStyle="success" className="separate" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.updateDoc('/companies/'+this.props.match.params.id, {title:this.state.companyName})
              .then(()=>{this.setState({saving:false})});
          }}>{this.state.saving?'Saving company...':'Save company'}</Button>
      </div>
    );
  }
}
