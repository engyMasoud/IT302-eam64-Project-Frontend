// Engy Masoud, 4/13/26, IT302452, Phase 4, eam64@njit.edu
import React, { useState } from 'react'
import BooksDataService from '../service/BooksDataService'
import { Link, useParams, useLocation } from 'react-router-dom'

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

const Book = (user) => {

  const location = useLocation();
  const passedBook = location.state && location.state.book;
  const [book, setBook] = useState({
    id: null,
    title: passedBook ? passedBook.title : "",
    author: passedBook ? passedBook.author : "",
    year: passedBook ? passedBook.year : "",
    image: passedBook ? passedBook.image : "",
    critiques: []
  })
  let { id } = useParams();

  const deleteCritique = (critiqueId, index) => {
    BooksDataService.deleteCritique(critiqueId, user.id)
      .then(response => {
        setBook((prevState) => {
          prevState.critiques.splice(index, 1);
          return ({
            ...prevState
          });
        });
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      <Container>
        <Row>
          <Col>
            {book.image &&
              <Image src={book.image} fluid />
            }
          </Col>
          <Col>
            <Card>
              <Card.Header as="h5">{book.title}</Card.Header>
              <Card.Body>
                <Card.Text>
                  Author: {book.author}
                </Card.Text>
                <Card.Text>
                  Year: {book.year}
                </Card.Text>
                {user &&
                  <Link to={"/eam64_books/" + id + "/critique"}>
                    Add Critique
                  </Link>}
              </Card.Body>
            </Card>
            <br></br>
            <h2>Critiques</h2><br></br>
            {book.critiques.map((critique, index) => {
              return (
                <Card key={index}>
                  <Card.Body>
                    <h5>{critique.name + " wrote on " + new Date(Date.parse(critique.lastModified)).toDateString()}</h5>
                    <p>{critique.text}</p>
                    {user && user.id === critique.user_id &&
                      <Row>
                        <Col>
                          <Link
                            to={"/eam64_books/" + id + "/critique"}
                            state={{ currentCritique: critique }}
                          >Edit</Link>
                        </Col>
                        <Col>
                          <Button variant="link" onClick={() => deleteCritique(critique._id, index)}>
                            Delete
                          </Button>
                        </Col>
                      </Row>}
                  </Card.Body>
                </Card>
              )
            })}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Book;
