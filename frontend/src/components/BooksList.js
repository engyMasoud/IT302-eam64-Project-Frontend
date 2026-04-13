// Engy Masoud, 4/13/26, IT302452, Phase 4, eam64@njit.edu
import React, { useState, useEffect } from 'react'
import BooksDataService from "../service/BooksDataService"
import { Link } from "react-router-dom"

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchYear, setSearchYear] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(0);
  const [currentSearchMode, setCurrentSearchMode] = useState("");

  useEffect(() => {
    retrieveBooks();
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [currentSearchMode]);

  useEffect(() => {
    retrieveNextPage();
  }, [currentPage]);

  const retrieveNextPage = () => {
    if (currentSearchMode === "findByTitle") {
      findByTitle();
    } else if (currentSearchMode === "findByYear") {
      findByYear();
    } else {
      retrieveBooks();
    }
  };

  const retrieveBooks = () => {
    setCurrentSearchMode("");
    BooksDataService.getAll(currentPage)
      .then((response) => {
        console.log(response.data);
        setBooks(response.data.books);
        setCurrentPage(response.data.pageNumber);
        setEntriesPerPage(response.data.itemsPerPage);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onChangeSearchTitle = (e) => {
    const title = e.target.value;
    setSearchTitle(title);
  };

  const onChangeSearchYear = (e) => {
    const year = e.target.value;
    setSearchYear(year);
  };

  const find = (query, by) => {
    BooksDataService.find(query, by, currentPage)
      .then(response => {
        console.log(response.data);
        setBooks(response.data.books);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const findByTitle = () => {
    setSearchYear("");
    setCurrentSearchMode("findByTitle");
    find(searchTitle, "title");
  };

  const findByYear = () => {
    setSearchTitle("");
    setCurrentSearchMode("findByYear");
    find(searchYear, "year");
  };

  return (
    <div className="App">
      <Container>
        <Form>
          <Row>
            <Col>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Search by title"
                  value={searchTitle}
                  onChange={onChangeSearchTitle}
                />
              </Form.Group>
              <Button
                variant="primary"
                type="button"
                onClick={findByTitle}
              >
                Search
              </Button>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Search by year"
                  value={searchYear}
                  onChange={onChangeSearchYear}
                />
              </Form.Group>
              <Button
                variant="primary"
                type="button"
                onClick={findByYear}
              >
                Search
              </Button>
            </Col>
          </Row>
        </Form>
        <Row className="mt-3">
          {books.map((book) => {
            return (
              <Col key={book._id} md={4} className="mb-3">
                <Card style={{ width: '18rem' }}>
                  {book.image &&
                    <Card.Img src={book.image} />
                  }
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <Card.Text>
                      Author: {book.author}
                    </Card.Text>
                    <Card.Text>
                      Year: {book.year}
                    </Card.Text>
                    <Link to={"/eam64_books/" + book._id} state={{ book: book }}>View Book</Link>
                  </Card.Body>
                </Card>
              </Col>
            )
          })}
        </Row>
        <br />
        Showing Page: {currentPage}
        <Button
          variant="link"
          onClick={() => { setCurrentPage(currentPage + 1) }}
        >
          Get Next {entriesPerPage} Results
        </Button>
      </Container>
    </div>
  );
}

export default BooksList;
