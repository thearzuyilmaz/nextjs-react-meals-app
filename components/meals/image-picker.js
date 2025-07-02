"use client";

import classes from "./image-picker.module.css";
import { useRef, useState } from "react";
import Image from "next/image";

export default function ImagePicker({ label, name }) {
  const imageRef = useRef();
  const [pickedImage, setPickedImage] = useState(null); // to show the selected image name

  function handleClick() {
    imageRef.current.click();
  }

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) {
      setPickedImage(null); // Dosya yoksa temizle
      return;
    }

    const fileReader = new FileReader(); // 1. FileReader objesi oluştur

    // 2. "Okuma bitince şunu yap" talimatı ver - CALLBACK
    // onload tanımı okuma başlamadan ÖNCE yapılmalı - yoksa event'i kaçırırsın!
    // ÖNCE "okuma bitince ne yapacağımı" söyle
    fileReader.onload = () => {
      setPickedImage(fileReader.result); // Bu ŞIMDI çalışmaz! - Base64 URL (resim göstermek için)
    };

    fileReader.readAsDataURL(file); // 3. Okumaya başla (asenkron) - Dosyayı Base64'e çevir
  }
  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickedImage && <p>No image picked yet.</p>}
          {pickedImage && (
            <Image
              src={pickedImage}
              alt="The image selected by the user."
              fill
            />
          )}
        </div>
      </div>
      <div className={classes.controls}>
        <input
          ref={imageRef}
          className={classes.input}
          type="file"
          id={name}
          accept="image/png, image.jpeg"
          name={name}
          onChange={handleImageChange}
          required
        ></input>
        <button className={classes.button} type="button" onClick={handleClick}>
          Pick an Image
        </button>
      </div>
    </div>
  );
}
