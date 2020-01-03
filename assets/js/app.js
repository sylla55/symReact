import React, { useState } from 'react';
import ReactDom from 'react-dom';
import { HashRouter, Route, Switch, withRouter } from 'react-router-dom';
//import des components
import NavBar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AuthContext from './context/AuthContext';
import CustomersPage from './pages/CustomersPage';
import CustomerPage from './pages/CustomerPage';
import HomePage from './pages/HomePage';
import InvoicesPage from './pages/InvoicesPage';
import LoginPage from './pages/LoginPage';
import AuthAPI from './services/authApi';

// CSS personalisé
require('../css/app.css');

AuthAPI.setup();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthAPI.isAuthenticated()
  );

  const NavbarWithRouter = withRouter(NavBar);

  return (
    <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
      <HashRouter>
        <NavbarWithRouter />
        <main className='container pt-5'>
          <Switch>
            <Route exact path='/' component={HomePage} />
            <PrivateRoute path='/customers/new' component={CustomerPage} />
            <PrivateRoute path='/customers' component={CustomersPage} />
            <PrivateRoute path='/invoices' component={InvoicesPage} />
            <Route path='/login' component={LoginPage} />
          </Switch>
        </main>
      </HashRouter>
    </AuthContext.Provider>
  );
};

const rootElements = document.querySelector('#app');
ReactDom.render(<App />, rootElements);
