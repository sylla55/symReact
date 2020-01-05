import React, { Fragment, useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import { default as CustomersApi, default as customersApi } from '../services/customersApi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import TableLoader from '../components/loader/TableLoader';

export default function CustomersPage(props) {

  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [seach, setSeach] = useState("");
  const [loading,setLoading] = useState(true);

  //Permet d'aller recuperer les clients
  const fetchCustomers = async () => {
    try{
      const data = await CustomersApi.findAll();
      setCustomers(data);
      setLoading(false);
    } catch(error){
      toast.error("Impossible de charger les clients");
    }
  }

  //Au chargement du composant CustomerPage on va charger les cleints
  useEffect(() => {
    fetchCustomers(); 
  }, []);

  //Gestion de la suppression d'un clients
  const handleDelete = async id => {
    const originalCustomers = [...customers];
    setCustomers(customers.filter(customer => customer.id !== id));

    try{
      await customersApi.DeleteById(id);
      toast.success("La facture a bien été supprimée");
    }catch(error){
      setCustomers(originalCustomers);
      toast.error("Impossible de supprimer la facture");
    }
  }

  //Gestion de la rechercher
  const handleSeach = ({currentTarget}) => {
    setSeach(currentTarget.value);
    setCurrentPage(1);
  };

  //Filtrage des clients en fonction de la recherche
  const filteredCustomers = customers.filter(c =>
    c.firstName.toLowerCase().includes(seach.toLowerCase()) ||
    c.firstName.toLowerCase().includes(seach.toLowerCase()) ||
    c.email.toLowerCase().includes(seach.toLowerCase()) ||
    (c.company && c.company.toLowerCase().includes(seach.toLowerCase()))
  );

  const itemPerPage = 15;
  const handleChangePage = page => {
    setCurrentPage(page);
  };

  //Pagination des données
  const paginatedCustomers = Pagination.getData(
    filteredCustomers,
    currentPage,
    itemPerPage
  );

  return (
    <Fragment>
      <div className="mb-2 d-flex justify-content-between align-items-center">
        <h1>Liste des clients</h1>
        <Link to="/customers/new" className="btn btn-primary">Créer un client</Link>
      </div>
      

      <div className='form-group'>
        <input
          type='text'
          onChange={handleSeach}
          value={seach}
          placeholder='Nom, prenom, entreprise, email ...'
          className='form-control'
        />
      </div>
      <table className='table table-hover'>
        <thead>
          <tr>
            <th>Id</th>
            <th>Client</th>
            <th>Email</th>
            <th>Entreprise</th>
            <th className='text-center'>Factures</th>
            <th className='text-center'>Montant total</th>
            <th></th>
          </tr>
        </thead>
        {!loading && 
        <tbody>
          {paginatedCustomers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>
                <Link to={"/customers/"+customer.id} className="btn btn-link">
                  {customer.firstName} {customer.lastName}
                </Link>
              </td>
              <td>{customer.email}</td>
              <td>{customer.company}</td>
              <td className='text-center'>
                <span className='badge badge-primary p-2'>
                  {customer.invoices.length}
                </span>
              </td>
              <td className='text-center'>
                {customer.totalAmount.toLocaleString()}€
              </td>
              <td>
                <button
                  onClick={() => handleDelete(customer.id)}
                  disabled={customer.invoices.length > 0}
                  className='btn btn-danger'>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>}
      </table>
        {loading && <TableLoader />}

      {itemPerPage < filteredCustomers.length && <Pagination
        currentPage={currentPage}
        itemPerPage={itemPerPage}
        length={filteredCustomers.length}
        onChangePage={handleChangePage}
      />}
    </Fragment>
  );
}
