import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import InvoicesApi from '../services/invoiceApi';

const STATUS_CLASES = {
  PAID: 'success',
  SENT: 'primary',
  CANCELLED: 'danger'
};

const STATUS_NAME = {
  PAID: 'Payée',
  SENT: 'Envoyée',
  CANCELLED: 'Annulée'
};

const InvoicesPage = props => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [seach, setSeach] = useState('');

  const fetchInvoices = async () => {
    try {
      const data = await InvoicesApi.findAll();

      setInvoices(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const itemPerPage = 15;
  const handleChangePage = page => {
    setCurrentPage(page);
  };

  const handleDelete = async id => {
    const originalInvoices = [...invoices];
    setInvoices(invoices.filter(invoice => invoice.id !== id));

    try {
      await InvoicesApi.delete(id);
    } catch (error) {
      setInvoices(originalInvoices);
    }
  };

  //Gestion de la rechercher
  const handleSeach = ({ currentTarget }) => {
    setSeach(currentTarget.value);
    setCurrentPage(1);
  };

  //Filtrage des clients en fonction de la recherche
  const filteredInvoices = invoices.filter(
    i =>
      i.customer.firstName.toLowerCase().includes(seach.toLowerCase()) ||
      i.customer.firstName.toLowerCase().includes(seach.toLowerCase()) ||
      i.amount
        .toString()
        .toLowerCase()
        .startsWith(seach.toLowerCase()) ||
      STATUS_NAME[i.status].toLowerCase().includes(seach.toLocaleLowerCase())
  );

  //Pagination des données
  const paginatedInvoices = Pagination.getData(
    filteredInvoices,
    currentPage,
    itemPerPage
  );

  const formatDate = str => moment(str).format('DD/MM/YYYY');
  return (
    <>
      <h1>Liste des factures</h1>

      <div className='form-group'>
        <input
          type='text'
          onChange={handleSeach}
          value={seach}
          placeholder='Recherche ...'
          className='form-control'
        />
      </div>

      <table className='table table-hover'>
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Cleint</th>
            <th className='text-center'>Date d'envoi</th>
            <th className='text-center'>Statut</th>
            <th className='text-center'>Montant</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginatedInvoices.map(invoice => (
            <tr key={invoice.id}>
              <td>
                <strong>#{invoice.chrono}</strong>
              </td>
              <td>
                <a href='#'>
                  {invoice.customer.firstName} {invoice.customer.lastName}
                </a>
              </td>
              <td className='text-center'>{formatDate(invoice.sentAt)}</td>
              <td className='text-center'>
                <span
                  className={`p-2 badge badge-${
                    STATUS_CLASES[invoice.status]
                  }`}>
                  {STATUS_NAME[invoice.status]}
                </span>
              </td>
              <td className='text-center'>
                {invoice.amount.toLocaleString()}€
              </td>
              <td>
                <button className='btn btn-sm btn-primary mr-1'>Editer</button>
                <button
                  onClick={() => handleDelete(invoice.id)}
                  className='btn btn-sm btn-danger'>
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
        length={filteredInvoices.length}
        onChangePage={handleChangePage}
      />
    </>
  );
};

export default InvoicesPage;
