import React, { Component } from 'react';
import { Table, FormGroup, FormControl,InputGroup, Glyphicon } from 'react-bootstrap';
import {rebase} from '../index';
import SupplierAdd from './supplierAdd';
import SupplierEdit from './supplierEdit';

export default class SuppliersList extends Component{
  constructor(props){
    super(props);
    this.state={
      suppliers:[]
    }
  }
  componentWillMount(){
    this.ref = rebase.listenToCollection('/suppliers', {
      context: this,
      withIds: true,
      then:content=>{this.setState({suppliers:content, supplierFilter:''})},
    });
  }

  componentWillUnmount(){
    rebase.removeBinding(this.ref);
  }

  render(){
    return (
      <div className="row flex container container-padding center-ver">
        <div className="col-6">
          <FormGroup>
            <InputGroup>
              <FormControl type="text" onChange={(e)=>this.setState({supplierFilter:e.target.value})} />
              <InputGroup.Addon>
                <Glyphicon glyph="search" />
              </InputGroup.Addon>
            </InputGroup>
          </FormGroup>
          <Table striped condensed hover>
            <thead>
              <tr className="clickable">
                <th>Supplier name</th>
              </tr>
            </thead>
            <tbody>
              <tr className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/suppliers/add')}>
                <td>+ Add supplier</td>
              </tr>
              {this.state.suppliers.filter((item)=>item.title.toLowerCase().includes(this.state.supplierFilter.toLowerCase())).map((supplier)=>
                <tr key={supplier.id} className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/suppliers/'+supplier.id)}>
                  <td>{supplier.title}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <div className="col-6 withSeparator">
          {
            this.props.match.params.id && this.props.match.params.id==='add' && <SupplierAdd />
          }
          {
            this.props.match.params.id && this.props.match.params.id!=='add' && this.state.suppliers.some((item)=>item.id===this.props.match.params.id) && <SupplierEdit match={this.props.match} />
          }
        </div>
      </div>
    );
  }
}
