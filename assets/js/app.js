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
import InvoicePage from './pages/InvoicePage';
import RegisterPage from './pages/RegisterPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            <PrivateRoute path='/customers/:id' component={CustomerPage} />
            <PrivateRoute path='/customers' component={CustomersPage} />
            <PrivateRoute path='/invoices/:id' component={InvoicePage} />
            <PrivateRoute path='/invoices' component={InvoicesPage} />
            <Route path='/login' component={LoginPage} />
            <Route path='/register' component={RegisterPage} />
          </Switch>
        </main>
      </HashRouter>
      <ToastContainer position={toast.POSITION.BOTTOM_LEFT} />
    </AuthContext.Provider>
  );
};

const rootElements = document.querySelector('#app');
ReactDom.render(<App />, rootElements);
