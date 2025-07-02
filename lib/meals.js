import fs from "node:fs";           // Dosya işlemleri (resim kaydetmek için)
import sql from "better-sqlite3";   // SQLite veritabanı
import slugify from "slugify";      // URL-friendly slug oluşturma
import xss from "xss";              // XSS güvenlik koruması

// -----------  DB'ye erismek icin gereken kod  -----------

// Veritabanı bağlantısı
const db = sql("meals.db");

// Direk data dnuyor bundan, baska sorguya vs gerek yok, bu fonksiyonu cagir yeter
export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // JavaScript'te 2 saniye bekletme (delay) kodu

  // throw new Error("Database bağlantı hatası!"); // error simulation
  return db.prepare("SELECT * FROM meals").all();
}

export function getMeal(slug) {
  return db.prepare("SELECT * FROM meals WHERE slug=?").get(slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true }); // Yemek başlığından URL-friendly slug oluşturuyor. Neden: URL'lerde kullanmak için
  meal.instructions = xss(meal.instructions); // Tarif talimatlarındaki tehlikeli HTML kodları temizliyor. Neden: Güvenlik (XSS saldırılarını önlemek)

  // meal.image icin
  const extension = meal.image.name.split(".").pop(); // "png"
  const fileName = `${meal.slug}.${extension}`; // "creamy-tomato-pasta.png"
  const stream = fs.createWriteStream(`public/images/${fileName}`); // Stream oluştur (dosya henüz yok)
  const bufferedImage = await meal.image.arrayBuffer(); // File objesini binary data'ya çeviriyor - Ham binary data - resmin 1'ler ve 0'lardan oluşan gerçek içeriği:
  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error("Saving image failed.");
    }
  }); // Image dosyaya kaydedildi

  meal.image = `/images/${fileName}`; // File objesinden => String path (dosya yolu)

  db.prepare(
    `
    INSERT INTO meals 
    (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (
    @title,
    @summary,
    @instructions,
    @creator,
    @creator_email,
    @image,
    @slug       
)
  `).run(meal);
}
