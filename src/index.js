import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {BrowserRouter, Route} from 'react-router-dom';
import firebase from 'firebase';
import Rebase from 're-base';


import Login from './loginPage';
import config from './firebase';
import createStore from './redux/store';

import './scss/index.scss';

const store=createStore();
const app = firebase.initializeApp(config);
const db = firebase.firestore(app);
const settings = { timestampsInSnapshots: true };
db.settings(settings);

export let rebase = Rebase.createClass(db);

const Root = () => {
  return(
    <Provider store={store}>
      <BrowserRouter>
        <div>
          <Route path='/' component={Login} />
        </div>
      </BrowserRouter>
    </Provider>
  )
}

ReactDOM.render(<Root />, document.getElementById('root'));
