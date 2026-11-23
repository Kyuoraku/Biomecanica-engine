import { SiteHeader } from "./SiteHeader";

export function HomePage() {
  return (
    <div className="home">
      <SiteHeader />
      <main className="home__content" />
    </div>
  );
}
