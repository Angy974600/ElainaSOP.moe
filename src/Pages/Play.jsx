import { useEffect, useState } from "react";
import ImageCard from "../ImageCard"; // assicurati che il percorso sia corretto
import { useNavigate } from "react-router-dom";

export default function Play() {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);  // Aggiungi lo stato di caricamento
  const [error, setError] = useState(null);  // Stato per eventuali errori
  const navigate = useNavigate();
  useEffect(() => {
    const fetchImages = () => {
      fetch("http://localhost:8000/images")
        .then((res) => {
          if (!res.ok) throw new Error("Errore nel recupero delle immagini");
          return res.json();
        })
        .then((data) => {
          setImages(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Tentativo fallito, riprovo...", err);
          setError(err.message);
          setTimeout(fetchImages, 3000); // Riprova dopo 3 secondi
        });
    };
  
    fetchImages(); // Esegui la prima volta
  }, []);
  const handleVote = (vote) => {
    const current = images[index];
    setResults([...results, { ...current, vote }]);

    if (index + 1 < images.length) {
      setIndex(index + 1);
    } else {
      navigate("/results", { state: { results } });
    }
  };

  const currentImage = images[index];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <img
        src="/logo.png"
        alt="ElainaSOP Logo"
        className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-4"
      />
      {/* <h1 className="text-5xl mb-10 font-Ultra">Elainabot</h1> */}
      <h1 className="text-5xl  mb-10 font-Ultra" style={{ wordSpacing: '0.10em' }}>
        Smash or Pass
      </h1>

      {/* Gestione dello stato di caricamento */}
      {loading && <p>Loading...</p>} 
      {/* {error && <p className="text-red-500">{error}</p>} */}

      {currentImage ? (
        <ImageCard image={currentImage} onVote={handleVote} />
      ) : (
        !loading && !error && <p>Non ci sono immagini da mostrare</p>
      )}

        <button
            className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-Ultra"
            onClick={() => navigate("/")}
        >
            Home
        </button>
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
