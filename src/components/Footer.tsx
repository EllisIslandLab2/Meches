export default function Footer() {
  return (
    <footer className="bg-amber-900 text-amber-50 text-center py-8 border-t-4 border-amber-700">
      <div className="max-w-6xl mx-auto px-5">
        <div className="mb-4">
          <p className="mb-1">Location: Painesville OH</p>
          <p>Email: <a href="mailto:Mechescreations0@gmail.com" className="text-yellow-300 hover:text-yellow-100 underline transition-colors">Mechescreations0@gmail.com</a></p>
        </div>
        <p className="mb-2">&copy; 2024 Meche's Handmade Crafts. All rights reserved.</p>
        <p className="text-sm text-amber-200">Website created by <a href="https://www.weblaunchacademy.com" target="_blank" rel="noopener noreferrer" className="text-yellow-300 hover:text-yellow-100 underline transition-colors">Web Launch Academy</a> LLC with Claude AI</p>
      </div>
    </footer>
  );
}