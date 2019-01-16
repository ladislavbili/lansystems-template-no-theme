import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import {rebase} from './index';

export default class TaskEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      statuses:[],
      projects:[],
      saving:false,
      description:'',
      status:null,
      project:null,
      title:'',
      description:'',
      task:null
    }
    rebase.get('tasks/'+this.props.match.params.taskID, {
      context: this,
      withIds: true,
    }).then((task)=>{rebase.get('/statuses', {
      context: this,
      withIds: true,

    }).then((statuses)=>{rebase.get('/projects', {
      context: this,
      withIds: true,
    }).then((projects)=>{
      let project = projects.find((item)=>item.id===task.project);
      let status = statuses.find((item)=>item.id===task.status);
      this.setState({
        task,
        statuses,
        projects,
        description:task.description,
        title:task.title,
        status:status?{...status,value:status.id,label:status.title}:null,
        project:project?{...project,value:project.id,label:project.title}:null});
    })})});
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

        <Button bsStyle="success" className="separate" disabled={this.state.title==="" || this.state.status===null || this.state.project === null||this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.updateDoc('/tasks/'+this.state.task.id, {title:this.state.title,project: this.state.project.id, status: this.state.status.id, description:this.state.description})
              .then(()=>{this.props.history.goBack()});
          }}>{this.state.saving?'Saving...':'Save task'}</Button>
      </div>
    );
  }
}
