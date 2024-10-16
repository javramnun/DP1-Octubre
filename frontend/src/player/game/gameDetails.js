import React, { useEffect, useState, useRef } from 'react';
import tokenService from "../../services/token.service";
import "../../static/css/auth/authButton.css";
import "../../static/css/auth/authPage.css";
import "./game.css";
import { Link, useNavigate } from "react-router-dom";

import GamePlay from './GamePlay';
import GameFinish from './GameFinish';

const jwt = tokenService.getLocalAccessToken();

export default function GameDetails() {
    const user = tokenService.getUser().username;

    const titulo = <h1>Game Details</h1>;
    const [game, setGame] = useState({});
    const id = window.location.pathname.split("/")[2];
    const [reload, setReload] = useState(false);
    const [isFetched, setIsFetched] = useState(false); // Nuevo estado

    const [play, setPlay] = useState(false);
    const [finish, setFinish] = useState(false);

    const navigate = useNavigate();
    const isMounted = useRef(false);

    useEffect(() => {
        if (isMounted.current) return;
        isMounted.current = true;

        const fetchGame = async () => {
            try {
                const response = await fetch(`/api/v1/games/new`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();
                setGame(data);
                navigate(`/games/${data.id}`);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchGameId = async () => {
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
                setPlay(data.isStarted);
                setFinish(data.isFinished);
                setReload(false);
            } catch (error) {
                console.error(error);
            }
        };

        if (!isFetched) {
            id === "new" ? fetchGame() : fetchGameId();
            setIsFetched(true); // Marcar como llamada realizada
        }
    }, [id, isFetched, jwt, navigate]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const fetchGameId = async () => {
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
                    setPlay(data.isStarted);
                    setFinish(data.isFinished);
                    setReload(true);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchGameId();
        }, 10000);

        return () => clearInterval(intervalId);
    }, [reload, id, jwt]);

    const handleClick = async () => {
        try {
            await fetch(`/api/v1/games/${id}/exit`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
            }).then(async (response) => {
                if (response.status === 200) {
                    navigate(`/`);
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="auth-page-container">
            {!play && !finish ? (
                <div className='hero-div'>
                    {titulo}
                    <h2>Personas: {game.numberOfPlayers}</h2>
                    {game.scoreboards && game.scoreboards.map((scoreboard) => (
                        <div key={scoreboard.id}>
                            {scoreboard.user.username == game.creator ?
                                <h4 style={{ color: "#d00" }}>{scoreboard.user.username}</h4>
                                : <h4>{scoreboard.user.username}</h4>
                            }
                        </div>
                    ))}<br />
                    {game.numberOfPlayers > 2 && game.creator === user ? (
                        <Link className="auth-button" style={{ textDecoration: "none" }} to="play">
                            Start Game
                        </Link>
                    ) : 'ESPERANDO PARA EMPEZAR'}
                    <button className='auth-button' style={{ textDecoration: "none", marginTop: 15, backgroundColor: "var(--main-red-color)" }} onClick={handleClick}>Leave Game</button>
                    <p style={{ color: "var(--main-red-color)", marginTop: 5, textShadow: "2px 2px 4px #fff" }}>Press twice to leave</p>
                </div>
            ) : play && !finish ? (
                <div>
                    <GamePlay />
                </div>
            ) : finish && (
                <div>
                    <GameFinish />
                </div>
            )}
        </div>
    );
}