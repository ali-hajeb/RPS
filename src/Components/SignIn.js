import React from 'react';
import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';
import userAuth from '../Context/userAuth';

export default function SignIn(props) {
    const context = React.useContext(userAuth);
    
    const {sysMsg, setUserCode, setUserName} = props;

    const handleTextChange = e => {
        const value = e.target.value;
        switch (e.target.id) {
            case 'usernameField':
                setUserName(value);
                break;
            case 'passwordField':
                setUserCode(value);
                break;
            default:
                break;
        }
    }

    const onSubmit = e => {
        e.preventDefault();
        context.socket.emit('addUser', { nickName: context.user.userName, roomId: context.user.userCode });
    }
    return (
        <div className="SignIn">
            <Container fluid={false}>
                <Form onSubmit={onSubmit.bind(this)}>
                    <Form.Group controlId="usernameField">
                        <Form.Label>
                            Username* {context.user.userName}
                    </Form.Label>
                        <Form.Control type="text" placeholder="Enter your username" onChange={handleTextChange.bind(this)} required/>
                    </Form.Group>
                    <Form.Group controlId="passwordField">
                        <Form.Label>
                            Invitation Code
                    </Form.Label>
                        <Form.Control type="text" placeholder="Enter your Code" onChange={handleTextChange.bind(this)}/>
                    </Form.Group>
                    <Button block type="submit">Play</Button>
                </Form>
                <h1>{sysMsg}</h1>
            </Container>
        </div>
    )
} 