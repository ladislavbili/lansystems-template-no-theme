import React, { Component } from 'react';
import { Navbar, Nav,DropdownButton,MenuItem, Glyphicon, Dropdown, Button } from 'react-bootstrap';

export default class PageHeader extends Component{

  constructor(){
    super();
    this.state = {
      companies : []
    }
    this.getLocation.bind(this);
  }

  getLocation(){
    let url = this.props.history.location.pathname;
    if(url.includes('cmdb')){
      return '/cmdb';
    }else if(url.includes('helpdesk')){
      return '/helpdesk';
    }else{
      return '/lanwiki';
    }
  }

  render(){
    return(
      <header className="header">
        <Navbar.Brand>
          <DropdownButton
            id="pageSelector"
            bsStyle="default"
            title="Lan Systems"
            noCaret
            className="headerDropdown"
            >
            <MenuItem onClick={()=>this.props.history.push('/cmdb')}>CMDB</MenuItem>
            <MenuItem onClick={()=>this.props.history.push('/helpdesk')}>Helpdesk</MenuItem>
          </DropdownButton>
        </Navbar.Brand>
        <Nav pullRight>
          <Dropdown pullRight id="settings">
            <Dropdown.Toggle noCaret className="headerDropdown">
              <Glyphicon glyph="cog" className="center-hor" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <MenuItem onClick={()=>this.props.history.push(this.getLocation()+'/settings/projects')}>Projects</MenuItem>
              <MenuItem onClick={()=>this.props.history.push(this.getLocation()+'/settings/statuses')}>Statuses</MenuItem>
            </Dropdown.Menu>
          </Dropdown>
          <Button className="no-border"><Glyphicon glyph="log-out" className="center-hor" /></Button>
        </Nav>
      </header>
    )
  }
}
