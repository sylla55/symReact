import React, { Fragment, useState, useContext } from 'react';
import authApi from '../services/authApi';
import AuthContext from '../context/AuthContext';
import Field from '../components/forms/Field';

const LoginPage = ({ history }) => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [credentials, setcredentials] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');

  //gestion des champ
  const handleChange = ({ currentTarget }) =>
    setcredentials({
      ...credentials,
      [currentTarget.name]: currentTarget.value
    });

  //gestion de submit
  const handleSubmit = async event => {
    event.preventDefault();

    try {
      await authApi.authenticate(credentials);
      setIsAuthenticated(true);
      setError('');
      history.push('/customers');
    } catch (error) {
      setError('Aucun compte ne posséde cette adresse!!');
    }
    setcredentials({ username: '', password: '' });
  };

  return (
    <Fragment>
      <h1>Connexion</h1>

      <form className='col-md-6 jumbotron p-3' onSubmit={handleSubmit}>
        <Field
          label='Adresse email'
          name='username'
          value={credentials.username}
          onChange={handleChange}
          placeholder='Adresse email de connexion'
          error={error}
        />
        <Field
          label='Mot de passe'
          name='password'
          value={credentials.password}
          onChange={handleChange}
          type='password'
          placeholder='Mot de passe de connexion'
          error={error}
        />
        <div className='form-group'>
          <button className='btn btn-outline-success' type='submit'>
            Connexion
          </button>
        </div>
      </form>
    </Fragment>
  );
};

export default LoginPage;
