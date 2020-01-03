import React, { useState } from 'react';
import Field from '../components/forms/Field';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CUSTOMER = {lastName: '', firstName: '', email: '', company: ''};

const CustomerPage = props => {
  const [customer, setCustomer] = useState({ CUSTOMER });

  const [error, setError] = useState({ CUSTOMER });

  const handleChange = ({ currentTarget }) =>
    setCustomer({ ...customer, [currentTarget.name]: currentTarget.value });

  const handleSubmit = async event => {
    event.preventDefault();

   try{
       await axios
        .post('http://localhost:8000/api/customers', customer)
        .then(response => console.log(response.data));
    
     setError({});
   }catch(error){
     if(error.response.data.violations){
         const apiErrors ={};
         error.response.data.violations.map(violation =>{
            apiErrors[violation.propertyPath] = violation.message;
        })
        setError(apiErrors);
     }
   }
  };

  return (
    <>
      <h1>Création d'un client</h1>
      <form className='col-md-8' onSubmit={handleSubmit}>
        <Field
          name='lastName'
          onChange={handleChange}
          label='Nom de famille'
          placeholder='Nom de famille du client'
          error={error.lastName}
        />
        <Field
          name='firstName'
          onChange={handleChange}
          label='Prenom de famille'
          placeholder='Prenom de famille du client'
          error={error.firstName}
        />
        <Field
          name='email'
          onChange={handleChange}
          label='Email'
          placeholder='Adresse email du client'
          error={error.email}
        />
        <Field
          name='company'
          onChange={handleChange}
          label='Entreprise'
          placeholder='Entreprise du client'
          error={error.company}
        />
        <div className='form-group d-flex justify-content-between align-items-center'>
          <button className='btn btn-success'>Enregistrer</button>
          <Link className='btn btn-primary' to='/customers'>
            Liste des clients
          </Link>
        </div>
      </form>
    </>
  );
};

export default CustomerPage;
