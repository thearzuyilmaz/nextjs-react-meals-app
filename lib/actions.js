"use server";

import { saveMeal } from "./meals";
import { redirect } from "next/navigation";

function isInvalidText(text) {
  return !text || text.trim() === "";
}

export async function shareMeal(prevState, formData) {
  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
  };

  // Server side input validation
  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes("@") ||
    !meal.image ||
    meal.image.size === 0
  ) {
    // throw new Error("Invalid input");
    return {
      sucess: false,
      message: "Invalid input.",
    };
  }

  console.log(meal);
  await saveMeal(meal); // Veritabanına kaydet
  revalidatePath('/meals');  // /meals sayfasının cache'ini temizle
  redirect("/");
}
