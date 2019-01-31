import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel, Alert } from 'react-bootstrap';
import {rebase} from '../index';

export default class PriceEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      pricelistName:'',
      afterHours:0,
      margin:0,
      loading:true,
      saving:false,
      workTypes:[],
    }
    this.setData.bind(this);
    this.loadData.bind(this);
    this.loadData();
  }

  loadData(){
    rebase.get('/prices', {
      context: this,
      withIds: true,
    }).then((prices)=>{rebase.get('/workTypes', {
      context: this,
      withIds: true,
    }).then((workTypes)=>{
      this.setData(prices,workTypes);
    })});

  }

  setData(prices,workTypes){
    let types= workTypes.map((type)=>{
      let newType={...type};
      newType.price={price:0};
      return newType;
    });

    this.setState({
      workTypes:types,
      loading:false
    });
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
            <ControlLabel className="center-hor">Pricelist name</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl type="text" placeholder="Enter pricelist name" value={this.state.pricelistName} onChange={(e)=>this.setState({pricelistName:e.target.value})} />
          </Col>
        </FormGroup>
        <div className="floatingSeparator"></div>
        {
          this.state.workTypes.map((item,index)=>
          <FormGroup>
            <Col sm={3}>
              <ControlLabel className="center-hor">{item.title}</ControlLabel>
            </Col>
            <Col sm={9}>
              <FormControl type="number" placeholder="Enter pricelist name" value={item.price.price} onChange={(e)=>{
                  let newWorkTypes=[...this.state.workTypes];
                  let newWorkType = {...newWorkTypes[index]};
                  newWorkType.price.price=e.target.value;
                  newWorkTypes[index] = newWorkType;
                  this.setState({workTypes:newWorkTypes});
                }} />
            </Col>
          </FormGroup>
          )
        }

        <div className="floatingSeparator"></div>
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">After hours percentage</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl type="number" placeholder="Enter after hours percentage" value={this.state.afterHours} onChange={(e)=>this.setState({afterHours:e.target.value})} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">Materials margin percentage</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl type="number" placeholder="Enter materials margin percentage" value={this.state.margin} onChange={(e)=>this.setState({margin:e.target.value})} />
          </Col>
        </FormGroup>
        <Button bsStyle="success" className="separate" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.addToCollection('/pricelists',
            {
              title:this.state.pricelistName,
              afterHours:parseFloat(this.state.afterHours===''?'0':this.state.afterHours),
              materialMargin:parseFloat(this.state.margin===''?'0':this.state.margin)
            })
              .then((listResponse)=>{
                this.state.workTypes.map((workType,index)=>
                  rebase.addToCollection('/prices', {pricelist:listResponse.id,workType:workType.id,price:parseFloat(workType.price.price === "" ? "0": workType.price.price)})
                );
                this.setState({saving:false,
                  pricelistName:'',
                  afterHours:0,
                  margin:0,
                });
                this.loadData();
              });
          }}>{this.state.saving?'Saving prices...':'Save prices'}</Button>
      </div>
    );
  }
}
