import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import {rebase} from './index';

export default class TaskAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      statuses:[],
      projects:[],
      saving:false,
      status:null,
      project:null,
      title:'',
      description:''
    }
  }
    componentWillMount(){
      this.ref2 = rebase.listenToCollection('/statuses', {
        context: this,
        withIds: true,
        then:content=>{this.setState({statuses:content,status:this.state.status===null && content.length!==0?{...content[0],value:content[0].id,label:content[0].title}:this.state.status })},
      });
      this.ref3 = rebase.listenToCollection('/projects', {
        context: this,
        withIds: true,
        then:content=>{this.setState({projects:content,project:this.state.project===null && content.length!==0?{...content[0],value:content[0].id,label:content[0].title}:this.state.project })},
      });
    }

    componentWillUnmount(){
      rebase.removeBinding(this.ref2);
      rebase.removeBinding(this.ref3);
    }

  render(){
    return (
      <div className="container container-padding">
        <FormGroup>
          <Col sm={2}>
            <ControlLabel className="center-hor">Task name</ControlLabel>
          </Col>
          <Col sm={10}>
            <FormControl type="text" placeholder="Enter task name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={2}>
            <ControlLabel className="center-hor">Task status</ControlLabel>
          </Col>
          <Col sm={10}>
            <Select
              value={this.state.status}
              onChange={(status)=>this.setState({status})}
              options={this.state.statuses.map((status)=>{return {...status,value:status.id,label:status.title}})}
              />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col sm={2}>
            <ControlLabel className="center-hor">Task project</ControlLabel>
          </Col>
          <Col sm={10}>
            <Select
              value={this.state.project}
              onChange={(project)=>this.setState({project})}
              options={this.state.projects.map((project)=>{return {...project,value:project.id,label:project.title}})}
              />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={2}>
            <ControlLabel className="center-hor">Description</ControlLabel>
          </Col>
          <Col sm={10}>
            <FormControl componentClass="textarea" placeholder="Enter task description" value={this.state.description} onChange={(e)=>this.setState({description:e.target.value})} />
          </Col>
        </FormGroup>


        <Button bsStyle="primary" className="separate" disabled={this.state.title==="" || this.state.status===null || this.state.project === null||this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.addToCollection('/tasks', {title:this.state.title,project: this.state.project.id, status: this.state.status.id,description:this.state.description})
              .then(()=>{this.props.history.goBack()});
          }}>{this.state.saving?'Adding...':'Add task'}</Button>
      </div>
    );
  }
}
