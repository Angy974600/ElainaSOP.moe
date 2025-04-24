import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function Search() {
  const [name, setName] = useState("");
  const [character_id, setCharacter_id] = useState(null);
  const [suggestionsFetched, setSuggestionsFetched] = useState(false); 
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (name.length > 2 && !suggestionsFetched) {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(`http://localhost:8000/characters?query=${name}`);
          const data = await response.json();
          setSuggestions(data);
        } catch (error) {
          console.error("Errore durante il recupero dei personaggi", error);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [name, suggestionsFetched]);

  const handleSuggestionClick = (suggestion) => {
    setName(suggestion.name);
    setCharacter_id(suggestion.mal_id);
    setSuggestions([]);
    setSuggestionsFetched(true);
  };

  const handleConfirm = () => {
    if (character_id) {
      navigate("/character", {
        state: {
          character_id,
          name
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <img
        src="/logo.png"
        alt="ElainaSOP Logo"
        className="w-32 h-32 rounded-full border-4 border-white shadow-lg mb-6"
      />
      
      <div className="flex flex-col relative w-72">
        <h1 className="text-4xl font-Ultra text-center mb-8">Database</h1>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSuggestionsFetched(false);
          }}
          onFocus={() => setSuggestions([])}
          className="w-full p-2 rounded bg-gray-700 text-white"
          placeholder="Character Name..."
        />
        {suggestions.length > 0 && !suggestionsFetched && (
          <ul className="absolute bg-white shadow-lg mt-12 p-0 rounded w-full text-xs z-10">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="cursor-pointer p-2 hover:bg-gray-200 text-black"
              >
                {suggestion.name} ({suggestion.source_title})
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex space-x-6">
              {/* Pulsante di conferma */}
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-Ultra"
        onClick={handleConfirm}
        disabled={!character_id}
      >
       Search
      </button>

      {/* Pulsante Home */}
      <button
        className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-Ultra"
        onClick={() => navigate("/")}
      >
        Home
      </button>
      </div>
      <div className="absolute bottom-4 text-sm text-white text-center">
        <p>Made by <span className="font-bold">Angy</span> and <span className="font-bold">Gynaa</span></p>
        <a 
          href="https://discord.com/api/oauth2/authorize?client_id=1098560967698292796&permissions=140123663552&scope=bot%20applications.commands" // Sostituisci con il link corretto per il tuo bot
          target="_blank" 
          rel="noopener noreferrer"
          className="text-purple-500 hover:text-purple-400"
        >
          Add Elainabot to your Discord server now!
        </a>
      </div>
    </div>
    
  );
}
