import React, {Component} from 'react';
import {Route} from 'react-router-dom';

import PageHeader from './PageHeader';
import Reroute from './reroute';
import Sidebar from './Sidebar';
import TaskList from './TaskList';


export default class Navigation extends Component {
  render(){
    return(
      <div>
        <PageHeader {...this.props}/>
          <div className="row">
            <Sidebar  {...this.props}/>
            <div>
              <Route exact path='/' component={Reroute} />
              <Route exact path='/helpdesk/filter/:id' component={TaskList} />
              <Route exact path='/helpdesk/mytasks' component={TaskList} />
              <Route exact path='/helpdesk/project' component={TaskList} />
            </div>
          </div>
      </div>
    )
  }
}
