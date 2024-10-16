import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import tokenService from "../../services/token.service";
import useFetchState from "../../util/useFetchState";
import "../../static/css/auth/authButton.css";
import "../../static/css/auth/authPage.css";
import "./game.css";

export default function GameListing() {
    const jwt = tokenService.getLocalAccessToken();

    const [message, setMessage] = useState("");
    const [visible, setVisible] = useState(false);

    const [games, setGames] = useFetchState([], "/api/v1/games/gameListing", jwt, setMessage, setVisible);

    useEffect(() => {
        const interval = setInterval(() => {
            const response = fetch("/api/v1/games/gameListing", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    "Content-Type": "application/json",
                },
            });
            response.then(async (response) => {
                if (response.status === 200) {
                    const data = await response.json();
                    setGames(data);
                }
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [games]);

    const gameList = games.map(game => {
        return (
            <tr key={game.id} className="game-row">
                <td>{game.id}</td>
                <td>{game.numberOfPlayers}/4</td>
                <td>{game.creator}</td>
                <td>
                    {game.numberOfPlayers < 4 ?
                        <Link className="auth-button" style={{ textDecoration: "none" }} to={`/games/${game.id}/join`}>Join</Link>
                        : <p className="auth-button">Full</p>
                    }
                </td>
            </tr>
        );
    });

    return (
        <div style={{ margin: 15, textAlign: "center" }}>
            <div className="auth-page-container">
                <div className="options-row" style={{ margin: 0 }}>
                    <Link className="auth-button" style={{ textDecoration: "none", marginRight: -250 }} to="/games/new">Create Game</Link>
                    <Link className="auth-button" style={{ textDecoration: "none" }} to="/">Volver</Link>
                </div>
                <table className="game-table">
                    <thead>
                        <tr>
                            <th><h2>Game ID</h2></th>
                            <th><h2>Players</h2></th>
                            <th><h2>Creator</h2></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {gameList}
                    </tbody>
                </table>
            </div>
        </div>
    );
}