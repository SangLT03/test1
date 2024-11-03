import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import { Table, Container, Row, Col } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';


function Home() {

    const [listSubject, setListSubject] = useState([]);
    const [listStudents, setListStudents] = useState([]);
    const [listStudentDetails, setListStudentDetails] = useState([]);

    const[textSearch, setTextSearch] = useState("null")
    const location = useLocation()
    

    useEffect(() => {
        const fetchData = async () => {
            const responseSubject = await axios.get("http://localhost:9999/subjects");
            setListSubject(responseSubject.data);

            const responseStudent = await axios.get("http://localhost:9999/students");
            //setListStudents(responseStudent.data);

            const responseStSj = await axios.get("http://localhost:9999/students_subjetcs");

            if(textSearch != "null") {
                setListStudents(responseStudent.data.filter(s => s.name.toLowerCase().startsWith(textSearch.toLowerCase())));
            }else {
                setListStudents(responseStudent.data);
            }

            const urlParams = new URLSearchParams(window.location.search)
            const subjectID =(urlParams.get('subject'));

            if(subjectID != null) {
                const listStudentIdBySubject = responseStSj.data.filter(st => st.subjectId == subjectID).map(st => st.studentId)

                const lstStd = responseStudent.data.filter(st => listStudentIdBySubject.includes(st.studentId))
                setListStudents(lstStd);
            }

            const responseStuDetails = await axios.get("http://localhost:9999/student_details");
            setListStudentDetails(responseStuDetails.data);
        }
        fetchData();

    }, [textSearch, location]);

    const searchByName = (event) => {
        setTextSearch(event.target.value)
    }



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
                        <Form.Control onChange={searchByName} type="text" placeholder="Enter student name to search..." />
                    </Form.Group>
                </Col>
                <Col></Col>
            </Row>

            <Row>
                <Col xs={3}>
                    <h3>Subjects</h3>
                    <ul >
                        {listSubject.map(s => (<li><a href={`/student?subject=${s.subjectId}`}>{s.name}</a> </li>))}
                    </ul>
                </Col>
                <Col>
                    <h3>List Of Students</h3>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>StudentID</th>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Street</th>
                                <th>City</th>
                                <th>IsRegularStudent</th>
                                <th>View grades</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                listStudents.map(s => (
                                <tr>
                                    <td>{s.studentId}</td>
                                    <td>{s.name}</td>
                                    <td>{s.age}</td>
                                    {listStudentDetails.filter(sdt => sdt.studentId === s.studentId).map(sdt => (
                                        <>
                                        <td>
                                            {sdt.address.street}
                                        </td>
                                        <td>
                                            {sdt.address.city}
                                        </td>
                                        </>
                                    )) }

                                    <td>{s.isRegularStudent ? 'Fulltime':'Applicant'}</td>
                                    <td><Link to={`/student/${s.studentId}`}>Grades</Link></td>
                                </tr>))
                            }
                           
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    )
}

export default Home
