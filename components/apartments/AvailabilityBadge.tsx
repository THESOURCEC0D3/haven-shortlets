import { ApartmentAvailability } from "@/lib/types";

interface AvailabilityBadgeProps {
  availability: ApartmentAvailability | null;
  size?: "sm" | "md";
}

export default function AvailabilityBadge({
  availability,
  size = "md",
}: AvailabilityBadgeProps) {
  const isAvailable = availability?.available ?? true;
  const availableFrom = availability?.available_from;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
  };

  if (isAvailable) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 bg-green-100 text-green-700 border border-green-200 font-medium rounded-full ${sizeClasses[size]}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
        Available — Book Now
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 font-medium rounded-full ${sizeClasses[size]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
      {availableFrom
        ? `Booked — Available ${formatAvailableFrom(availableFrom)}`
        : "Currently Booked"}
    </span>
  );
}

function formatAvailableFrom(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
