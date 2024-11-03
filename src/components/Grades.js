import Button from 'react-bootstrap/Button';
import { Table, Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";

function Grades() {

    const { studentId } = useParams();
    const [listStudents, setListStudents] = useState([]);
    const [listGrades, setListGrades] = useState([]);
    const [listSubject, setListSubject] = useState([]);

    const [formData, setFormData] = useState({
        studentId: studentId,
        grade: "",
        additionalExplanation: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const handleSubmit = () => {
        const { grade, additionalExplanation } = formData
        if (!grade || !additionalExplanation) {
            alert("Please enter grade and additional explanation");
        } else {
            axios.post("http://localhost:9999/evaluations", formData)
            //alert("Evaluation added successfully!");
        }
    }

    useEffect(() => {
        const fetchData = async () => {

            const responseSubject = await axios.get("http://localhost:9999/subjects");
            setListSubject(responseSubject.data);

            const responseStudent = await axios.get("http://localhost:9999/students");
            setListStudents(responseStudent.data);

            const responseGrades = await axios.get("http://localhost:9999/evaluations");
            setListGrades(responseGrades.data);
            console.log(responseGrades.data);
        }
        fetchData();

    }, [])

    const student = listStudents.filter(s => s.studentId === studentId).map(s => s.name);

    return (

        <Container fluid>
            <Row>
                <Col className='text-center'>
                    <h2>Students Managerment</h2>
                </Col>
            </Row>
            <Row>
                <Col></Col>
                <Col xs={8} className='text-center mt-2 mb-2'>
                    <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Control type="text" placeholder="Enter student name to search..." />
                    </Form.Group>
                </Col>
                <Col></Col>
            </Row>

            <Row>
                <Col xs={3}>
                    <h3>Subjects</h3>
                    <ul >
                        {listSubject.map(s => (<li><a href='#'>{s.name}</a> </li>))}
                    </ul>
                </Col>
                <Col>
                    <Row>
                        <Row>
                            <Col className='text-start'>
                                <Link to="/">
                                    <Button variant="success">Back to home</Button>{' '}
                                </Link>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='text-center'>
                                <h5 className='my-2'>{student}'s Grade Details:</h5>
                            </Col>
                        </Row>

                        <Row>
                            <h5>Add a new grade</h5>
                            <Row>
                                <Form onSubmit={handleSubmit}>
                                    <Row className="mb-3">
                                        <Col>
                                            <Form.Group as={Col}>
                                                <Form.Control type="text" placeholder='Enter grade'
                                                    name="grade"
                                                    value={formData.grade}
                                                    onChange={handleChange}

                                                /></Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group as={Col}>
                                                <Form.Control type="text" placeholder='Enter addtional explanation'
                                                    name="additionalExplanation"
                                                    value={formData.additionalExplanation}
                                                    onChange={handleChange}
                                                /></Form.Group>
                                        </Col>
                                        <Col xs={2}>
                                            <Button type='submit' variant="primary">Add new</Button>{' '}
                                        </Col>
                                    </Row>
                                </Form>
                            </Row>
                            <Row>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Grade</th>
                                            <th>Explanation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            listGrades.map(g => {
                                                if (g.studentId === studentId) {
                                                    return (
                                                        <tr>
                                                            <td>{g.grade}</td>
                                                            <td>{g.additionalExplanation}</td>
                                                        </tr>
                                                    );
                                                }
                                            })

                                        }
                                    </tbody>
                                </Table>
                            </Row>
                        </Row>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default Grades
