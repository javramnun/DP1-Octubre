import React, { useEffect, useState } from 'react'
import tokenService from '../../services/token.service';

export default function Profile() {

    const jwt = tokenService.getLocalAccessToken();
    const user= tokenService.getUser();
    const [data, setData] = useState({});

    useEffect(() => {
        async function fetchData() {
            try {
                await fetch(`/api/v1/users/${user.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`,
                    },
                }).then(async (response) => {
                    if (response.status === 200) {
                        const data = await response.json();
                        setData(data);
                    }
                });
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="auth-page-container">
            <div className='hero-div'>
            {data && (
                <div>
                    <h1>{data.username}</h1>
                </div>
            )}
            </div>
        </div>

    )
}
