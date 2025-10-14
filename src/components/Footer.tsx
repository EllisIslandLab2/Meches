export default function Footer() {
  return (
    <footer className="bg-amber-900 text-amber-50 py-8 border-t-4 border-amber-700">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Left side - Contact info */}
          <div className="text-left">
            <p className="mb-1">Location: Painesville OH</p>
            <p>Email: <a href="mailto:Mechescreations0@gmail.com" className="text-yellow-300 hover:text-yellow-100 underline transition-colors">Mechescreations0@gmail.com</a></p>
          </div>

          {/* Right side - Rights and creator info */}
          <div className="text-left md:text-right">
            <p className="mb-2">&copy; 2024 Meche's Handmade Crafts. All rights reserved.</p>
            <p className="text-base">Website created by <a href="https://www.weblaunchacademy.com" target="_blank" rel="noopener noreferrer" className="text-yellow-300 hover:text-yellow-100 underline transition-colors">Web Launch Academy LLC</a> with Claude AI</p>
          </div>
        </div>
      </div>
    </footer>
  );
}