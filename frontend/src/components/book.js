// Engy Masoud, 4/27/26, IT302452, Phase 5, eam64@njit.edu
import React, { useState, useEffect } from 'react'
import BooksDataService from '../service/BooksDataService'
import { Link, useParams, useLocation } from 'react-router-dom'

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

const Book = (props) => {

  const location = useLocation();
  const passedBook = location.state && location.state.book;
  const [book, setBook] = useState({
    id: null,
    title: passedBook ? passedBook.title : "",
    author: passedBook ? passedBook.author : "",
    year: passedBook ? passedBook.year : "",
    image: passedBook ? passedBook.image : "",
    critiques: passedBook && passedBook.critiques ? passedBook.critiques : []
  })
  let { id } = useParams();

  const getBook = id => {
    BooksDataService.get(id)
      .then(response => {
        setBook(response.data)
        console.log(response.data)
      })
      .catch(e => {
        console.log(e);
      })
  }

  useEffect(() => {
    getBook(id)
  }, [id])

  useEffect(() => {
    BooksDataService.getCritiques(id)
      .then(response => {
        setBook(prevState => ({ ...prevState, critiques: response.data }))
      })
      .catch(e => {
        console.log(e)
      })
  }, [id])

  const deleteCritique = (critiqueId, index) => {
    BooksDataService.deleteCritique(critiqueId, props.user.id)
      .then(response => {
        setBook((prevState) => {
          prevState.critiques.splice(index, 1)
          return ({
            ...prevState
          })
        })
      })
      .catch(e => {
        console.log(e)
      })
  }

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
                {props.user &&
                  <Link to={"/eam64_books/" + id + "/critique"} state={{ book: book }}>
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
                    {props.user && props.user.id === critique.user_id &&
                      <Row>
                        <Col>
                          <Link
                            to={"/eam64_books/" + id + "/critique"}
                            state={{ book: book, currentCritique: critique }}
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
