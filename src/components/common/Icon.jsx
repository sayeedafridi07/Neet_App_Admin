import * as LucideIcons from "lucide-react";

function Icon({ name, className = "", ...props }) {
  // Check if the icon exists in Lucide Icons
  if (!name || !LucideIcons[name]) {
    console.warn(`Icon "${name}" not found in Lucide Icons`);
    return null;
  }

  const IconComponent = LucideIcons[name];

  return (
    <IconComponent className={className} {...props} />
  );
}

export default Icon;
