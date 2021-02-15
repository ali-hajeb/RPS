import {createContext} from 'react';

const userContext = createContext({socket: null, user: {  userName: null, 
                                            userCode: null,
                                            opponent: null,
                                            round: null,
                                            setUserName: () => {}, 
                                            setUserCode: () => {},
                                            setUserLoggedIn: () => {}}});

export default userContext;