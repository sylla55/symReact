import React, { Fragment, useContext } from 'react';
import AuthApi from '../services/authApi';
import { NavLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const NavBar = ({ history}) => {
  const {isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const handleLogOut = ()=>{
    AuthApi.logOut();
    setIsAuthenticated(false);
    history.replace("/login");
  }

  

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
      <NavLink className='navbar-brand' to='/'>
        SymReact
      </NavLink>
      <button
        className='navbar-toggler'
        type='button'
        data-toggle='collapse'
        data-target='#navbarSupportedContent'
        aria-controls='navbarSupportedContent'
        aria-expanded='false'
        aria-label='Toggle navigation'>
        <span className='navbar-toggler-icon'></span>
      </button>

      <div className='collapse navbar-collapse' id='navbarSupportedContent'>
        <ul className='navbar-nav mr-auto'>
          <li className='nav-item'>
            <NavLink className='nav-link' to='/customers'>
              Clients
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink className='nav-link' to='/invoices'>
              Factures
            </NavLink>
          </li>
        </ul>
        <ul className='navbar-nav ml-auto'>
          {(isAuthenticated === false && (
             <Fragment>
               <li className='nav-item m-l-1 mr-2'>
                  <NavLink to='/register' className='nav-link'>
                    Inscription
                  </NavLink>
                </li>
                <li className='nav-item m-l-1 mr-2'>
                  <NavLink to='/login' className='btn btn-success'>
                    Connexion
                  </NavLink>
                </li>
            </Fragment>
          )) ||(
            <li className='nav-item'>
              <button 
                onClick={handleLogOut} 
                className='btn btn-danger'>
                  Deconnexion
              </button>
          </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
