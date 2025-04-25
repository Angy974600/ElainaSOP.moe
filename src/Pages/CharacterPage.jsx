import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGlobal } from "./context/GlobalContext";


export default function CharacterPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, character_id } = location.state || {};
  const [images, setImages] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const { allowNSFW } = useGlobal();

  useEffect(() => {
    if (character_id) {
      fetch(`http://localhost:8000/images_by_character?name=${character_id} &nsfw=${allowNSFW ? 1 : 0}`)
        .then((res) => res.json())
        .then((data) => setImages(data));
    }
  }, [character_id]);

  if (!character_id) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl">❌ Nessun personaggio selezionato.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 justify-center flex flex-col items-center">
      <img
        src="/logo.png"
        alt="ElainaSOP Logo"
        className="w-32 h-32 rounded-full border-4 border-white shadow-lg mb-6"
      />
      <h1 className="text-4xl font-Ultra text-center mb-8">Immagini di {name}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <div key={i} className="cursor-pointer">
            <img
              src={img.url}
              alt={img.name}
              className="rounded-xl object-cover w-full h-48"
              onClick={() => setModalImage(img)}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-10">
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl shadow-lg font-Ultra"
          onClick={() => navigate("/search")}
        >
          Torna alla ricerca
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
    </div>
  );
}
