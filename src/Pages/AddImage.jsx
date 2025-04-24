import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import ImageCard from "../ImageCard";
export default function AddImage() {
//   const navigate = useNavigate();
  const [character_id, setCharacter_id] = useState(null);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [tagOptions] = useState([ "Vanilla","Feet", "Sex", "Real", "AI"]);
  const [suggestions, setSuggestions] = useState([]);
  const [artist, setArtist] = useState("");
  const [artistSocial, setArtistSocial] = useState("");
  const [isNSFW, setIsNSFW] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");
  const [tags, setTags] = useState([]);
  const [suggestionsFetched, setSuggestionsFetched] = useState(false); 
  const navigate = useNavigate();
  const dummyImage = {
    name: name || "Preview",
    url: url,
  };
  const addTag = () => {
    if (selectedTag && !tags.includes(selectedTag)) {
        setTags([...tags, selectedTag]); // Aggiungi il tag all'array tags
        setSelectedTag(""); // Reset del campo di input tag
      }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };
  useEffect(() => {
    if (name.length > 2 && !suggestionsFetched) {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(`http://localhost:8000/characters?query=${name}`);
          const data = await response.json();
          setSuggestions(data); // ogni oggetto ha character_id e name
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
    setName(suggestion.name); // Mostra il nome nel campo input
    setCharacter_id(suggestion.mal_id); // Salva l'ID da usare nella chiamata
    setSuggestions([]);
    setSuggestionsFetched(true);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      character_id: character_id,
      url: url,
      tag: JSON.stringify(tags), // Concatenare i tag separati da virgola
      artist: artist,
      snslink: artistSocial,
      nsfw: isNSFW ? 1 : 0,  // Convertire nsfw in 1 (true) o 0 (false)
    };
    console.log("Dati da inviare:", data); // Log dei dati da inviare
    try {
      const response = await fetch("http://localhost:8000/addImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Errore durante l'invio del modulo");
      }

      // Resetta i campi del form dopo l'invio
      setName("");
      setUrl("");
      setTags([]);
      setArtist("");
      setArtistSocial("");
      setIsNSFW(false);
    console.log("Response status:", response.status);
        const result = await response.json();
        console.log("Risultato:", result);
      alert("Immagine aggiunta con successo!");
    } catch (error) {
      console.error("Errore:", error);
      alert("Si è verificato un errore durante l'invio.");
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 pt-10 pb-8">
      {/* Logo centrato */}
      <div className="flex justify-center mb-10">
        <img
          src="/logo.png"
          alt="ElainaSOP Logo"
          className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
        />
      </div>
      <h1 className="text-3xl font-bold mb-4 font-Ultra text-center self-center ">Add Image</h1>

      <div className="flex flex-col md:flex-row justify-center items-stretch gap-10">
        {/* Preview immagine */}
        <div className="md:w-1/2 w-full flex items-center justify-center">
            {url ? (
            <ImageCard image={dummyImage} onVote={() => {}} />
            ) : (
                <p className="text-gray-400">Anteprima immagine qui</p>
            )}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="md:w-1/2 w-full bg-gray-800 p-6 rounded-lg shadow-md space-y-4"
        >
          

          {/* <div>
            <label className="block mb-1 font-bold">Character Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div> */}
          <div className="flex flex-col">
          <label htmlFor="name" className="block mb-1 font-bold">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => {
                setName(e.target.value);
                setSuggestionsFetched(false); // Resetta lo stato di "suggestionsFetched" quando l'utente scrive
              }}
            onFocus={() => setSuggestions([])}
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Search character..."
          />
          {/* Mostra i suggerimenti quando l'utente digita */}
          {suggestions.length > 0 && !suggestionsFetched && (
            <ul className="absolute bg-white shadow-lg mt-17 p-0 rounded w-full text-xs">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)} // Chiamato al clic per selezionare un suggerimento
                  className="cursor-pointer p-2 hover:bg-gray-200 text-black"
                >
                  {suggestion.name} ({suggestion.source_title})
                </li>
              ))}
            </ul>
          )}
        </div>

          <div>
            <label className="block mb-1 font-bold">Image Url</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          {/* Nome artista */}
            <div className="mb-4">
            <label className="block mb-1 font-bold">Artist</label>
            <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white"
            />
            </div>

            {/* Social artista */}
            <div className="mb-4">
            <label className="block mb-1 font-bold">SNS Link (es. Twitter, Pixiv...)</label>
            <input
                type="url"
                value={artistSocial}
                onChange={(e) => setArtistSocial(e.target.value)}
                placeholder="https://twitter.com/nomeartista"
                className="w-full p-2 rounded bg-gray-700 text-white"
            />
            </div>
          <div>
            <label className="block mb-1 font-bold">Tag</label>
            <div className="flex items-center space-x-2">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="p-2 rounded bg-gray-700 text-white flex-grow"
              >
                <option value="">-- Select tags --</option>
                {tagOptions.map((tag, idx) => (
                  <option key={idx} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded"
              >
                +
              </button>
            </div>
          </div>
          {/* Checkbox NSFW */}
        <div className="flex items-center gap-2">
        <input
            type="checkbox"
            id="nsfw"
            checked={isNSFW}
            onChange={(e) => setIsNSFW(e.target.checked)}
            className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
        />
        <label htmlFor="nsfw" className="block mb-1 font-bold">NSFW</label>
        </div>          

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <div
                  key={idx}
                  className="bg-purple-600 px-3 py-1 rounded-full flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-sm text-white hover:text-red-300"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold mt-4"
          >
            Invia
          </button>
        </form>
        
      </div>
      <div className="w-full flex justify-center mt-6">
        <button
              className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-Ultra"
              onClick={() => navigate("/")}
          >
              Home
          </button>
        </div>
        <div className=" text-sm pt-9 text-white text-center ">
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
