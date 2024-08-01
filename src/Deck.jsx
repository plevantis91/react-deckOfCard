import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";


const API_URL = "https://deckofcardsapi.com/api/deck";
 
const Deck = () => {
 const [deck, setDeck] = useState(null);
 const [draw, setDraw] = useState([]);
 const [isShuffling, setIsShuffling] = useState(false);
 

    useEffect(() => {
    async function getDeck() {
        const res = await axios.get(`${API_URL}/new/shuffle/`);
        setDeck(res.data);
    }
    getDeck();
    }, []);


// Draw a card from the deck
const drawCard = async () => {
    try{
        const res = await axios.get(`${API_URL}/${deck.deck_id}/draw/`);
        if(res.data.remaining === 0) {
            throw new Error("No cards remaining!");
        }
        const card = res.data.cards[0];
        setDraw(d => [
            ...d,
            {
                id: card.code,
                name: `${card.value} of ${card.suit}`,
                image: card.image
            }
        ]);
    }
    catch(err) {
        alert(err);
    }
}

// Shuffle the deck
const shuffleDeck = async () => {
    setIsShuffling(true);
    try{
        await axios.get(`${API_URL}/${deck.deck_id}/shuffle/`);
        setDraw([]);
    }
    catch(err) {
        alert(err);
    }
    finally {
        setIsShuffling(false);
    }
}

// Render the draw button
const renderDrawBtn = () => {
        return (
            <button onClick={drawCard} disabled={isShuffling || !deck}>
                GIMME A CARD!
            </button>
        );
}

// Render the shuffle button
const renderShuffleBtn = () => {
    return (
        <button onClick={shuffleDeck} disabled={isShuffling}>
            Shuffle the deck
        </button>
    );
}

// Render the cards
const renderCards = () => {
    return draw.map(card => (
        <Card key={card.id} name={card.name} image={card.image} />
    ));
}


// Render the deck
return (
    <main className="Deck-container">
        <h1>Card Dealer</h1>
        {renderDrawBtn()}
        {renderShuffleBtn()}
        <div className="Deck-cardarea">{renderCards()}</div>
    </main>
);
}


export default Deck;