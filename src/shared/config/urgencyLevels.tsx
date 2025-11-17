export const URGENCY_LEVELS = {
  1: { label: "Non urgent", color: "green", priority: 1 },
  2: { label: "Peu urgent", color: "blue", priority: 2 },
  3: { label: "Urgent", color: "yellow", priority: 3 },
  4: { label: "Très urgent", color: "orange", priority: 4 },
  5: { label: "Critique", color: "red", priority: 5 }
};

export const getUrgencyColor = (level: number) => {
  const colors = {
    1: "bg-green-500",
    2: "bg-blue-500", 
    3: "bg-yellow-500",
    4: "bg-orange-500",
    5: "bg-red-500"
  };
  return colors[level] || "bg-gray-500";
};