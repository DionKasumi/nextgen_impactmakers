import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
    const [array, setArray] = useState([]);
    const fetchApi = async () => {
        const response = await axios.get('http://localhost:8080/api/users');
        setArray(response.data.users);
    };
    useEffect(() => {
        fetchApi();
    }, []);

    return (
        <>
            {array.map((users, index) => (
                <div key={index}>
                    <span>{users}</span>
                    <br></br>
                </div>
            ))}
        </>
    );
}

export default App;
