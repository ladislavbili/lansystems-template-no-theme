import React, { Component } from 'react';
import { Navbar, Nav,DropdownButton,MenuItem, Glyphicon, Dropdown } from 'react-bootstrap';

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
            <MenuItem onClick={()=>this.props.history.push('/lanwiki')}>LanWiki</MenuItem>
            <MenuItem onClick={()=>this.props.history.push('/helpdesk')}>Helpdesk</MenuItem>
          </DropdownButton>
        </Navbar.Brand>
        <Nav pullRight>
          <Dropdown pullRight id="settings">
            <Dropdown.Toggle noCaret className="headerDropdown">
              <Glyphicon glyph="log-out" className="center-hor" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <MenuItem onClick={()=>this.props.history.push(this.getLocation()+'/settings/companies')}>Companies</MenuItem>
              <MenuItem onClick={()=>this.props.history.push(this.getLocation()+'/settings/users')}>Users</MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </header>
    )
  }
}
