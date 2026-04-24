// Engy Masoud, 4/13/26, IT302452, Phase 4, eam64@njit.edu
import axios from "axios";

class BooksDataService {

  getAll(page = 0) {
    return axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/eam64/books?pageNumber=${page}`
    );
  }

  get(id) {
    return axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/eam64/books/id/${id}`
    );
  }

  find(query, by = "title", page = 0) {
    return axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/eam64/books?${by}=${query}&pageNumber=${page}`
    );
  }

  createCritique(data) {
    return axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/eam64/books/critique`,
      data
    );
  }

  updateCritique(data) {
    return axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/eam64/books/critique`,
      data
    );
  }

  deleteCritique(id, userId) {
    return axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/eam64/books/critique`,
      { data: { critique_id: id, user_id: userId } }
    );
  }
  getCritiques(bookId) {
    return axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/eam64/books/critique?book_id=${bookId}`
    )
  }}

export default new BooksDataService();
