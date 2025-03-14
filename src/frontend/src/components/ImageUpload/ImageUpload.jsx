import React, { useState } from "react";
import "./ImageUpload.scss";
import { X } from "lucide-react";

const ImageUpload = ({ onImagesChange }) => {
  const [images, setImages] = useState([]);
  const maxImages = 5;

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const validImages = files.filter((file) =>
      ["image/png", "image/jpeg", "image/jpg"].includes(file.type)
    );

    if (validImages.length === 0) {
      alert("Formato non supportato. Seleziona solo PNG o JPG.");
      return;
    }

    // Controlla se il numero totale di immagini supererebbe il limite
    if (images.length + validImages.length > maxImages) {
      alert(`Puoi caricare al massimo ${maxImages} immagini.`);
      return;
    }

    const imagePreviews = validImages.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    const newImages = [...images, ...imagePreviews];
    setImages(newImages);
    onImagesChange(newImages.map((img) => img.file));
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages.map((img) => img.file));
  };

  return (
    <div className="image-upload-container">
      <label className="upload-box">
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          multiple
          onChange={handleImageChange}
          hidden
        />
        <span>+ Aggiungi Foto</span>
      </label>

      {images.length > 0 && (
        <div className="image-preview-container">
          {images.map((image, index) => (
            <div key={index} className="image-preview">
              <img src={image.preview} alt={`preview ${index}`} />
              <button className="remove-btn" onClick={() => removeImage(index)}>
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
