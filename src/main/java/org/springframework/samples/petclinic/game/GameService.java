package org.springframework.samples.petclinic.game;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.samples.petclinic.card.Card;
import org.springframework.samples.petclinic.card.CardService;
import org.springframework.samples.petclinic.scoreboard.Scoreboard;
import org.springframework.samples.petclinic.scoreboard.ScoreboardService;
import org.springframework.samples.petclinic.user.User;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.samples.petclinic.round.Round;
import org.springframework.samples.petclinic.round.RoundService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GameService {

    protected GameRepository gameRepository;

    @Autowired
    GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @Autowired
    protected CardService cardService;
    @Autowired
    protected ScoreboardService scoreboardService;
    @Autowired
    protected UserService userService;
    @Autowired
    protected RoundService roundService;

    // CRUD
    public List<Game> findAll() {
        return gameRepository.findAll();
    }

    public Game findById(int id) {
        return gameRepository.findById(id);
    }

    public void save(Game game) {
        gameRepository.save(game);
    }

    public Round findRoundByGameAndNumber(int roundNumber, int gameId) {
        return gameRepository.findRoundByGameAndNumber(roundNumber, gameId);
    }

    // Funciones Listado e Inicio
    @Transactional
    public Game addPlayerToGame(Game game) {
        Scoreboard duplicado = scoreboardService.findByUsername(userService.findCurrentUser().getUsername());
        if (duplicado != null) {
            List<Game> games = gameRepository.findAll();
            for (Game g : games) {
                List<Scoreboard> scoreboards = g.getScoreboards();
                for (Scoreboard s : scoreboards) {
                    if (s.getId() == duplicado.getId()) {
                        List<Card> cartasExtra = userService.findCurrentUser().getMazo();
                        List<Card> cartas = g.getCards();
                        cartas.addAll(cartasExtra);
                        g.setCards(cartas);
                        scoreboards.remove(s);
                        g.setNumberOfPlayers(g.getNumberOfPlayers() - 1);
                        g.setNumberOfRounds(g.getNumberOfRounds() - 2);
                        break;
                    }
                }
                g.setScoreboards(scoreboards);
                gameRepository.save(g);

                if (g.getNumberOfPlayers() == 0) {
                    try {
                        gameRepository.deleteById(g.getId());
                    } catch (Exception e) {
                        System.out.println("Error al eliminar el juego");
                    }
                }
            }
            try {
                scoreboardService.deleteById(duplicado.getId());
            } catch (Exception e) {
                System.out.println("Error al eliminar el scoreboard");
            }
        }

        game.setNumberOfPlayers(game.getNumberOfPlayers() == null ? 1 : game.getNumberOfPlayers() + 1);
        game.setNumberOfRounds(game.getNumberOfRounds() == null ? 2 : game.getNumberOfRounds() + 2);

        List<Card> cartas = cardService.findAllCards();
        Collections.shuffle(cartas);
        List<Card> cartasAsignadas = cartas.subList(0, 6);
        List<Card> cartasRestantes = cartas.stream().filter(card -> !cartasAsignadas.contains(card)).toList();
        game.setCards(cartasRestantes);

        User user = userService.findCurrentUser();
        user.setMazo(cartasAsignadas);
        userService.saveUser(user);

        Scoreboard scoreboard = new Scoreboard();
        scoreboard.setOrden(game.getNumberOfPlayers() == 0 ? 1 : game.getNumberOfPlayers());
        scoreboard.setScore(0);
        scoreboard.setUser(userService.findCurrentUser());
        scoreboardService.save(scoreboard);
        List<Scoreboard> scoreboards = game.getScoreboards();
        if (scoreboards == null) {
            scoreboards = List.of(scoreboard);
        } else {
            scoreboards.add(scoreboard);
        }
        game.setScoreboards(scoreboards);
        return game;
    }

    @Transactional
    public Game createGame() {
        Game game = new Game();
        game = addPlayerToGame(game);
        game.setCreator(userService.findCurrentUser().getUsername());
        save(game);
        return game;
    }

    @Transactional
    public Game addNewPlayer(Game game) {
        if (game.getNumberOfPlayers() == 4) {
            return game;
        }

        Scoreboard duplicado = scoreboardService.findByUsername(userService.findCurrentUser().getUsername());
        if (duplicado != null) {
            List<Game> games = gameRepository.findAll();
            for (Game g : games) {
                List<Scoreboard> scoreboards = g.getScoreboards();
                for (Scoreboard s : scoreboards) {
                    if (s.getId() == duplicado.getId()) {
                        List<Card> cartasExtra = userService.findCurrentUser().getMazo();
                        List<Card> cartas = g.getCards();
                        cartas.addAll(cartasExtra);
                        g.setCards(cartas);
                        scoreboards.remove(s);
                        g.setNumberOfPlayers(g.getNumberOfPlayers() - 1);
                        g.setNumberOfRounds(g.getNumberOfRounds() - 2);
                        break;
                    }
                }
                g.setScoreboards(scoreboards);
                gameRepository.save(g);

                if (g.getNumberOfPlayers() == 0) {
                    try {
                        gameRepository.deleteById(g.getId());
                    } catch (Exception e) {
                        System.out.println("Error al eliminar el juego");
                    }
                }
            }
            try {
                scoreboardService.deleteById(duplicado.getId());
            } catch (Exception e) {
                System.out.println("Error al eliminar el scoreboard");
            }
        }

        List<Card> cartas = game.getCards();
        Collections.shuffle(cartas);
        List<Card> cartasAsignadas = cartas.subList(0, 6);
        List<Card> cartasRestantes = cartas.stream().filter(card -> !cartasAsignadas.contains(card))
                .collect(Collectors.toList());
        game.setCards(cartasRestantes);

        User user = userService.findCurrentUser();
        user.setMazo(cartasAsignadas);
        user.setIsNarrator(false);
        userService.saveUser(user);

        Scoreboard scoreboard = new Scoreboard();
        scoreboard.setOrden(game.getNumberOfPlayers() + 1);
        scoreboard.setScore(0);
        scoreboard.setUser(userService.findCurrentUser());
        scoreboardService.save(scoreboard);
        List<Scoreboard> scoreboards = game.getScoreboards();
        if (scoreboards == null) {
            scoreboards = List.of(scoreboard);
        } else {
            scoreboards.add(scoreboard);
        }

        game.setScoreboards(scoreboards);
        game.setNumberOfPlayers(game.getNumberOfPlayers() + 1);
        game.setNumberOfRounds(game.getNumberOfRounds() + 2);
        return game;
    }

    @Transactional
    public Game updateGame(Game game) {
        addNewPlayer(game);
        save(game);
        return game;
    }

    @Transactional
    public Game exitGame(Game game) {
        Scoreboard duplicado = scoreboardService.findByUsername(userService.findCurrentUser().getUsername());
        if (duplicado != null) {
            List<Scoreboard> scoreboards = game.getScoreboards();
            for (Scoreboard s : scoreboards) {
                if (s.getId() == duplicado.getId()) {
                    List<Card> cartasExtra = userService.findCurrentUser().getMazo();
                    List<Card> cartas = game.getCards();
                    cartas.addAll(cartasExtra);
                    game.setCards(cartas);
                    scoreboards.remove(s);
                    game.setNumberOfPlayers(game.getNumberOfPlayers() - 1);
                    game.setNumberOfRounds(game.getNumberOfRounds() - 2);
                    break;
                }
            }
            game.setScoreboards(scoreboards);
            gameRepository.save(game);

            if (game.getNumberOfPlayers() == 0) {
                try {
                    gameRepository.deleteById(game.getId());
                } catch (Exception e) {
                    System.out.println("Error al eliminar el juego");
                }
            }
        }
        try {
            scoreboardService.deleteById(duplicado.getId());
        } catch (Exception e) {
            System.out.println("Error al eliminar el scoreboard");
        }
        return game;
    }

    // Funciones Juego
    @Transactional
    public Game startGame(Game game) {
        if (game.getIsStarted()) {
            return game;
        }
        Round round = new Round();
        round.setRoundNumber(1);
        roundService.save(round);
        List<Round> rounds = game.getRounds();
        if (rounds == null) {
            rounds = List.of(round);
        } else {
            rounds.removeIf(r -> r.getRoundNumber() == round.getRoundNumber());
            rounds.add(round);
        }

        User user = userService.findCurrentUser();
        if (game.getCreator() == user.getUsername()) {
            user.setIsNarrator(true);
        }
        userService.saveUser(user);

        game.setRounds(rounds);
        game.setIsStarted(true);
        save(game);
        return game;
    }

    @Transactional
    public Game sendTheme(Game game, String theme) {
        Round round = game.getRounds().get(game.getRounds().size() - 1);
        round.setTheme(theme);
        roundService.save(round);

        List<Round> rounds = game.getRounds();
        rounds.removeIf(r -> r.getRoundNumber() == round.getRoundNumber());
        rounds.add(round);

        game.setRounds(rounds);
        save(game);
        return game;
    }

    @Transactional
    public Game sendCardOption(Game game, Card card) {
        User user = userService.findCurrentUser();
        user.setCartaElegida(card);
        userService.saveUser(user);

        Round round = game.getRounds().get(game.getRounds().size() - 1);
        List<Card> selectedCards = round.getSelectedCards();
        selectedCards.add(card);
        round.setSelectedCards(selectedCards);
        roundService.save(round);
        save(game);
        return game;
    }

    @Transactional
    public Game sendCorrectCard(Game game, Card card) {
        User user = userService.findCurrentUser();
        user.setCartaElegida(card);
        userService.saveUser(user);

        Round round = game.getRounds().get(game.getRounds().size() - 1);
        round.setCorrectCard(card);
        List<Card> selectedCards = round.getSelectedCards();
        selectedCards.add(card);
        round.setSelectedCards(selectedCards);
        roundService.save(round);
        save(game);
        return game;
    }

    @Transactional
    public Game setVotes(Game game, Integer card) {
        User user = userService.findCurrentUser();
        user.setCartaSeleccionada(cardService.findCardById(card));
        userService.saveUser(user);

        Round round = game.getRounds().get(game.getRounds().size() - 1);
        Map<Integer, Integer> scores = round.getVotes();

        scores.merge(card, 1, Integer::sum);

        round.setVotes(scores);
        roundService.save(round);

        save(game);
        return game;
    }

    @Transactional
    public Game setScores(Game game) {
        Boolean cartaAcertada = false;
        Round round = game.getRounds().get(game.getRounds().size() - 1);
        Map<Integer, Integer> votes = round.getVotes();
        List<Scoreboard> scoreboards = game.getScoreboards();

        for (Scoreboard s : scoreboards) {
            Integer total = s.getScore();
            if (votes.containsKey(s.getUser().getCartaElegida().getId())) {
                total += votes.get(s.getUser().getCartaElegida().getId());
            }
            if (s.getUser().getCartaSeleccionada() == round.getCorrectCard()) {
                total += 3;
                cartaAcertada = true;
            }
            if (!cartaAcertada) {
                if (s.getUser().getCartaElegida() != round.getCorrectCard() && !s.getUser().getIsNarrator()) {
                    total += 2;
                }
            } else {
                if (s.getUser().getIsNarrator()) {
                    total += 3;
                }
            }

            s.setScore(total);
            scoreboardService.save(s);
        }
        game.setScoreboards(scoreboards);

        // Cambio de Ronda
        User user = userService.findCurrentUser();
        user.setCartaElegida(null);
        user.setCartaSeleccionada(null);
        userService.saveUser(user);

        Scoreboard oldNarrator = game.getScoreboards().stream().filter(s -> s.getUser().getIsNarrator()).findFirst().get();
        User oldUser = oldNarrator.getUser();
        oldUser.setIsNarrator(false);
        userService.saveUser(oldUser);

        Scoreboard narrator = game.getScoreboards().stream().filter(s -> s.getOrden() == game.getRounds().size() + 1).findFirst().get();
        User userNew = narrator.getUser();
        userNew.setIsNarrator(true);
        userService.saveUser(userNew);

        Round newRound = new Round();
        newRound.setRoundNumber(game.getRounds().size() + 1);
        newRound.setVotes(null);
        roundService.save(newRound);
        List<Round> rounds = game.getRounds();
        rounds.add(newRound);
        game.setRounds(rounds);

        save(game);
        return game;
    }

    @Transactional
    public Game endGame(Game game) {
        List<Scoreboard> scoreboards = game.getScoreboards();
        for (Scoreboard s : scoreboards) {
            User user = s.getUser();
            user.setIsNarrator(false);
            userService.saveUser(user);
        }
        game.setScoreboards(null);
        game.setRounds(null);
        game.setCards(null);
        game.setIsStarted(false);
        game.setNumberOfPlayers(0);
        game.setNumberOfRounds(0);
        save(game);
        return game;
    }
}