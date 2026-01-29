import Image from "next/image";

export default function WLABadge() {
  return (
    <a
      href="https://weblaunchacademy.com"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block no-underline"
    >
      <div className="inline-flex items-center bg-gradient-to-r from-slate-900 to-slate-950 h-10 px-3 pl-11 rounded-md relative border-l-4 border-yellow-400 transition-shadow duration-300 hover:shadow-[0_0_25px_rgba(255,219,87,0.8)] cursor-pointer">
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-8 h-8">
          <Image
            src="/wla-logo.webp"
            alt="WLA Logo"
            width={32}
            height={32}
            className="rounded-full"
            priority={false}
          />
        </div>
        <div className="flex flex-col leading-tight ml-2">
          <span className="text-white text-xs font-semibold font-system">
            Built with
          </span>
          <span className="text-yellow-400 text-xs font-bold font-system">
            Web Launch Academy
          </span>
        </div>
      </div>
    </a>
  );
}
