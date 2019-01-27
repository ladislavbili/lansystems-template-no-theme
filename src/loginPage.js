import React, { Component } from 'react';
import Navigation from './navigation';
import { connect } from "react-redux";
import { FormGroup, FormControl, Button, Col, ControlLabel } from 'react-bootstrap';
import {loginUser} from './redux/actions';

class Login extends Component{
  constructor(props){
    super(props);
    this.state={
      email:'',
      password:''
    }
  }

  render(){
    if(!this.props.isAuthenticated){
      return(
        <div className="loginWindow center-hor center-ver">
        <FormGroup controlId="formHorizontalEmail">
          <Col componentClass={ControlLabel} sm={2}>
            Email
          </Col>
          <Col sm={10}>
            <FormControl type="email" placeholder="Email" value={this.state.email} onChange={(e)=>this.setState({email:e.target.value})} />
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalPassword">
          <Col componentClass={ControlLabel} sm={2}>
            Password
          </Col>
          <Col sm={10}>
            <FormControl type="password" placeholder="Password" value={this.state.password} onChange={(e)=>this.setState({password:e.target.value})}/>
          </Col>
        </FormGroup>
        <Button bsStyle="primary" onClick={()=>this.props.loginUser(this.state.email,this.state.password,true)}>Login</Button>
        </div>
        )
    }
    return(
      <Navigation history={this.props.history}/>
    )
  }
}

const mapStateToProps = ({ loginReducer }) => {
  const { isAuthenticated } = loginReducer;
  return { isAuthenticated };
};

export default connect(mapStateToProps, { loginUser })(Login);
