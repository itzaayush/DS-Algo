import {
  ArrowDownUp,
  Boxes,
  Coins,
  Gauge,
  GitBranch,
  Grid3x3,
  Hash,
  Layers,
  List,
  Network,
  Search,
  Share2,
  Swords,
  Terminal,
  TreePine,
  Triangle,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  gauge: Gauge,
  grid: Grid3x3,
  "git-branch": GitBranch,
  list: List,
  layers: Layers,
  hash: Hash,
  "arrow-down-up": ArrowDownUp,
  search: Search,
  tree: TreePine,
  triangle: Triangle,
  share: Share2,
  coins: Coins,
  boxes: Boxes,
  swords: Swords,
  network: Network,
  terminal: Terminal,
};

export function getModuleIcon(name: string): LucideIcon {
  return MAP[name] ?? Boxes;
}
