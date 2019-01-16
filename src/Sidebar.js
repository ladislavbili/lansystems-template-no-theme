import React, { Component } from 'react';
import Select from 'react-select';
import { Nav,  NavItem, ListGroup } from 'react-bootstrap';
import {rebase} from './index';

export default class Tags extends Component{
  constructor(props){
    super(props);
    this.state = {
      project : {id:'all', title:'All', value:'all', label:'All'},
      openAddTag:false,
      search:'',
      projects:[],
      openEditProject:false,
      openAddProject:false,
      adress:'',
    }
    //this.isActive.bind(this);
  }

  componentWillMount(){
    this.ref = rebase.listenToCollection('/projects', {
      context: this,
      withIds: true,
      then:content=>{this.setState({projects:content})},
    });
  }

  componentWillUnmount() {
    rebase.removeBinding(this.ref);
  }

  isActive(id){
    return this.props.history.location.pathname.toLowerCase().includes(id) &&! this.props.history.location.pathname.toLowerCase().includes(id+'/');
  }

  render(){
    let projects=[{id:'all', title:'All'}].concat(this.state.projects).map((project)=>{
      project.value=project.id;
      project.label=project.title;
      return project;
    });
    return (
      <ListGroup className='sidebarContainer fullWidth m-b-0'>
          <label>Project</label>
          <Select
            options={projects}
            value={projects.find((item)=>item.id===this.state.project.id)}
            onChange={e =>{ this.setState({ project: e }); this.props.history.push('/project/'+e.id)}}
            />

        <label>Filters</label>
        <Nav bsStyle="pills" stacked activeKey={this.state.adress} onSelect={(adress)=>{this.props.history.push("/helpdesk/filter/all");this.setState({adress})}}>
          <NavItem eventKey={'/helpdesk/mytasks'}>
            My tasks
          </NavItem>
          <NavItem eventKey={"/helpdesk/filter/all"}>
            All tasks
          </NavItem>
        </Nav>

      </ListGroup>
    );

  }
}
