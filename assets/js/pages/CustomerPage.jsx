import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import CustomersApi from '../services/CustomersApi';
import { toast } from 'react-toastify';
import DotLoader from '../components/loader/DotLoader';

const CustomerPage = ({ match, history }) => {
  const { id = 'new' } = match.params;

  const [customer, setCustomer] = useState({
    lastName: '',
    firstName: '',
    email: '',
    company: ''
  });
  const [error, setError] = useState({
    lastName: '',
    firstName: '',
    email: '',
    company: ''
  });
  const [editing, setEditing] = useState(false);
  const [loading,setLoading] = useState(false);

  //Chargement de Inputs
  const handleChange = ({ currentTarget }) =>
    setCustomer({ ...customer, [currentTarget.name]: currentTarget.value });

  // Gestion de la soummision
  const handleSubmit = async event => {
    event.preventDefault();

    try {
      if (editing) {
        await CustomersApi.edit(id, customer);
        toast.success('Le client a été modifié');
      } else {
        await CustomersApi.postOnCutomer(customer);
        toast.success('Le client a été créer');
      }
      history.replace('/customers');
    } catch ( error) {
      toast.error('Des erreurs dans votre formulaire');
    }
  };

  //Recuperation du client en fonction de l'ID
  const fetchCustomer = async id => {
    try {
      const { firstName, lastName, email, company } = await CustomersApi.find(
        id
      );
      setCustomer({ firstName, lastName, email, company });
      setLoading(false);
    } catch (error) {
      toast.error("Le client n'a pas pu etre chargé");
      history.replace('/customers');
    }
  };

  //Chargement du client
  useEffect(() => {
    if (id !== 'new') {
      setEditing(true);
      setLoading(true);
      fetchCustomer(id);
    }
  }, [id]);

  return (
    <>
      {(!editing && <h1>Création d'un client</h1>) || (
        <h1>Modification du client</h1>
      )}

    {!loading &&
      <form className='col-md-8' onSubmit={handleSubmit}>
        <Field
          name='lastName'
          value={customer.lastName}
          onChange={handleChange}
          label='Nom de famille'
          placeholder='Nom de famille du client'
          error={error.lastName}
        />
        <Field
          name='firstName'
          value={customer.firstName}
          onChange={handleChange}
          label='Prenom de famille'
          placeholder='Prenom de famille du client'
          error={error.firstName}
        />
        <Field
          name='email'
          value={customer.email}
          onChange={handleChange}
          label='Email'
          placeholder='Adresse email du client'
          error={error.email}
        />
        <Field
          name='company'
          value={customer.company}
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
    </form> }

    {loading && <DotLoader />}
    </>
  );
};

export default CustomerPage;
