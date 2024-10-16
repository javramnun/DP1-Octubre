package org.springframework.samples.petclinic.game;

import java.util.List; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.samples.petclinic.card.CardService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
 
@RestController
@RequestMapping("/api/v1/games")
@SecurityRequirement(name = "bearerAuth")
public class GameController {  

    private GameService gameService;
    private CardService cardService;

    @Autowired
    public GameController(GameService gameService, CardService cardService) {
        this.gameService = gameService;
        this.cardService = cardService;
    }

    //Display
    @Transactional
    @GetMapping("/gameListing")
    public List<Game> showGameListing() {
        return gameService.findAll();
    }

    @Transactional
    @PostMapping("/new")
    public Game newGame() {
        return gameService.createGame();
    }

    @Transactional
    @PutMapping(value= "{id}/join")
    public Game joinGame(@PathVariable int id) {
        return gameService.updateGame(gameService.findById(id)); 
    }

    @Transactional
    @GetMapping(value = "{id}")
    public Game showGame(@PathVariable int id) {
        return gameService.findById(id);
    }

    @Transactional
    @PutMapping(value = "{id}/exit")
    public Game exitGame(@PathVariable int id) {
        return gameService.exitGame(gameService.findById(id));
    }

    //Partida
    @Transactional
    @PostMapping(value = "{id}/play")
    public Game playGame(@PathVariable int id) {
        return gameService.startGame(gameService.findById(id));
    }

    @Transactional
    @PutMapping(value = "{id}/theme/{theme}")
    public Game changeTheme(@PathVariable int id, @PathVariable String theme) {
        return gameService.sendTheme(gameService.findById(id), theme);
    }

    @Transactional
    @PutMapping(value = "{id}/card/{cardId}")  
    public Game playCard(@PathVariable int id, @PathVariable int cardId) {
        return gameService.sendCorrectCard(gameService.findById(id), cardService.findCardById(cardId));
    }
 
    @Transactional
    @PutMapping(value = "{id}/extraCard/{cardId}")
    public Game playExtraCard(@PathVariable int id, @PathVariable int cardId) {
        return gameService.sendCardOption(gameService.findById(id), cardService.findCardById(cardId));
    }

    @Transactional
    @PostMapping(value = "{id}/vote/{cardId}")
    public Game voteCard(@PathVariable int id, @PathVariable int cardId) { 
        return gameService.setVotes(gameService.findById(id), cardId);
    }

    @Transactional
    @PutMapping(value = "{id}/score")
    public Game scoreGame(@PathVariable int id) {
        return gameService.setScores(gameService.findById(id));
    }

    @Transactional
    @PutMapping(value = "{id}/end")
    public Game endGame(@PathVariable int id) {
        return gameService.endGame(gameService.findById(id));
    }
}