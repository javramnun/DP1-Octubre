import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import tokenService from '../../services/token.service';

const jwt = tokenService.getLocalAccessToken();

export default function GameJoining() {

    const navigate = useNavigate();
    const { id } = useParams();
    const isMounted = useRef(false);

    useEffect(() => {
        if (isMounted.current) return;
        isMounted.current = true;
        
        function joinGame() {
            fetch(`/api/v1/games/${id}/join`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
            }).then((response) => {
                if (response.status === 200) {
                    navigate(`/games/${id}`);
                }
            });
        }
        joinGame();
    }, [id, navigate]);

    return null;
};