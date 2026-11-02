import React, { useState } from "react";

export default function App() {
  const [photos, setPhotos] = useState([]);

  function uploadPhotos(e) {
    const files = Array.from(e.target.files);
    setPhotos(files.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name
    })));
  }

  return (
    <div className="app">
      <h1>📸 Virtual Photo Gallery</h1>
      <p>Explore your favourite photos</p>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={uploadPhotos}
      />

      <div className="gallery">
        {photos.map((photo, index) => (
          <img key={index} src={photo.url} alt={photo.name} />
        ))}
      </div>
    </div>
  );
}
