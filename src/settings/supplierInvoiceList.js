import React, { Component } from 'react';
import { Table, FormGroup, FormControl,InputGroup, Glyphicon } from 'react-bootstrap';
import {rebase} from '../index';
import {timestampToString} from '../helperFunctions';
import SupplierInvoiceAdd from './supplierInvoiceAdd';
import SupplierInvoiceEdit from './supplierInvoiceEdit';

export default class SupplierInvoicesList extends Component{
  constructor(props){
    super(props);
    this.state={
      supplierInvoices:[],
      suppliers:[],
      supplierInvoiceFilter:''
    }
  }
  componentWillMount(){
    this.ref = rebase.listenToCollection('/supplierInvoices', {
      context: this,
      withIds: true,
      then:content=>{this.setState({supplierInvoices:content})},
    });
    this.ref2 = rebase.listenToCollection('/suppliers', {
      context: this,
      withIds: true,
      then:content=>{this.setState({suppliers:content})},
    });
  }

  componentWillUnmount(){
    rebase.removeBinding(this.ref);
    rebase.removeBinding(this.ref2);
  }

  render(){
    return (
      <div className="row flex container container-padding center-ver">
        <div className="col-6">
          <FormGroup>
            <InputGroup>
              <FormControl type="text" onChange={(e)=>this.setState({supplierInvoiceFilter:e.target.value})} />
              <InputGroup.Addon>
                <Glyphicon glyph="search" />
              </InputGroup.Addon>
            </InputGroup>
          </FormGroup>
          <Table striped condensed hover>
            <thead>
              <tr className="clickable">
                <th>Invoice identifier</th>
                <th>Supplier</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/supplierInvoices/add')}>
                <td colSpan="3">+ Add invoice</td>
              </tr>
              {this.state.supplierInvoices.filter((item)=>item.identifier.toString().toLowerCase().includes(this.state.supplierInvoiceFilter.toLowerCase())).map((supplierInvoice)=>
                <tr key={supplierInvoice.id} className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/supplierInvoices/'+supplierInvoice.id)}>
                  <td>{supplierInvoice.identifier}</td>
                  <td>{this.state.suppliers.some((supplier)=>supplier.id===supplierInvoice.supplier)?this.state.suppliers.find((supplier)=>supplier.id===supplierInvoice.supplier).title:'Unknown supplier'}</td>
                  <td>{timestampToString(supplierInvoice.date)}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <div className="col-6 withSeparator">
          {
            this.props.match.params.id && this.props.match.params.id==='add' && <SupplierInvoiceAdd />
          }
          {
            this.props.match.params.id && this.props.match.params.id!=='add' && this.state.supplierInvoices.some((item)=>item.id===this.props.match.params.id) && <SupplierInvoiceEdit match={this.props.match} />
          }
        </div>
      </div>
    );
  }
}
