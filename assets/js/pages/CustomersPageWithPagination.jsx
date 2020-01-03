import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../components/Pagination';

export default function CustomersPageWithPagination(props) {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 15;

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/customers?pagination=true&count=${itemPerPage}&page=${currentPage}`)
      .then(response => response.data['hydra:member'])
      .then(data => setCustomers(data))
      .catch(error => console.log(error.response));
  }, [currentPage]);

  const handleDelete = id => {
    const originalCustomers = [...customers];
    customers.filter(customer => customer.id !== id);
    axios.delete('http://localhost:8000/api/customers/' + id).then(response =>
      console.log('ok').catch(error => {
        setCustomers(originalCustomers);
        console.log(error.response);
      })
    );
  };

  const handleChangePage = page => {
    setCurrentPage(page);
  };

  const paginatedCustomers = Pagination.getData(
    customers,
    currentPage,
    itemPerPage
  );

  return (
    <Fragment>
      <h1>Liste des clients</h1>

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
        <tbody>
          {paginatedCustomers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>
                <a href='#'>
                  {customer.firstName} {customer.lastName}
                </a>
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
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        itemPerPage={itemPerPage}
        length={customers.length}
        onChangePage={handleChangePage}
      />
    </Fragment>
  );
}
