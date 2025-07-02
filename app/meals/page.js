import classes from "./page.module.css";
import Link from "next/link";
import MealsGrid from "@/components/meals/meals-grid";
import { getMeals } from "@/lib/meals";
import { Suspense } from "react";

// Data fetching part in a separate component
async function Meals() {
  const meals = await getMeals(); // getMeals() beklerken → loading.js gösterilir
  return <MealsGrid meals={meals} />;
}

export default async function MealsPage() {
  return (
    <>
      <header className={classes.header}>
        <h1>
          Delicious meals, created{" "}
          <span className={classes.highlight}>by you</span>
        </h1>
        <p>
          Choose your favorite recipe and cook it for yourself. It&apos;s easy and
          fun!
        </p>
        <p className={classes.cta}>
          <Link href="/meals/share">Share your favorite recipe</Link>
        </p>
        <main className={classes.main}>
          <Suspense fallback={<p className={classes.loading}>Meals loading...</p>}>
            <Meals />
          </Suspense>
        </main>
      </header>
    </>
  );
}
