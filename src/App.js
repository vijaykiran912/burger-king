import React, { Component } from 'react';
import Layout from './components/Layout/Layout'
import BurgerBuilder from './container/BurgerBuilder/BurgerBuilder';
import Checkout from './container/Checkout/Checkout';
import Orders from './container/Orders/Orders';

import {Route,Switch} from 'react-router-dom';


class App extends Component {
  render() {
    return (
      <div>
        <Layout>
        <Switch>
          <Route path="/checkout" component={Checkout}/>
          <Route path="/orders" component={Orders}/>
          <Route path="/" exact component={BurgerBuilder}/>        
        </Switch>
        </Layout>
      </div>
    );
  }
}

export default App;
