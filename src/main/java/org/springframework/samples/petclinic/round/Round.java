package org.springframework.samples.petclinic.round;

import java.util.List;
import java.util.Map;

import org.springframework.samples.petclinic.card.Card;
import org.springframework.samples.petclinic.model.BaseEntity;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "rounds")
public class Round extends BaseEntity{
    
    @NotNull
    private Integer roundNumber;
    
    private String theme;

    @ElementCollection
    private Map<Integer, Integer> votes;

    @OneToMany
    private List<Card> selectedCards;

    @OneToOne
    private Card correctCard;
}
