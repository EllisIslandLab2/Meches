import WLABadge from "./WLABadge";

export default function Footer() {
  return (
    <footer className="bg-stone-700 text-stone-50 py-8 border-t-4 border-stone-600">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          {/* Left side - Contact info */}
          <div className="text-left">
            <p className="mb-1">Location: Painesville OH</p>
            <p>Email: <a href="mailto:Mechescreations0@gmail.com" className="text-amber-200 hover:text-amber-100 underline transition-colors">Mechescreations0@gmail.com</a></p>
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