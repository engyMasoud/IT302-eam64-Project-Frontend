// Engy Masoud, 4/27/26, IT302452, Phase 5, eam64@njit.edu
import React, { useState } from 'react'
import BooksDataService from "../service/BooksDataService"
import { Link, useParams, useLocation } from "react-router-dom"
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const AddCritique = (props) => {
  let editing = false
  let initialCritiqueState = ""
  const location = useLocation();
  if (location.state && location.state.currentCritique) {
    editing = true
    initialCritiqueState = location.state.currentCritique.text
  }

  const passedBook = location.state && location.state.book;

  const [critique, setCritique] = useState(initialCritiqueState)
  // keeps track if critique is submitted
  const [submitted, setSubmitted] = useState(false)
  const [updatedBook, setUpdatedBook] = useState(passedBook)
  let { id } = useParams();

  const onChangeCritique = e => {
    const text = e.target.value
    setCritique(text);
  }

  const saveCritique = () => {
    var data = {
      text: critique,
      name: props.user.name,
      user_id: props.user.id,
      book_id: id
    }

    if (editing) {
      // get existing critique id
      data.critique_id = location.state.currentCritique._id
      BooksDataService.updateCritique(data)
        .then(response => {
          if (passedBook) {
            const updatedCritiques = (passedBook.critiques || []).map(c =>
              c._id === data.critique_id
                ? { ...c, text: data.text, lastModified: new Date().toISOString() }
                : c
            )
            setUpdatedBook({ ...passedBook, critiques: updatedCritiques })
          }
          setSubmitted(true)
          console.log(response.data)
        })
        .catch(e => {
          console.log(e);
        })
    } else {
      BooksDataService.createCritique(data)
        .then(response => {
          if (passedBook) {
            const newCritique = {
              text: data.text,
              name: data.name,
              user_id: data.user_id,
              lastModified: new Date().toISOString(),
              _id: response.data && (response.data._id || response.data.insertedId)
            }
            setUpdatedBook({ ...passedBook, critiques: [...(passedBook.critiques || []), newCritique] })
          }
          setSubmitted(true)
        }).catch(e => { })
    }
  }

  if (!props.user) {
    return (
      <div>
        <p>You must be logged in to add or edit a critique.</p>
        <Link to={"/eam64_login"}>Login</Link>
      </div>
    )
  }

  return (
    <div>
      {submitted ? (
        <div>
          <h5>Critique submitted successfully</h5>
          <Link to={"/eam64_books/" + id} state={{ book: updatedBook }}>
            Back to Book
          </Link>
        </div>
      ) : (
        <Form>
          <Form.Group>
            <Form.Label>{editing ? "Edit" : "Create"} Critique</Form.Label>
            <Form.Control
              type="text"
              required
              value={critique}
              onChange={onChangeCritique}
            />
          </Form.Group>
          <Button variant="primary" onClick={saveCritique}>
            Submit
          </Button>
        </Form>
      )}
    </div>
  )
}

export default AddCritique;
