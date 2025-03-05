export default function Footer() {
  return (
    <footer className="bg-gray-800 py-6 text-center">
        <p className="text-gray-400">
          © {new Date().getFullYear()} WoW Characters Tracker. 
          Non affilié à Blizzard Entertainment.
        </p>
      </footer>
  );
}