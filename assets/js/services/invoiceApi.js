import axios from 'axios';

function findAll() {
  return axios
    .get('http://localhost:8000/api/invoices')
    .then(response => response.data['hydra:member']);
}

function Delete(id) {
  return axios.delete('http://localhost:8000/api/invoices/' + id);
}
function setAmountAndCustormer(invoices) {
  invoices.amount = parseFloat(invoices.amount);
  invoices.customer = `/api/customers/${invoices.customer}`;
  return invoices;
}

function post(invoices) {
  return axios.post(
    'http://localhost:8000/api/invoices',
    setAmountAndCustormer(invoices)
  );
}

function edit(id, invoices) {
  axios.put(
    'http://localhost:8000/api/invoices/' + id,
    setAmountAndCustormer(invoices)
  );
}

function find(id) {
  return axios
    .get('http://localhost:8000/api/invoices/' + id)
    .then(response => response.data);
}

export default {
  findAll,
  post,
  find,
  edit,
  delete: Delete
};
