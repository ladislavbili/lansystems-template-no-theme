import React, { Component } from 'react';
import Select from 'react-select';
import { Modal, Nav,  NavItem, ListGroup } from 'react-bootstrap';
import ProjectEdit from './ProjectEdit';
import ProjectAdd from './ProjectAdd';
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
      <ListGroup className='sidebarContainer fullWidth'>
          <label>Project</label>
          <Select
            options={projects}
            value={projects.find((item)=>item.id===this.state.project.id)}
            onChange={e =>{ this.setState({ project: e }); this.props.history.push('/project/'+e.id)}}
            />

          <Nav bsStyle="pills" stacked>
            {
              this.state.project.id!=='all' &&
              <NavItem onClick={()=>{this.setState({openEditProject:true})}}>
                Project settings
              </NavItem>
            }
            <NavItem onClick={()=>{this.setState({openAddProject:true})}} >
              Add project
            </NavItem>
          </Nav>
        <label>Filters</label>
        <Nav bsStyle="pills" stacked activeKey={this.state.adress} onSelect={(adress)=>{this.props.history.push("/helpdesk/filter/all");this.setState({adress})}}>
          <NavItem eventKey={'/helpdesk/mytasks'}>
            My tasks
          </NavItem>
          <NavItem eventKey={"/helpdesk/filter/all"}>
            All tasks
          </NavItem>
        </Nav>
          <Modal show={this.state.openEditProject} onHide={()=>{this.setState({openEditProject:false})}}>
            <Modal.Header closeButton>
              <Modal.Title>Editing project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ProjectEdit closeModal={()=>{this.setState({openEditProject:false})}} id={this.state.project.id} />
            </Modal.Body>
          </Modal>
          <Modal show={this.state.openAddProject} onHide={()=>{this.setState({openAddProject:false})}}>
            <Modal.Header closeButton>
              <Modal.Title>Adding project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ProjectAdd closeModal={()=>{this.setState({openAddProject:false})}} />
            </Modal.Body>
          </Modal>

      </ListGroup>
    );

  }
}
