import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results || [];

  const [modalImage, setModalImage] = useState(null);

  const smash = results.filter(r => r.vote === "smash");
  const pass = results.filter(r => r.vote === "pass");

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6  text-center ">
        {/* Logo centrato */}
        <div className="flex justify-center mb-10">
        <img
        src="/logo.png"
        alt="ElainaSOP Logo"
        className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-4"
      />
        </div>
      <h1 className="text-5xl text-center font-Ultra mb-6">Results</h1>

      <div className="flex justify-between gap-8">
        {/* Smash */}
        <div className="w-1/2 bg-gray-600 p-4 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-green-400 mb-4">💚 Smash</h2>
          <div className="grid grid-cols-3 gap-4">
            {smash.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={img.name}
                className="h-24 w-full object-cover rounded-md cursor-pointer"
                onClick={() => setModalImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Pass */}
        <div className="w-1/2 bg-gray-600 p-4 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-red-400 mb-4">❌ Pass</h2>
          <div className="grid grid-cols-3 gap-4">
            {pass.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={img.name}
                className="h-24 w-full object-cover rounded-md cursor-pointer"
                onClick={() => setModalImage(img)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex space-x-5 justify-center p-8 "> {/* Aggiungi spazio orizzontale tra i bottoni */}
        <button
            className="bg-purple-500 hover:bg-purple-600 text-white text-xl px-8 py-4 rounded-2xl shadow-md transition font-Ultra"
            onClick={() => navigate("/")}
        >
            Home
        </button>
        <button
            className="bg-green-500 hover:bg-green-600 text-white text-xl px-8 py-4 rounded-2xl shadow-md transition font-Ultra"
            onClick={() => navigate("/play")}
        >
            Play again
        </button>
        </div>

      {/* Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage.url}
            alt={modalImage.name}
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-xl"
          />
        </div>
      )}
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
