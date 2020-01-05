import axios from 'axios';

function findAll() {
  return axios
    .get('http://localhost:8000/api/customers')
    .then(response => response.data['hydra:member']);
}

function DeleteById(id) {
  return axios.delete('http://localhost:8000/api/customers/' + id);
}

function find(id) {
  return axios
    .get('http://localhost:8000/api/customers/' + id)
    .then(response => response.data);
}

function edit(id, customer) {
  axios.put('http://localhost:8000/api/customers/' + id, customer);
}

function postOnCutomer(customer) {
  axios.post('http://localhost:8000/api/customers', customer);
}

export default {
  findAll,
  DeleteById,
  find,
  edit,
  postOnCutomer
};
