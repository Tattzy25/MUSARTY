import Navigation from "@/components/Navigation";
import {
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Code,
  Zap,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GridCard {
  id: string;
  name: string;
  icon: any;
  description: string;
}

const GRID_CARDS: GridCard[] = [
  {
    id: "card-1",
    name: "HELLO AVI",
    icon: FileText,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "card-2",
    name: "HELLO AVI",
    icon: ImageIcon,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "card-3",
    name: "HELLO AVI",
    icon: Video,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "card-4",
    name: "HELLO AVI",
    icon: Music,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "card-5",
    name: "HELLO AVI",
    icon: Code,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "card-6",
    name: "HELLO AVI",
    icon: Zap,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "card-7",
    name: "HELLO AVI",
    icon: Sparkles,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "card-8",
    name: "HELLO AVI",
    icon: RefreshCw,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

export default function Gridwave() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
            Gridwave
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Interactive cyber cards in a perfect grid formation
          </p>
        </div>

        {/* 🔒 SECURED CYBER GRID - 2x4 FORMATION 🔒 */}
        <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Security Grid Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-8 text-[8px] text-primary/40 font-mono">
              GRID_FORMATION_2x4
            </div>
            <div className="absolute bottom-4 right-8 text-[8px] text-primary/40 font-mono">
              ●●●●● SECURED_LAYOUT
            </div>
          </div>

          {GRID_CARDS.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={card.id} className="cyber-card-container relative">
                {/* SECURITY LOCK INDICATOR */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary/20 rounded-full border border-primary/50 flex items-center justify-center z-50">
                  <span className="text-[8px] text-primary">🔒</span>
                </div>

                {/* POSITION LOCK */}
                <div className="absolute -bottom-2 -left-2 text-[6px] text-primary/60 font-mono bg-black/80 px-1 rounded">
                  GRID_{index + 1}_LOCK
                </div>

                <div className="container noselect">
                  <div className="canvas">
                    <div className="tracker tr-1" />
                    <div className="tracker tr-2" />
                    <div className="tracker tr-3" />
                    <div className="tracker tr-4" />
                    <div className="tracker tr-5" />
                    <div className="tracker tr-6" />
                    <div className="tracker tr-7" />
                    <div className="tracker tr-8" />
                    <div className="tracker tr-9" />
                    <div id="card">
                      <div className="card-content">
                        <div className="card-glare" />
                        <div className="cyber-lines">
                          <span />
                          <span />
                          <span />
                          <span />
                        </div>
                        <div className="icon-container">
                          <Icon className="card-icon" />
                        </div>
                        <div className="title">{card.name}</div>
                        <div className="glowing-elements">
                          <div className="glow-1" />
                          <div className="glow-2" />
                          <div className="glow-3" />
                        </div>
                        <div className="subtitle">
                          <span className="description">
                            {card.description}
                          </span>
                        </div>
                        <div className="card-particles">
                          <span />
                          <span />
                          <span />
                          <span />
                          <span />
                          <span />
                        </div>
                        <div className="corner-elements">
                          <span />
                          <span />
                          <span />
                          <span />
                        </div>
                        <div className="scan-line" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Grid Info */}
        <div className="text-center space-y-4 py-8">
          <div className="flex justify-center items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>8 Cards • 2x4 Grid Formation • Cyber Security Active</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
            All cards secured with position locks • Hover effects enabled • Grid
            formation optimized
          </p>
        </div>
      </div>
    </div>
  );
}
