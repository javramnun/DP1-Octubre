package org.springframework.samples.petclinic.card;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class CardService{

    CardRepository cardRepository;
    

    @Autowired
    CardService(CardRepository cardRepository){
        this.cardRepository = cardRepository;
    }

    public List<Card> findAll(){
        return cardRepository.findAll();
    }

    public Card findCardById(int cardId){
        return cardRepository.findById(cardId);
    }

    public void saveCard(Card card){
        cardRepository.save(card);
    }

}