import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Settings } from 'lucide-react'; // Assicurati di avere installato lucide-react
import { useGlobal } from "./context/GlobalContext";

export default function Home() {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const { allowNSFW, setAllowNSFW } = useGlobal();

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gray-900 text-center p-4">
      
      {/* Icona Impostazioni */}
      <div className="absolute top-4 right-4 cursor-pointer z-20" onClick={() => setShowSettings(!showSettings)}>
        <Settings className="w-6 h-6 text-white" />
      </div>

      {/* Pannello Impostazioni */}
      {showSettings && (
        <div className="absolute top-14 right-4 bg-white text-black p-4 rounded-xl shadow-lg w-64 z-10">
          <h2 className="text-lg font-bold mb-2">⚙️ Impostazioni</h2>
          <div className="flex items-center justify-between">
            <span>Allow NSFW</span>
            <input
              type="checkbox"
              checked={allowNSFW}
              onChange={() => setAllowNSFW(!allowNSFW)}
              className="accent-pink-600"
            />
          </div>
        </div>
      )}

      {/* Logo e Titolo */}
      <img
        src="/logo.png"
        alt="ElainaSOP Logo"
        className="w-32 h-32 rounded-full border-4 border-white shadow-lg mb-6"
      />
      <h1 className="text-5xl mb-10 text-white font-Ultra">ElainaSOP</h1>

      {/* Pulsanti Navigazione */}
      <div className="flex space-x-6">
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white text-xl px-8 py-4 rounded-2xl shadow-md transition font-Ultra"
          onClick={() => navigate("/search")}
        >
          🔍 Search
        </button>
        <button
          className="bg-purple-500 hover:bg-purple-600 text-white text-xl px-8 py-4 rounded-2xl shadow-md transition font-Ultra"
          onClick={() => navigate("/add")}
        >
          ➕ Add Image
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white text-xl px-8 py-4 rounded-2xl shadow-md transition font-Ultra"
          onClick={() => navigate("/play")}
        >
          💥 SMASH OR PASS
        </button>
      </div>

      {/* Credits */}
      <div className="absolute bottom-4 text-sm text-white">
        <p>Made by <span className="font-bold">Angy</span> and <span className="font-bold">Gynaa</span></p>
        <a 
          href="https://discord.com/api/oauth2/authorize?client_id=1098560967698292796&permissions=140123663552&scope=bot%20applications.commands"
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
