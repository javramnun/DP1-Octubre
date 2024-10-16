import React, { useEffect, useState } from 'react'
import tokenService from '../../services/token.service';

export default function GameFinish() {

    const jwt = tokenService.getLocalAccessToken();
    const [game, setGame] = useState({});
    const id = window.location.pathname.split("/")[2];

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response = await fetch(`/api/v1/games/${id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();
                setGame(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchGame();
    }, [id]);

    return (
        <div className="auth-page-container">
            <div className="hero-div">
                <h1>Game Finished</h1>
                {game.scoreboard && game.scoreboard.map((score) => (
                    <div key={score.username}>
                        <h3>{score.username}</h3>
                        <p>Score: {score.score}</p>
                    </div>
                ))}
            </div>
        </div>

    )
}
