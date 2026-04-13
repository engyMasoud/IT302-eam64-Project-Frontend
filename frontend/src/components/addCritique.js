// Engy Masoud, 4/13/26, IT302452, Phase 4, eam64@njit.edu
import React, { useState } from 'react'
import BooksDataService from "../service/BooksDataService"
import { Link, useParams, useLocation } from "react-router-dom"
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const AddCritique = (props) => {
  let editing = false;
  let initialCritiqueState = "";
  const location = useLocation();
  if (location.state && location.state.currentCritique) {
    editing = true;
    initialCritiqueState = location.state.currentCritique.text;
  }

  const [critique, setCritique] = useState(initialCritiqueState);
  const [submitted, setSubmitted] = useState(false);
  let { id } = useParams();

  const onChangeCritique = e => {
    const text = e.target.value;
    setCritique(text);
  };

  const saveCritique = () => {
    var data = {
      text: critique,
      name: props.user.name,
      user_id: props.user.id,
      book_id: id
    };

    if (editing) {
      data.critique_id = location.state.currentCritique._id;
      BooksDataService.updateCritique(data)
        .then(response => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      BooksDataService.createCritique(data)
        .then(response => {
          setSubmitted(true);
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  return (
    <div>
      {submitted ? (
        <div>
          <h5>Critique submitted successfully.</h5>
          <Link to={"/eam64_books/" + id}>
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
  );
};

export default AddCritique;
