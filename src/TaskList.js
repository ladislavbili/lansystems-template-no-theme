import React, { Component } from 'react';
import {Button,FormGroup,Table} from 'react-bootstrap';
import {rebase} from './index';

export default class TaskList extends Component{
  constructor(props){
    super(props);
    this.state={
      tasks:[],
      statuses:[],
      projects:[]
    }
  }
  componentWillMount(){
    this.ref1 = rebase.listenToCollection('/tasks', {
      context: this,
      withIds: true,
      then:content=>{this.setState({tasks:content })},
    });
    this.ref2 = rebase.listenToCollection('/statuses', {
      context: this,
      withIds: true,
      then:content=>{this.setState({statuses:content })},
    });
    this.ref3 = rebase.listenToCollection('/projects', {
      context: this,
      withIds: true,
      then:content=>{this.setState({projects:content })},
    });
  }

  componentWillUnmount(){
    rebase.removeBinding(this.ref1);
    rebase.removeBinding(this.ref2);
    rebase.removeBinding(this.ref3);
  }

  render(){
    let tasks = this.state.tasks.map((task)=>{
      let newTask={...task};
      newTask.status=this.state.statuses.find((status)=>status.id===task.status);
      newTask.project=this.state.projects.find((project)=>project.id===task.project);
      return newTask;
    })
    return (
      <div className="flex container container-padding center-ver">
          <FormGroup>
            <Button onClick={()=>this.props.history.push(this.props.location.pathname+'/add')}>+ Add task</Button>
          </FormGroup>
          <Table striped condensed hover>
            <thead>
              <th>Task name</th>
              <th>Task status</th>
              <th>Task project</th>
            </thead>
            <tbody>
              {tasks.map((task)=>
                <tr key={task.id} className="clickable" onClick={()=>this.props.history.push(this.props.location.pathname+'/task/'+task.id)}>
                  <td>{task.title}</td>
                  <td>{task.status?task.status.title:'Neznámy status'}</td>
                  <td>{task.project?task.project.title:'Neznámy projekt'}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      );
    }
  }
