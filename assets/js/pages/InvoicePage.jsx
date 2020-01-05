import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import customersApi from '../services/customersApi';
import InvoicesApi from '../services/invoiceApi';
import { toast } from 'react-toastify';
import DotLoader from '../components/loader/DotLoader';

const InvoicePage = ({history,match}) => {
  const { id = "new" } = match.params;
  const [invoice, setInvoice] = useState({
    amount: '',
    customer: '',
    status: 'SENT'
  });

  const [customers, setCustomers] = useState([]);
  const [isEditing,setIsEditing] = useState(false);
  const [loading,setLoading] = useState(true); 

  const [error, setError] = useState({
    amount: '',
    customer: '',
    status: ''
  });

  //reacuperation des clients 
  const fetchCustomers = async () => {
    try {
      const data = await customersApi.findAll();
      setCustomers(data);
      if(!invoice.customer) setInvoice({...invoice,customer:data[0].id});
    } catch (error) {
      toast.error("Impossible de charger les clients");
      history.replace("/invoices");
    }
  };

  //Recuperation des factures en fonction de l'ID
  const fetchInvoices = async (id)=>{
    try{
      const {amount,status,customer} = await InvoicesApi.find(id);
      setInvoice({amount,status,customer: customer.id});
      setLoading(false);
    }catch(error){
      toast.error("Impossible de charger la facture demandée");
      history.replace("/invoices");
    }
  }

  //Chargement des clients
  useEffect(() => {
    fetchCustomers();
  }, []);

  //Chargement des clients en fonction de l'ID pour l'edition
  useEffect(() => {
    if(id !== "new"){
      setIsEditing(true);
      fetchInvoices(id);
    }
  }, [id]);

  //Chargemenent des Inputs
  const handleChange = ({ currentTarget }) => {
    setInvoice({ ...invoice, [currentTarget.name]: currentTarget.value });
  };

  //Gestion de la soumission du formulaire
  const handleSubmit = async event => {
    event.preventDefault();
    try {
      if(!isEditing){
        await InvoicesApi.post(invoice);
        toast.success("La facture a bien été enregisrée");
      }else{
        await InvoicesApi.edit(id,invoice);
        toast.success("La facture a bien été modifiée");
      }
      history.replace("/invoices");
    } catch ({response}) {
      const {violations} = response.data;
      
      if (violations) {
        const apiErrors = {};
        violations.map(({propertyPath,message}) => {
          apiErrors[propertyPath] = message;
        });
        setError(apiErrors);
        toast.error("Il y'a une erreur dans votre formulaire");
      }
  };
}

  return (
    <Fragment>
      {!isEditing && <h1>Création d'une facture</h1> || <h1>Modification d'une facture</h1>}
      
      {! loading && 
      <form className='col-md-8' onSubmit={handleSubmit}>
        <Field
          name='amount'
          type='number'
          placeholder='Le montant de la facture'
          label='Montant'
          onChange={handleChange}
          value={invoice.amount}
          error={error.amount}
        />
        <Select
          name='customer'
          label='Client'
          value={invoice.customer}
          error={error.customer}
          onChange={handleChange}>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.firstName} {customer.lastName}
            </option>
          ))}
        </Select>
        <Select
          name='status'
          label='Status'
          value={invoice.status}
          error={error.status}
          onChange={handleChange}>
          <option value='SENT'>Envoyée</option>
          <option value='PAID'>Payée</option>
          <option value='CANCELLED'>Annulée</option>
        </Select>
        <div className='form-group'>
          <button type='submit' className='btn btn-success'>
            Enregistrer
          </button>
          <Link to='/invoices' className='btn btn-link'>
            Liste des factures
          </Link>
        </div>
        </form> }
          
        {loading && <DotLoader />}

    </Fragment>
  );
};

export default InvoicePage;
