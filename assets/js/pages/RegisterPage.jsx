import React, { useState } from 'react';
import Field from '../components/forms/Field';
import { Link } from 'react-router-dom';
import UserApi from '../services/UserApi';
import { toast } from 'react-toastify';

const RegisterPage = ({ history }) => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });

  const [erros, setErros] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });

  const handleChange = ({ currentTarget }) => {
    setUser({ ...user, [currentTarget.name]: currentTarget.value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const apiErros = {};

    if (user.password !== user.passwordConfirm) {
      apiErros.passwordConfirm =
        'Votre confirmation de mot de passe est diffrent de votre mot de passe !';
        setErros(apiErros);
        toast.error("Des erreeurs dans votre formulaire");
        return;
    }

    try {
      await UserApi.register(user);
      setErros({});
    
      toast.success("Votre compte a été créer, vous pouvez vous conecter 😊");
      history.replace('/login');
    } catch ({ response }) {
      const { violations } = response.data;
      violations.map(({ propertyPath, message }) => {
        apiErros[propertyPath] = message;
      });
      setErros(apiErros);
    }
    toast.error("Des erreeurs dans votre formulaire");
  };

  return (
    <>
      <h1>Création d'un compte</h1>
      <form onSubmit={handleSubmit}>
        <div className='jumbotron col-md-8'>
          <Field
            name='firstName'
            label='Prenom'
            placeholder='Votre prenom'
            value={user.firstName}
            error={erros.firstName}
            onChange={handleChange}
          />
          <Field
            name='lastName'
            label='Nom de famile'
            placeholder='Votre nom de famille'
            value={user.lastName}
            error={erros.lastName}
            onChange={handleChange}
          />
          <Field
            name='email'
            label='Email'
            type='email'
            placeholder='Votre addresse email'
            value={user.email}
            error={erros.email}
            onChange={handleChange}
          />
          <Field
            name='password'
            label='Mot de passe'
            placeholder='Votre mot de passe'
            type='password'
            value={user.password}
            error={erros.password}
            onChange={handleChange}
          />
          <Field
            name='passwordConfirm'
            label='Confirmation du mot de passe'
            placeholder='Confirmez votre mot de passe'
            type='password'
            value={user.passwordConfirm}
            error={erros.passwordConfirm}
            onChange={handleChange}
          />
          <div className='form-group'>
            <button type='submit' className='btn btn-outline-success btn-lg'>
              Créer
            </button>
            <Link to='/login' className='btn btn-link ml-3'>
              J'ai deja un compte
            </Link>
          </div>
        </div>
      </form>
    </>
  );
};

export default RegisterPage;
