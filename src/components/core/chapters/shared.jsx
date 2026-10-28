import Icon from "../../common/Icon";

// Card shell shared by every workspace section
export const SectionCard = ({
  icon,
  title,
  subtitle,
  action,
  children,
  className = "",
}) => (
  <section
    className={`flex flex-col rounded-3xl border border-gray-100 bg-white p-5 shadow-sm ${className}`}
  >
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
          <Icon name={icon} size={20} />
        </div>
        <div>
          <h2 className="text-text text-lg font-semibold">{title}</h2>
          {subtitle && <p className="text-textSecondary text-sm">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
    {children}
  </section>
);

// Dashed placeholder shown when a section has nothing yet
export const EmptyState = ({ icon, title, description, action }) => (
  <div className="border-border flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-8 text-center">
    <Icon name={icon} size={36} className="text-textMuted mb-3" />
    <p className="text-text font-medium">{title}</p>
    {description && (
      <p className="text-textSecondary mt-1 max-w-sm text-sm">{description}</p>
    )}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const IconButton = ({ icon, title, onClick, danger = false }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`group cursor-pointer rounded-full p-2 transition ${danger ? "hover:bg-error/10" : "hover:bg-primary/10"}`}
  >
    <Icon
      name={icon}
      size={18}
      className={`text-text ${danger ? "group-hover:text-error" : "group-hover:text-primary"}`}
    />
  </button>
);
