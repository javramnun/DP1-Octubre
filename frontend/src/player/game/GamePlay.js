import React, { useEffect, useState, useRef } from 'react'
import tokenService from '../../services/token.service';
import { useNavigate } from 'react-router-dom';

export default function GamePlay() {

    const jwt = tokenService.getLocalAccessToken();
    const user = tokenService.getUser().username;

    const navigate = useNavigate();
    const isMounted = useRef(false);

    const id = window.location.pathname.split("/")[2];
    const [game, setGame] = useState({});
    const [userData, setUserData] = useState({});

    const [round, setRound] = useState(0);

    const [theme, setTheme] = useState(null);
    const [existeTema, setExisteTema] = useState(false);

    const [selectedCard, setSelectedCard] = useState(null);
    const [cardChosen, setCardChosen] = useState(null);
    const [canSelect, setCanSelect] = useState(false);
    const [errorCard, setErrorCard] = useState("");
    const [displayOptions, setDisplayOptions] = useState(false);
    const [displayedCards, setDisplayedCards] = useState([]);

    const [optionCards, setOptionCards] = useState([]);
    const [myScore, setMyScore] = useState(0);

    //Iniciar partida
    useEffect(() => {
        if (isMounted.current) return;
        isMounted.current = true;

        async function joinGame() {
            try {
                await fetch(`/api/v1/games/${id}/play`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`,
                    },
                }).then(async (response) => {
                    if (response.status === 200) {
                        navigate(`/games/${id}`);
                    }
                });
            } catch (error) {
                console.error(error);
            }
        }
        joinGame();
        isMounted.current = false;
    }, [game]);

    //Datos de Game y User
    useEffect(() => {
        if (isMounted.current) return;
        isMounted.current = true;

        const fetchGame = async () => {
            const response = await fetch(`/api/v1/games/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();

            const usuario = data.scoreboards.find(scoreboard => scoreboard.user.username === user)?.user;
            setGame(data);
            setUserData(usuario);
            setRound(data.rounds.length);
            const ultimoRound = data.rounds[data.rounds.length - 1];
            const tema = ultimoRound?.theme ?? null;
            const existeTema = !!ultimoRound?.theme;

            setTheme(tema);
            setExisteTema(existeTema);
            setOptionCards(ultimoRound?.selectedCards ?? []);
        };
        fetchGame();
    }, [game, id, jwt]);

    const players = game.scoreboards && game.scoreboards.map(scoreboard => {
        if (scoreboard.user.username === user) return;
        return (
            <h4 style={{ textShadow: "2px 2px 4px #FFFFFF", backgroundColor: "#ffffff4d", padding: "1rem", borderRadius: 25 }} key={scoreboard.id}>{scoreboard.user.username}: {scoreboard.score} pts.</h4>
        );
    });

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
                    setRound(data.rounds.length);
                    setTheme(data.rounds[data.rounds.length - 1].theme || null);
                    setOptionCards(data.rounds[data.rounds.length - 1].selectedCards || []);
                    setExisteTema(data.rounds[data.rounds.length - 1].theme ? true : false);

                    const puntosUsuario = data.scoreboards.find(scoreboard => scoreboard.user.username === userData.username)?.score;
                    setMyScore(puntosUsuario);

                    const votos = data.rounds[data.rounds.length - 1].votes;
                    const claves = Object.keys(votos);
                    let recuento = 0;
                    claves.forEach(clave => { recuento += votos[clave] });

                    if (recuento >= game.numberOfPlayers - 1) {
                        setDisplayOptions(false);
                    }
                    console.log(data);
                    const responseUser = data.scoreboards.find(scoreboard => scoreboard.user.username === user)?.user;
                    setUserData(responseUser);
                    console.log(responseUser);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchGameId();
        }, 10000);
        return () => clearInterval(intervalId);
    }, [id, jwt, game]);

    //Cartas
    const handleCardClick = (card) => {
        setSelectedCard(card.id);
    };

    const cards = userData.mazo && userData.mazo.map(card => {
        const isSelected = selectedCard === card.id;

        return (
            <div
                key={card.id}
                style={{
                    margin: 10,
                    border: isSelected ? '8px solid var(--main-red-color)' : '',
                    cursor: 'pointer'
                }}
                onClick={() => handleCardClick(card)}
            >
                <img src={card.design} alt={card.design} style={{ height: 150 }} />
            </div>
        );
    });

    const handleCard = async () => {
        if (selectedCard != null && canSelect) {
            const tipo = userData.isNarrator ? "card" : "extraCard";
            await fetch(`/api/v1/games/${id}/${tipo}/${selectedCard}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
            }).then(async (response) => {
                if (response.status === 200) {
                    setCanSelect(false);
                    setErrorCard("");
                }
            });
        } else {
            setErrorCard("You must wait for a theme");
        }
        setSelectedCard(null);
    }

    const handleChosen = (card) => {
        setCardChosen(card);
    }

    const handleCardChosen = async () => {
        if (cardChosen != null) {
            await fetch(`/api/v1/games/${id}/vote/${cardChosen.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
            }).then(async (response) => {
                if (response.status === 200) {
                    setDisplayOptions(false);
                }
            });
        }
    }

    useEffect(() => {
        if (theme != null) {
            setCanSelect(true);
        }
    }, [theme]);

    useEffect(() => {
        if (game.rounds && game.rounds.length > 0) {
            const currentRound = game.rounds[game.rounds.length - 1];
            const votos = Object.keys(currentRound.votes);
            let votosTotales = 0;
            votos.forEach(voto => { votosTotales += votos[voto] });
            console.log(votosTotales);

            if (optionCards.length === game.numberOfPlayers) {
                if (votosTotales < game.numberOfPlayers - 1) {
                    if (userData.cartaSeleccionada == null) {
                        setDisplayOptions(true);
                    }
                } else {
                    const fetchPuntos = async () => {
                        try {
                            const response = await fetch(`/api/v1/games/${id}/score`, {
                                method: "PUT",
                                headers: {
                                    Authorization: `Bearer ${jwt}`,
                                    "Content-Type": "application/json",
                                },
                            });
                            const data = await response.json();
                            setGame(data);
                            console.log(data);
                            setUserData(data.scoreboards.find(scoreboard => scoreboard.user.username === user)?.user);
                        } catch (error) {
                            console.error(error);
                        }
                    };
                    fetchPuntos();
                }
                setDisplayedCards(optionCards.filter(c => !userData.mazo.some(card => card.id === c.id)));
            }
        }
    }, [cardChosen, optionCards]);

    //Tema
    const [inputValue, setInputValue] = useState("INTRODUCE UN TEMA");
    const [error, setError] = useState("");

    const handleFocus = () => {
        if (inputValue === "INTRODUCE UN TEMA") {
            setInputValue("");
        }
    };

    const handleChange = (event) => {
        setInputValue(event.target.value);
        setError("");
    };

    const handleClick = async () => {
        if (inputValue == "" || inputValue == "INTRODUCE UN TEMA") {
            setError("INTRODUCE A CORRECT THEME");
        } else {
            await fetch(`/api/v1/games/${id}/theme/${inputValue}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
            }).then(async (response) => {
                if (response.status === 200) {
                    const data = await response.json();
                    setTheme(data.rounds[data.rounds.length - 1].theme || null);
                    setExisteTema(data.rounds[data.rounds.length - 1].theme ? true : false);
                }
            });
        }
    }

    //Juego
    return (
        <>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: 'space-around' }}>
                {players && players}
            </div><br /><br /><br /><br />

            {displayOptions && !userData.isNarrator ? (
                <div style={{ display: "flex", flexDirection: "column", textAlign: "center", backgroundColor: "#ffffff96", padding: "2rem", borderRadius: 25, marginTop: -80 }}>
                    <h2>CHOOSE A CARD</h2>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: 'center', alignItems: 'center' }}>
                        {displayedCards.map(card => (
                            <div key={card.id}
                                style={{
                                    margin: 10,
                                    border: cardChosen == card ? '8px solid var(--main-blue-color)' : '',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleChosen(card)}
                            >
                                <img src={card.design} alt={card.design} style={{ height: 250 }} />
                            </div>
                        ))}
                        {cardChosen && (
                            <button className='auth-button' style={{ height: 70, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleCardChosen}> Send Card </button>
                        )}
                    </div>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", textAlign: "center", backgroundColor: "#ffffff96", padding: "2rem", borderRadius: 25, marginTop: -80 }}>
                    <h2>Waiting for the other players to choose a card</h2>
                </div>
            )}<br /><br />
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', backgroundColor: "#ffffff96", padding: "2rem", borderRadius: 25, }}>
                {!existeTema && userData.isNarrator ? (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <input style={{ fontSize: 80, textShadow: "2px 2px 4px #777" }} type='text' className='custom-input' name='Theme' value={inputValue} onFocus={handleFocus} onChange={handleChange} />
                        <button className='auth-button' style={{ height: 70, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={handleClick}>
                            Send Theme
                        </button>
                    </div>
                ) : !existeTema ? (
                    <h3 style={{ textShadow: "2px 2px 4px #777" }}>Waiting for the narrator to send the theme</h3>
                ) : (
                    <h2 style={{ textShadow: "2px 2px 4px #777" }}>{theme}</h2>
                )}
                {error && <p style={{ color: 'red', }}>{error}</p>}<hr />

                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: 'space-around' }}>
                    <h2>My cards</h2>
                    <h3>My Score: {myScore} pts.</h3>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: 'center' }}>
                    {cards && cards}
                </div>
                {selectedCard != null && (
                    <button className='auth-button' style={{ height: 70, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleCard}> Send Card </button>
                )}
                {errorCard && <p style={{ color: 'red', }}>{errorCard}</p>}
            </div>
        </>
    )
}
