import React from 'react';
import ReactDOM from 'react-dom';

import Navigation from './navigation';

import {BrowserRouter, Route} from 'react-router-dom';

import config from './firebase';
import firebase from 'firebase';
import Rebase from 're-base';

import './scss/index.scss';

const app = firebase.initializeApp(config);
const db = firebase.firestore(app);
const settings = { timestampsInSnapshots: true };
db.settings(settings);

export let rebase = Rebase.createClass(db);

const Root = () => {
  return(
    <div>
      <BrowserRouter>
        <div>
          <Route path='/' component={Navigation} />
        </div>
      </BrowserRouter>
    </div>
  )
}

ReactDOM.render(<Root />, document.getElementById('root'));
