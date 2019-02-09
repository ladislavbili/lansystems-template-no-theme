import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel, Alert, Table } from 'react-bootstrap';
import Select from 'react-select';
import {rebase, database} from '../index';
import {toSelArr, snapshotToArray} from '../helperFunctions';
import AddServiceMaterial from './addServiceMaterial';
import EditService from './editService';
import EditMaterial from './editMaterial';

export default class TaskEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      saving:false,
      loading:true,
      addItemModal:false,
      users:[],
      companies:[],
      workTypes:[],
      statuses:[],
      projects:[],
      taskMaterials:[],
      taskWorks:[],
      units:[],
      task:null,
      openEditServiceModal:false,
      openService:null,
      openEditMaterialModal:false,
      openMaterial:null,


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
    this.submitTask.bind(this);
    this.submitMaterial.bind(this);
    this.submitService.bind(this);
    this.saveService.bind(this);
    this.saveMaterial.bind(this);
    this.fetchData(this.props.match.params.taskID);
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
    rebase.updateDoc('/tasks/'+this.state.task.id, body)
    .then(()=>{
      if(!this.props.columns){
        this.props.history.goBack()
      }else{
        this.setState({saving:false});
      }
    });
  }

  submitMaterial(body){
    rebase.addToCollection('taskMaterials',{task:this.props.match.params.taskID,...body}).then((result)=>{
      this.setState({taskMaterials:[...this.state.taskMaterials, {task:this.props.match.params.taskID,...body,id:result.id}]})
    });
  }

  submitService(body){
    rebase.addToCollection('taskWorks',{task:this.props.match.params.taskID,...body}).then((result)=>{
      this.setState({taskWorks:[...this.state.taskWorks, {task:this.props.match.params.taskID,...body,id:result.id}]})
    });
  }

  saveService(body,id){
    rebase.updateDoc('/taskWorks/'+id,body).then((result)=>{
      let newTaskWorks=[...this.state.taskWorks];
      newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===id)]={...newTaskWorks.find((taskWork)=>taskWork.id===id),...body};
      this.setState({taskWorks:newTaskWorks,openService:null});
    });
  }

  saveMaterial(body,id){
    rebase.updateDoc('/taskMaterials/'+id,body).then((result)=>{
      let newTaskMaterials=[...this.state.taskMaterials];
      newTaskMaterials[newTaskMaterials.findIndex((taskMaterial)=>taskMaterial.id===id)]={...newTaskMaterials.find((taskMaterial)=>taskMaterial.id===id),...body};
      this.setState({taskMaterials:newTaskMaterials,openMaterial:null});
    });
  }


  componentWillReceiveProps(props){
    if(this.props.match.params.taskID!==props.match.params.taskID){
      this.setState({loading:true})
      this.fetchData(props.match.params.taskID);
    }
  }

  fetchData(taskID){
    Promise.all(
      [
        database.collection('tasks').doc(taskID).get(),
        database.collection('statuses').get(),
        database.collection('projects').get(),
        database.collection('companies').get(),
        database.collection('workTypes').get(),
        database.collection('units').get(),
        database.collection('prices').get(),
        database.collection('pricelists').get(),
        database.collection('users').get(),
        database.collection('taskMaterials').where("task", "==", taskID).get(),
        database.collection('taskWorks').where("task", "==", taskID).get()
    ]).then(([task,statuses,projects, companies, workTypes, units, prices, pricelists, users,taskMaterials, taskWorks])=>{
      this.setData({id:task.id,...task.data()}, toSelArr(snapshotToArray(statuses)), toSelArr(snapshotToArray(projects)),toSelArr(snapshotToArray(users),'email'),
      toSelArr(snapshotToArray(companies)),toSelArr(snapshotToArray(workTypes)),
      toSelArr(snapshotToArray(units)), snapshotToArray(prices),snapshotToArray(taskMaterials),snapshotToArray(taskWorks),snapshotToArray(pricelists));
    });
  }

  setData(task, statuses, projects,users,companies,workTypes,units, prices,taskMaterials,taskWorks,pricelists){
    let project = projects.find((item)=>item.id===task.project);
    let status = statuses.find((item)=>item.id===task.status);
    let company = companies.find((item)=>item.id===task.company);
    company = {...company,pricelist:pricelists.find((item)=>item.id===company.pricelist)};
    let workType = workTypes.find((item)=>item.id===task.workType);
    let requester = users.find((item)=>item.id===task.requester);
    let assigned = users.find((item)=>item.id===task.assigned);


    let newCompanies=companies.map((company)=>{
      let newCompany={...company,pricelist:pricelists.find((item)=>item.id===company.pricelist)};
      return newCompany;
    });
    let newWorkTypes=workTypes.map((workType)=>{
      let newWorkType = {...workType, prices:prices.filter((price)=>price.workType===workType.id)}
      return newWorkType;
    });

    this.setState({
      task,
      statuses,
      projects,
      users,
      companies:newCompanies,
      workTypes:newWorkTypes,
      units,
      taskMaterials,
      taskWorks,
      description:task.description,
      title:task.title,
      pausal:task.pausal?{value:true,label:'Pausal'}:{value:false,label:'Project'},
      status:status?status:null,
      statusChange:task.statusChange?task.statusChange:null,
      project:project?project:null,
      company:company?company:null,
      workHours:isNaN(parseInt(task.workHours))?0:parseInt(task.workHours),
      workType:workType?workType:null,
      requester:requester?requester:null,
      assigned:assigned?assigned:null,
      loading:false
    });
  }

  render(){
    let taskWorks= this.state.taskWorks.map((work)=>{
      let finalUnitPrice=parseFloat(work.price);
      if(work.extraWork){
        finalUnitPrice+=finalUnitPrice*parseFloat(work.extraPrice)/100;
      }
      let totalPrice=(finalUnitPrice*parseFloat(work.quantity)*(1-parseFloat(work.discount)/100)).toFixed(3);
      finalUnitPrice=finalUnitPrice.toFixed(3);
      return {
        ...work,
        unit:this.state.units.find((unit)=>unit.id===work.unit),
        finalUnitPrice,
        totalPrice
      }
    });

    let taskMaterials= this.state.taskMaterials.map((material)=>{
      let finalUnitPrice=(parseFloat(material.price)*(1+parseFloat(material.margin)/100));
      let totalPrice=(finalUnitPrice*parseFloat(material.quantity)*(1-parseFloat(material.discount)/100)).toFixed(3);
      finalUnitPrice=finalUnitPrice.toFixed(3);
      return {
        ...material,
        unit:this.state.units.find((unit)=>unit.id===material.unit),
        finalUnitPrice,
        totalPrice
      }
    });

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
                <FormControl disabled={true} type="datetime-local" placeholder="Status change date" value={this.state.statusChange!==null?new Date(this.state.statusChange).toISOString().replace('Z',''):new Date().toISOString().replace('Z','')} />
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
      <div>
        <Button bsStyle="primary" disabled={this.state.loading} onClick={()=>this.setState({addItemModal:true})}>+ Service/Material</Button>
      </div>
      <Table striped condensed hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {taskWorks.map((item)=>
            <tr key={item.id} className="clickable" onClick={()=>this.setState({openEditServiceModal:true,openService:item})}>
              <td>{item.title}</td>
              <td>{item.quantity + ' '+ item.unit.title}</td>
              <td>{item.finalUnitPrice}</td>
              <td>{item.discount + '%'}</td>
              <td>{item.totalPrice}</td>
            </tr>
          )}
          {taskMaterials.map((item)=>
            <tr key={item.id} className="clickable" onClick={()=>this.setState({openEditMaterialModal:true,openMaterial:item})}>
              <td>{item.title}</td>
              <td>{item.quantity + ' '+ item.unit.title}</td>
              <td>{item.finalUnitPrice}</td>
              <td>{item.discount + '%'}</td>
              <td>{item.totalPrice}</td>
            </tr>
          )}
          {false && <tr className="table-info">
						<td
							className="tableResults"
							colSpan="100"
						>
							WITH WAT
							<span className="bold">
								ABC
							</span>
						</td>
					</tr>}
        </tbody>
      </Table>

      <AddServiceMaterial
        isOpen={this.state.addItemModal}
        toggle={()=>this.setState({addItemModal:!this.state.addItemModal})}
        company={this.state.company}
        workTypes={this.state.workTypes}
        submitMaterial={this.submitMaterial.bind(this)}
        submitService={this.submitService.bind(this)}
        units={this.state.units}
        />
      {
        this.state.taskWorks.some((item)=>this.state.openService && item.id===this.state.openService.id) &&
      <EditService
        isOpen={this.state.openEditServiceModal}
        units={this.state.units}
        workTypes={this.state.workTypes}
        company={this.state.company}
        service={this.state.openService}
        saveService={this.saveService.bind(this)}
        toggle={()=>this.setState({openEditServiceModal:!this.state.openEditServiceModal})}
        />
      }

      {
        this.state.taskMaterials.some((item)=>this.state.openMaterial && item.id===this.state.openMaterial.id) &&
      <EditMaterial
        isOpen={this.state.openEditMaterialModal}
        units={this.state.units}
        material={this.state.openMaterial}
        saveMaterial={this.saveMaterial.bind(this)}
        toggle={()=>this.setState({openEditMaterialModal:!this.state.openEditMaterialModal})}
        />
      }

        <Button bsStyle="success" className="separate" disabled={this.state.title==="" || this.state.status===null || this.state.project === null||this.state.saving}
          onClick={this.submitTask.bind(this)}>{this.state.saving?'Saving...':'Save task'}</Button>

      </div>
    );
  }
}
