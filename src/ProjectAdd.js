import React, {Component} from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import {rebase} from './index';

export default class ArticleEdit extends Component {

  constructor(props){
    super(props);
    this.state = {
      title:''
    }
    this.submit.bind(this);
  }


  submit(){
    let data={
      title:this.state.title
    }
    rebase.addToCollection('/projects', data).then(()=>
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

          <Button onClick={this.submit.bind(this)} bsStyle="primary">Add</Button>
      </div>
    );
}}
