import React, {Component} from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import {rebase} from './index';

export default class StatusAdd extends Component {

  constructor(props){
    super(props);
    this.state = {
      title:''
    }
    this.submit.bind(this);
    rebase.get('projects/'+this.props.id, {
      context: this,
    }).then((project)=>this.setState({title:project.title}));
  }

  submit(){
    let data={
      title:this.state.title
    }
    rebase.updateDoc('/projects/'+this.props.id, data).then(()=>
      this.props.closeModal()
    );
  }

  render() {
    return (
      <div>
        <FormGroup bsSize="large" controlId="inputName">
          <label>Project name</label>
          <FormControl type="text"
            onChange={e => {
              this.setState({ title: e.target.value });
            }}
            value={this.state.title}/>
        </FormGroup>
        <Button onClick={this.submit.bind(this)} bsStyle="success">Save</Button>
      </div>
    );
  }
}
