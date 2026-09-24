import {
  Route,
  MonitorPlay,
  Home,
  CalendarDays,
  ClipboardCheck,
  Award,
  BookOpen,
  BookOpenText,
  ScrollText,
  Sparkles,
  GraduationCap,
  Library,
  PenLine,
  Mic,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Route,
  MonitorPlay,
  Home,
  CalendarDays,
  ClipboardCheck,
  Award,
  BookOpen,
  BookOpenText,
  ScrollText,
  Sparkles,
  GraduationCap,
  Library,
  PenLine,
  Mic,
};

export function getIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Route;
  return ICON_MAP[name] ?? Route;
}