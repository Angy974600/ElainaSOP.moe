const ImageCard = ({ image, onVote }) => {
  if (!image) return <div>Caricamento...</div>;

  return (
    <div className="bg-white text-black rounded-2xl shadow-xl p-4 max-w-xs w-full text-center mx-auto">
      <img
        src={image.url}
        alt={image.name}
        className="rounded-xl mb-4 w-full min-h-full object-cover mx-auto" // Modifica qui per ridimensionare
      />
      <h2 className="text-3xl mb-4 font-Ultra">{image.name}</h2>
      <div className="flex justify-around">
        <button
          onClick={() => onVote("smash")}
          className="bg-green-400 hover:bg-green-600 text-white px-4 py-2 rounded-xl shadow font-Ultra"
        >
          Smash 💥
        </button>
        <button
          onClick={() => onVote("pass")}
          className="bg-red-400 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow font-Ultra"
        >
          Pass ❌
        </button>
      </div>
    </div>
  );
};

export default ImageCard;
