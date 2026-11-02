import React, { useState, useEffect, useMemo } from "react";

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [start, setStart] = useState(0);

  const VISIBLE = 30;

  function uploadPhotos(e) {
    const files = Array.from(e.target.files)
      .filter(file => file.type.startsWith("image/"));

    setPhotos(old => {
      old.forEach(photo => URL.revokeObjectURL(photo.url));

      return files.map((file, index) => ({
        id: `${file.name}-${index}`,
        name: file.name,
        url: URL.createObjectURL(file)
      }));
    });

    setStart(0);
    setSelected(null);
  }

  useEffect(() => {
    return () => {
      photos.forEach(photo => URL.revokeObjectURL(photo.url));
    };
  }, [photos]);

  const visiblePhotos = useMemo(
    () => photos.slice(start, start + VISIBLE),
    [photos, start]
  );

  function navigate(direction) {
    if (selected === null) return;

    setSelected(old =>
      (old + direction + photos.length) % photos.length
    );
  }

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "Escape") setSelected(null);
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected, photos.length]);

  return (
    <main className="app">
      <h1>📸 Virtual Photo Browser</h1>
      <p>Browse your photo collection smoothly</p>

      <label className="upload">
        Select Photos
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={uploadPhotos}
        />
      </label>

      <h3>
        Total Photos: {photos.length} |
        Rendered: {visiblePhotos.length}
      </h3>

      <div className="gallery">
        {visiblePhotos.map((photo, index) => (
          <img
            key={photo.id}
            src={photo.url}
            alt={photo.name}
            loading="lazy"
            onClick={() => setSelected(start + index)}
          />
        ))}
      </div>

      {photos.length > VISIBLE && (
        <div className="pagination">
          <button
            disabled={start === 0}
            onClick={() => setStart(Math.max(0, start - VISIBLE))}
          >
            Previous Photos
          </button>

          <button
            disabled={start + VISIBLE >= photos.length}
            onClick={() => setStart(start + VISIBLE)}
          >
            Next Photos
          </button>
        </div>
      )}

      {selected !== null && photos[selected] && (
        <div className="viewer">
          <button className="close" onClick={() => setSelected(null)}>
            ✕
          </button>

          <button onClick={() => navigate(-1)}>❮</button>

          <img
            src={photos[selected].url}
            alt={photos[selected].name}
          />

          <button onClick={() => navigate(1)}>❯</button>
          <p>{photos[selected].name}</p>
        </div>
      )}
    </main>
  );
}
   
  
