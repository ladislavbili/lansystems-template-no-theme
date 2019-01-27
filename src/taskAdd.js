import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel, Alert } from 'react-bootstrap';
import Select from 'react-select';
import {rebase} from './index';

export default class TaskEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      saving:false,
      loading:true,
      users:[],
      companies:[],
      workTypes:[],
      statuses:[],
      projects:[],

      title:'',
      company:null,
      workHours:'0',
      workType:null,
      requester:null,
      assigned:null,
      description:'',
      status:null,
      statusChange:null,
      project:null,
      pausal:{value:true,label:'Pausal'},
    }
    this.fetchData();
  }

  submitTask(){
    this.setState({saving:true});
    let body = {
      title: this.state.title,
      company: this.state.company?this.state.company.id:null,
      workHours: this.state.workHours,
      workType: this.state.workType?this.state.workType.id:null,
      requester: this.state.requester?this.state.requester.id:null,
      assigned: this.state.assigned?this.state.assigned.id:null,
      description: this.state.description,
      status: this.state.status?this.state.status.id:null,
      statusChange: this.state.statusChange,
      project: this.state.project?this.state.project.id:null,
      pausal: this.state.pausal.value,
    }
    rebase.addToCollection('/tasks', body)
    .then(()=>{
      this.setState({saving:false,pausal:{value:true,label:'Pausal', description:''}})
      this.fetchData();
    });
  }

  fetchData(){
    rebase.get('/statuses', {
      context: this,
      withIds: true,
    }).then((statuses)=>{rebase.get('/projects', {
      context: this,
      withIds: true,
    }).then((projects)=>{
      rebase.get('/users', {
        context: this,
        withIds: true,
      }).then((users)=>{
        rebase.get('/companies', {
          context: this,
          withIds: true,
        }).then((companies)=>{
          rebase.get('/workTypes', {
            context: this,
            withIds: true,
          }).then((workTypes)=>{
            this.setData(this.toSelArr(statuses), this.toSelArr(projects),this.toSelArr(users,'email'),this.toSelArr(companies),this.toSelArr(workTypes));
          });
        });
      });
    })});
  }

  toSelArr(arr,index = 'title'){
    return arr.map((item)=>{return {...item,value:item.id,label:item[index]}})
  }

  setData(statuses, projects,users,companies,workTypes){
    let status = statuses.find((item)=>item.title==='New');
    if(!status){
      status=null;
    }
    this.setState({
      statuses,
      projects,
      users,
      companies,
      workTypes,
      status,
      statusChange:null,
      project:null,
      company:null,
      workHours:0,
      workType:null,
      requester:null,
      assigned:null,
      loading:false
    });
  }

  render(){
    return (
      <div className="container container-padding">
        {
          this.state.loading &&
          <Alert bsStyle="success">
            Loading data...
          </Alert>
        }
        <Col sm={12}>
          <FormGroup>
            <Col sm={1}>
              <ControlLabel className="center-hor">Task name</ControlLabel>
            </Col>
            <Col sm={11}>
              <FormControl type="text" placeholder="Enter task name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
            </Col>
          </FormGroup>
        </Col>

        <div className="floatingSeparator"></div>
          <div className="taskDataContainer">
        <Col sm={6}>
          <FormGroup>
            <Col sm={2}>
              <ControlLabel className="center-hor">Task status</ControlLabel>
            </Col>
            <Col sm={10}>
              <Select
                value={this.state.status}
                onChange={(status)=>this.setState({status,statusChange:(new Date().getTime())})}
                options={this.state.statuses.map((status)=>{return {...status,value:status.id,label:status.title}})}
                />
            </Col>
          </FormGroup>
        </Col>

        <Col sm={6}>
          <FormGroup>
            <Col sm={2}>
              <ControlLabel className="center-hor">Status change</ControlLabel>
            </Col>
            <Col sm={10}>
              <FormControl type="datetime-local" placeholder="Status change date" value={this.state.statusChange!=null?new Date(this.state.statusChange).toISOString().replace('Z',''):null} />
            </Col>
          </FormGroup>
        </Col>


        <Col sm={6}>
          <FormGroup>
            <Col sm={2}>
              <ControlLabel className="center-hor">Task project</ControlLabel>
            </Col>
            <Col sm={10}>
              <Select
                value={this.state.project}
                onChange={(project)=>this.setState({project})}
                options={this.state.projects}
                />
            </Col>
          </FormGroup>
        </Col>

        <Col sm={6}>
          <FormGroup>
            <Col sm={2}>
              <ControlLabel className="center-hor">Start date</ControlLabel>
            </Col>
            <Col sm={10}>
              <FormControl type="date" />
            </Col>
          </FormGroup>
        </Col>

        <Col sm={6}>
          <FormGroup>
            <Col sm={2}>
              <ControlLabel className="center-hor">Requester</ControlLabel>
            </Col>
            <Col sm={10}>
              <Select
                value={this.state.requester}
                onChange={(requester)=>this.setState({requester})}
                options={this.state.users}
                />
            </Col>
          </FormGroup>
        </Col>

        <Col sm={6}>
          <FormGroup>
            <Col sm={2}>
              <ControlLabel className="center-hor">Deadline</ControlLabel>
            </Col>
            <Col sm={10}>
              <FormControl type="date" />
            </Col>
          </FormGroup>
        </Col>


        <Col sm={6}>
          <FormGroup>
            <Col sm={2}>
              <ControlLabel className="center-hor">Company</ControlLabel>
            </Col>
            <Col sm={10}>
              <Select
                value={this.state.company}
                onChange={(company)=>this.setState({company})}
                options={this.state.companies}
                />
            </Col>
          </FormGroup>
        </Col>

        <Col sm={6}>
          <FormGroup>
            <Col sm={2}>
              <ControlLabel className="center-hor">Repeat</ControlLabel>
            </Col>
            <Col sm={10}>
              <FormControl type="text" />
            </Col>
          </FormGroup>
        </Col>

        <Col sm={6}>
          <FormGroup>
            <Col sm={2}>
              <ControlLabel className="center-hor">Assigned</ControlLabel>
            </Col>
            <Col sm={10}>
              <Select
                value={this.state.assigned}
                onChange={(assigned)=>this.setState({assigned})}
                options={this.state.users}
                />
            </Col>
          </FormGroup>
        </Col>

        <Col sm={6}>
          <FormGroup>
            <Col sm={2}>
              <ControlLabel className="center-hor">Paušál</ControlLabel>
            </Col>
            <Col sm={10}>
              <Select
                value={this.state.pausal}
                onChange={(pausal)=>this.setState({pausal})}
                options={[{value:true,label:'Pausal'},{value:false,label:'Project'}]}
                />
            </Col>
          </FormGroup>
        </Col>

        <Col sm={6}>
          <FormGroup>
            <Col sm={2}>
              <ControlLabel className="center-hor">Work hours</ControlLabel>
            </Col>
            <Col sm={10}>
              <FormControl type="number" placeholder="Enter work hours" value={this.state.workHours} onChange={(e)=>this.setState({workHours:e.target.value})} />
            </Col>
          </FormGroup>
        </Col>

        <Col sm={6}>
          <FormGroup>
            <Col sm={2}>
              <ControlLabel className="center-hor">Work Type</ControlLabel>
            </Col>
            <Col sm={10}>
              <Select
                value={this.state.workType}
                onChange={(workType)=>this.setState({workType})}
                options={this.state.workTypes}
                />
            </Col>
          </FormGroup>
        </Col>
      </div>







        <div className="floatingSeparator"></div>
        <FormGroup>
          <Col sm={2}>
            <ControlLabel className="center-hor">Description</ControlLabel>
          </Col>
          <Col sm={10}>
            <FormControl componentClass="textarea" placeholder="Enter task description" value={this.state.description} onChange={(e)=>this.setState({description:e.target.value})} />
          </Col>
        </FormGroup>



        <Button bsStyle="primary" className="separate" disabled={this.state.title==="" || this.state.status===null || this.state.project === null||this.state.saving}
          onClick={this.submitTask.bind(this)}>{this.state.saving?'Adding...':'Add task'}</Button>
      </div>
    );
  }
}
