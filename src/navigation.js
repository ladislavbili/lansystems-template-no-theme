import React, {Component} from 'react';
import {Route} from 'react-router-dom';

import PageHeader from './PageHeader';
import Reroute from './reroute';
import Sidebar from './Sidebar';
import StatusList from './settings/statusList';
import ProjectList from './settings/projectList';
import TaskList from './taskList';
import TaskEdit from './taskEdit';
import TaskAdd from './taskAdd';


export default class Navigation extends Component {
  render(){
    return(
      <div>
        <PageHeader {...this.props}/>
          <div className="row">
            <Sidebar  {...this.props}/>
            <div className="flex">
              <Route exact path='/' component={Reroute} />
              <Route exact path='/helpdesk/filter/:filterID' component={TaskList} />
              <Route exact path='/helpdesk/mytasks' component={TaskList} />
              <Route exact path='/helpdesk/project' component={TaskList} />

              <Route exact path='/helpdesk/filter/:filterID/add' component={TaskAdd} />
              <Route exact path='/helpdesk/filter/:filterID/task/:taskID' component={TaskEdit} />

              <Route exact path='/helpdesk/settings/statuses' component={StatusList} />
              <Route exact path='/helpdesk/settings/statuses/:id' component={StatusList} />
              <Route exact path='/helpdesk/settings/projects' component={ProjectList} />
              <Route exact path='/helpdesk/settings/projects/:id' component={ProjectList} />
            </div>
          </div>
      </div>
    )
  }
}
