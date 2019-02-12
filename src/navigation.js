import React, {Component} from 'react';
import {Route} from 'react-router-dom';

import PageHeader from './PageHeader';
import Reroute from './reroute';
import Sidebar from './Sidebar';
import StatusList from './settings/statusList';
import ProjectList from './settings/projectList';
import UnitList from './settings/unitList';
import CompanyList from './settings/companyList';
import WorkTypeList from './settings/workTypeList';
import UserList from './settings/userList';
import PriceList from './settings/priceList';
import SupplierList from './settings/supplierList';
import SupplierInvoiceList from './settings/supplierInvoiceList';

import TaskList from './task/taskList';
import TaskListColumns from './task/taskListColumns';
import TaskEdit from './task/taskEdit';
import TaskAdd from './task/taskAdd';


export default class Navigation extends Component {
  render(){
    return(
      <div>
        <PageHeader {...this.props}/>
          <div className="row">
            <Sidebar  {...this.props}/>
            <div className="flex">
              <Route exact path='/' component={Reroute} />
              <Route exact path='/helpdesk/project' component={TaskList} />

              <Route exact path='/helpdesk/mytasks' component={TaskList} />
              <Route exact path='/helpdesk/mytasks/:taskID' component={TaskEdit} />
              <Route exact path='/helpdesk/mytasks/task/add' component={TaskAdd} />

              <Route exact path='/helpdesk/filter/:filterID' component={TaskListColumns} />
              <Route exact path='/helpdesk/filter/:filterID/:taskID' component={TaskListColumns} />

              <Route exact path='/helpdesk/settings/statuses' component={StatusList} />
              <Route exact path='/helpdesk/settings/statuses/:id' component={StatusList} />
              <Route exact path='/helpdesk/settings/projects' component={ProjectList} />
              <Route exact path='/helpdesk/settings/projects/:id' component={ProjectList} />
              <Route exact path='/helpdesk/settings/units' component={UnitList} />
              <Route exact path='/helpdesk/settings/units/:id' component={UnitList} />
              <Route exact path='/helpdesk/settings/companies' component={CompanyList} />
              <Route exact path='/helpdesk/settings/companies/:id' component={CompanyList} />
              <Route exact path='/helpdesk/settings/workTypes' component={WorkTypeList} />
              <Route exact path='/helpdesk/settings/workTypes/:id' component={WorkTypeList} />
              <Route exact path='/helpdesk/settings/users' component={UserList} />
              <Route exact path='/helpdesk/settings/users/:id' component={UserList} />
              <Route exact path='/helpdesk/settings/pricelists' component={PriceList} />
              <Route exact path='/helpdesk/settings/pricelists/:id' component={PriceList} />
              <Route exact path='/helpdesk/settings/suppliers' component={SupplierList} />
              <Route exact path='/helpdesk/settings/suppliers/:id' component={SupplierList} />
              <Route exact path='/helpdesk/settings/supplierInvoices' component={SupplierInvoiceList} />
              <Route exact path='/helpdesk/settings/supplierInvoices/:id' component={SupplierInvoiceList} />
            </div>
          </div>
      </div>
    )
  }
}
