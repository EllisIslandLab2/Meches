import WLABadge from "./WLABadge";

export default function Footer() {
  return (
    <footer className="bg-amber-900 text-amber-50 py-8 border-t-4 border-amber-700">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          {/* Left side - Contact info */}
          <div className="text-left">
            <p className="mb-1">Location: Painesville OH</p>
            <p>Email: <a href="mailto:Mechescreations0@gmail.com" className="text-yellow-300 hover:text-yellow-100 underline transition-colors">Mechescreations0@gmail.com</a></p>
          </div>

          {/* Right side - Rights info and WLA Badge stacked */}
          <div className="flex flex-col items-end gap-2">
            <p className="text-sm">&copy; 2024 Meche's Handmade Crafts. All rights reserved.</p>
            <WLABadge />
          </div>
        </div>
      </div>
    </footer>
  );
}