type Tile = {
  label: string;
  blurb: string;
  variant:
    | "grocery"
    | "gas"
    | "dining"
    | "travel"
    | "streaming"
    | "pharmacy";
  span?: "sm" | "md" | "lg";
};

const TILES: Tile[] = [
  {
    label: "Groceries",
    blurb: "Loblaws, Metro, Sobeys, Whole Foods",
    variant: "grocery",
    span: "lg",
  },
  {
    label: "Gas",
    blurb: "Petro-Canada, Shell, Esso",
    variant: "gas",
    span: "md",
  },
  {
    label: "Dining",
    blurb: "Cafés, restaurants, takeout, delivery",
    variant: "dining",
    span: "md",
  },
  {
    label: "Travel",
    blurb: "Air Canada, WestJet, hotels, transit",
    variant: "travel",
    span: "lg",
  },
  {
    label: "Streaming",
    blurb: "Netflix, Spotify, Crave, Disney+",
    variant: "streaming",
    span: "md",
  },
  {
    label: "Pharmacy",
    blurb: "Shoppers Drug Mart, Rexall, Pharmaprix",
    variant: "pharmacy",
    span: "md",
  },
];

function TileArt({ variant }: { variant: Tile["variant"] }) {
  switch (variant) {
    case "grocery":
      return (
        <svg viewBox="0 0 600 360" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="gGrocery" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8a1818" />
              <stop offset="100%" stopColor="#3d0606" />
            </linearGradient>
          </defs>
          <rect width="600" height="360" fill="url(#gGrocery)" />
          {Array.from({ length: 24 }).map((_, i) => (
            <circle
              key={i}
              cx={(i * 53) % 600}
              cy={120 + ((i * 31) % 200)}
              r={18 + (i % 3) * 4}
              fill={i % 2 ? "#c92a1a" : "#a31d10"}
              opacity={0.85}
            />
          ))}
          <rect width="600" height="120" y="240" fill="rgba(0,0,0,0.25)" />
        </svg>
      );
    case "gas":
      return (
        <svg viewBox="0 0 600 360" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="gGas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1f1408" />
              <stop offset="60%" stopColor="#5b3a0e" />
              <stop offset="100%" stopColor="#d99a2c" />
            </linearGradient>
          </defs>
          <rect width="600" height="360" fill="url(#gGas)" />
          <circle cx="450" cy="120" r="80" fill="#f4cf63" opacity="0.55" />
          <rect x="80" y="220" width="120" height="100" fill="#0c0805" opacity="0.7" />
          <rect x="220" y="180" width="40" height="140" fill="#0c0805" opacity="0.7" />
          <rect x="280" y="240" width="160" height="80" fill="#0c0805" opacity="0.55" />
        </svg>
      );
    case "dining":
      return (
        <svg viewBox="0 0 600 360" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="gDining" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a31818" />
              <stop offset="100%" stopColor="#460808" />
            </linearGradient>
          </defs>
          <rect width="600" height="360" fill="url(#gDining)" />
          <circle cx="300" cy="180" r="140" fill="#e0c98b" opacity="0.15" />
          <circle cx="300" cy="180" r="100" fill="#fff" opacity="0.08" />
          <circle cx="300" cy="180" r="60" fill="#7a1313" />
          <path
            d="M 220 60 q 80 -40 160 0"
            stroke="#e6cf91"
            strokeWidth="3"
            fill="none"
            opacity="0.4"
          />
        </svg>
      );
    case "travel":
      return (
        <svg viewBox="0 0 600 360" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="gTravel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#cbe1ec" />
              <stop offset="100%" stopColor="#e9eef0" />
            </linearGradient>
          </defs>
          <rect width="600" height="360" fill="url(#gTravel)" />
          {Array.from({ length: 7 }).map((_, i) => (
            <ellipse
              key={i}
              cx={80 + i * 90}
              cy={60 + (i % 3) * 30}
              rx={45}
              ry={10}
              fill="#fff"
              opacity={0.6}
            />
          ))}
          <g transform="translate(360 200) rotate(-12)">
            <path
              d="M 0 0 L 120 -10 L 160 0 L 120 10 Z"
              fill="#1a1411"
            />
            <path
              d="M 60 -8 L 90 -34 L 100 -34 L 80 -6 Z"
              fill="#1a1411"
            />
            <path
              d="M 60 8 L 90 34 L 100 34 L 80 6 Z"
              fill="#1a1411"
            />
            <path d="M 130 -4 L 158 -16 L 162 -2 L 132 0 Z" fill="#3b302a" />
          </g>
        </svg>
      );
    case "streaming":
      return (
        <svg viewBox="0 0 600 360" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="gStream" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1a1411" />
              <stop offset="100%" stopColor="#3b302a" />
            </linearGradient>
          </defs>
          <rect width="600" height="360" fill="url(#gStream)" />
          <circle cx="300" cy="180" r="60" fill="none" stroke="#f1ead8" strokeWidth="2" opacity="0.6" />
          <polygon points="285,150 285,210 335,180" fill="#f1ead8" opacity="0.85" />
          {Array.from({ length: 30 }).map((_, i) => (
            <circle
              key={i}
              cx={(i * 71) % 600}
              cy={(i * 113) % 360}
              r={1.2}
              fill="#f1ead8"
              opacity={0.4}
            />
          ))}
        </svg>
      );
    case "pharmacy":
      return (
        <svg viewBox="0 0 600 360" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="gPharm" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ece4cf" />
              <stop offset="100%" stopColor="#c9bf9f" />
            </linearGradient>
          </defs>
          <rect width="600" height="360" fill="url(#gPharm)" />
          <g transform="translate(300 180)">
            <rect x="-90" y="-22" width="180" height="44" rx="8" fill="#7a1313" />
            <rect x="-22" y="-90" width="44" height="180" rx="8" fill="#7a1313" />
          </g>
        </svg>
      );
  }
}

export default function CategoryTiles() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      {TILES.map((tile) => {
        const colSpan =
          tile.span === "lg"
            ? "md:col-span-4"
            : tile.span === "md"
              ? "md:col-span-2"
              : "md:col-span-2";
        return (
          <div
            key={tile.label}
            className={`tile h-56 md:h-64 ${colSpan}`}
          >
            <TileArt variant={tile.variant} />
            <div className="absolute inset-0 z-[2] flex flex-col justify-end p-6">
              <h3 className="font-display text-2xl md:text-3xl text-paper">
                {tile.label}
              </h3>
              <p className="text-paper/80 text-sm mt-1 max-w-xs">
                {tile.blurb}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
