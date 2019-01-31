import React, { Component } from 'react';
import {Table} from 'react-bootstrap';
import {rebase} from '../index';
import TaskAdd from './taskAdd';
import TaskEdit from './taskEdit';

export default class TaskListColumns extends Component{
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
      <div className="row flex container container-padding center-ver">
        <div className="col-6">
          <Table striped condensed hover>
            <thead>
              <tr>
                <th>Task name</th>
                <th>Task status</th>
                <th>Task project</th>
              </tr>
            </thead>
            <tbody>
              <tr className="clickable" onClick={()=>this.props.history.push('/helpdesk/filter/'+this.props.match.params.filterID+'/add')}>
                <td>+ Add task</td>
              </tr>
              {tasks.map((task)=>
                <tr key={task.id} className="clickable" onClick={()=>this.props.history.push('/helpdesk/filter/'+this.props.match.params.filterID+'/'+task.id)}>
                  <td>{task.title}</td>
                  <td>{task.status?task.status.title:'Neznámy status'}</td>
                  <td>{task.project?task.project.title:'Neznámy projekt'}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
          <div className="col-6 withSeparator">
            {
              this.props.match.params.taskID && this.props.match.params.taskID==='add' && <TaskAdd />
            }
            {
              this.props.match.params.taskID && this.props.match.params.taskID!=='add' && this.state.tasks.some((item)=>item.id===this.props.match.params.taskID) &&
              <TaskEdit match={this.props.match} columns={true} />
            }
          </div>

        </div>
      );
    }
  }
