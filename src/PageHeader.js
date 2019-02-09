import React, { Component } from 'react';
import { Navbar, Nav,DropdownButton,MenuItem, Glyphicon, Dropdown, Button } from 'react-bootstrap';
import {connect} from 'react-redux';
import {loginUser} from './redux/actions';
class PageHeader extends Component{

  constructor(props){
    super(props);
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
              <MenuItem onClick={()=>this.props.history.push(this.getLocation()+'/settings/units')}>Units</MenuItem>
              <MenuItem onClick={()=>this.props.history.push(this.getLocation()+'/settings/companies')}>Companies</MenuItem>
              <MenuItem onClick={()=>this.props.history.push(this.getLocation()+'/settings/workTypes')}>Work Type</MenuItem>
              <MenuItem onClick={()=>this.props.history.push(this.getLocation()+'/settings/users')}>Users</MenuItem>
              <MenuItem onClick={()=>this.props.history.push(this.getLocation()+'/settings/pricelists')}>Prices</MenuItem>
              <MenuItem onClick={()=>this.props.history.push(this.getLocation()+'/settings/suppliers')}>Supplier</MenuItem>
            </Dropdown.Menu>
          </Dropdown>
          <Button className="no-border"><Glyphicon glyph="log-out" className="center-hor" onClick={()=>this.props.loginUser('','',false)} /></Button>
        </Nav>
      </header>
    )
  }
}


const mapStateToProps = ({ loginReducer }) => {
  const { isAuthenticated } = loginReducer;
  return { isAuthenticated };
};

export default connect(mapStateToProps, { loginUser })(PageHeader);
