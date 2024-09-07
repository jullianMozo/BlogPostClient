import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {

    return (
        <>
            <Row>
                <Col className="p-4 text-center">
                    <h1>Blog post</h1>
                    <p>Create, Update, Delete and View Blogs</p>
                    <Link className="btn btn-primary" to={'/blogPostList'}>See the Blog</Link>
                </Col>
            </Row>
        </>
    )
}