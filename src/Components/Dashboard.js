import React from 'react';
import userAuth from '../Context/userAuth';

const Dashboard = props => {
    const context = React.useContext(userAuth);
    const [Context, setContext] = React.useState(context);
    return (
        <userAuth.Consumer>
            {cont => (
                <>
                <button onClick={() => cont.user.setUserName("hi")}>click</button>
                <button onClick={() => cont.socket.disconnect()}>click2</button>
                </>
            )}
        </userAuth.Consumer>
    );
}

export default Dashboard;