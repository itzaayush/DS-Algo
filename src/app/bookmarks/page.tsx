import type { Metadata } from "next";
import { BookmarksView } from "@/components/bookmarks/bookmarks-view";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "Your saved lessons, patterns, and practice problems.",
};

export default function BookmarksPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Bookmarks</h1>
        <p className="mt-2 text-muted">Everything you've saved, in one place and synced to your account.</p>
      </header>
      <BookmarksView />
    </div>
  );
}
