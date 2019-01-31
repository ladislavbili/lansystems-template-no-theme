import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel, Alert } from 'react-bootstrap';
import Select from 'react-select';
import {rebase} from '../index';
import {toSelArr} from '../helperFunctions';

export default class CompanyEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      pricelists:[],
      pricelist:null,
      companyName:'',
      loading:true,
      saving:false
    }
    this.fetchData.bind(this);
    this.setData.bind(this);
    this.fetchData(this.props.match.params.id);
  }

  fetchData(id){
    rebase.get('companies/'+id, {
      context: this,
    }).then((company)=>{
      rebase.get('pricelists', {
        context: this,
        withIds:true,
      }).then((pricelists)=>this.setData(company,toSelArr(pricelists)));
    });
  }

  setData(company,pricelists){
    console.log(pricelists);
    let pricelist=pricelists.find((item)=>item.id===company.pricelist);
    if(pricelist===undefined && pricelists.length>0){
      pricelist=pricelists[0];
    }
    this.setState({companyName:company.title,pricelists,pricelist,loading:false})
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      this.fetchData(props.match.params.id);
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
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">Pricelist</ControlLabel>
          </Col>
          <Col sm={9}>
            <Select
              className="supressDefaultSelectStyle"
              options={this.state.pricelists}
              value={this.state.pricelist}
              onChange={e =>{ this.setState({ pricelist: e }); }}
                />
          </Col>
        </FormGroup>
        <Button bsStyle="success" className="separate" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.updateDoc('/companies/'+this.props.match.params.id, {title:this.state.companyName,pricelist:this.state.pricelist.id})
              .then(()=>{this.setState({saving:false})});
          }}>{this.state.saving?'Saving company...':'Save company'}</Button>
      </div>
    );
  }
}
