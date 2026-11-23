import moment from "moment";
import {
  Calculator,
  Calendar,
  Check,
  Clock,
  ListOrdered,
  Minus,
  Pencil,
  Trash2,
  Trophy,
  X,
} from "lucide-react";
import CustomButton from "../../../common/CustomButton";
import ToggleSwitch from "../../../common/ToggleSwitch";

function Stat({ icon: Icon, label, value, iconBg, iconColor }) {
  return (
    <div className="flex items-center gap-4 p-2 sm:p-4">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg} ${iconColor}`}
      >
        <Icon size={22} strokeWidth={2} />
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-xs leading-tight font-bold tracking-wider text-slate-400 uppercase">
          {label}
        </span>
        <span className="truncate text-xl font-bold text-slate-900">
          {value}
        </span>
      </div>
    </div>
  );
}

const PILL_VARIANTS = {
  green: "bg-emerald-50 text-emerald-700 border-emerald-100",
  red: "bg-red-50 text-red-600 border-red-100",
  gray: "bg-slate-50 text-slate-500 border-slate-100",
};

function Pill({ icon: Icon, label, value, variant }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${PILL_VARIANTS[variant]}`}
    >
      <Icon size={14} strokeWidth={2.5} />
      {label} <span className="opacity-70">{value}</span>
    </span>
  );
}

const formatMarks = (n) => (n > 0 ? `+${n}` : `${n}`);

// Overview card for a chapter's single quiz
const ChapterQuizOverview = ({
  quiz,
  onEdit,
  onDelete,
  onToggleStatus,
  statusLoading,
}) => {
  const questionCount = quiz?.questionCount ?? 0;
  const correctMarks = quiz?.correctMarks ?? 4;
  const wrongMarks = quiz?.wrongMarks ?? -1;
  const skippedMarks = quiz?.skippedMarks ?? 0;

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-white">
      {/* Header: title, metadata and actions */}
      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1 space-y-2">
            <h2 className="truncate text-3xl font-extrabold tracking-tight text-slate-900">
              {quiz?.title || "Untitled Quiz"}
            </h2>
            {quiz?.description && (
              <p className="line-clamp-2 text-base leading-relaxed text-slate-500">
                {quiz.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-sm font-medium text-slate-400">
              {quiz?.createdAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-300" />
                  Created {moment(quiz.createdAt).format("MMM DD, YYYY")}
                </span>
              )}
              {quiz?.createdAt && quiz?.updatedAt && (
                <span className="hidden opacity-30 sm:inline">•</span>
              )}
              {quiz?.updatedAt && (
                <span className="flex items-center gap-1.5">
                  <Pencil size={14} className="text-slate-300" />
                  Updated {moment(quiz.updatedAt).fromNow()}
                </span>
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3 lg:justify-end">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-1.5 pr-2 pl-5">
              {onToggleStatus && (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Status
                    </span>
                    <ToggleSwitch
                      checked={!!quiz?.isActive}
                      onChange={onToggleStatus}
                      disabled={statusLoading}
                    />
                  </div>
                  <div className="h-8 w-px bg-slate-200/80" />
                </>
              )}
              <CustomButton title="Edit quiz" onClick={onEdit} />
            </div>

            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                title="Delete Quiz"
                className="cursor-pointer rounded-2xl border border-slate-100 bg-white p-4 text-slate-400 transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-600 active:scale-95"
              >
                <Trash2 size={24} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-y-4 border-t border-slate-100 p-6 sm:grid-cols-3 sm:p-8">
        <Stat
          icon={Clock}
          label="Duration"
          value={
            quiz?.durationMinutes ? `${quiz.durationMinutes} min` : "No limit"
          }
          iconBg="bg-primary/10"
          iconColor="text-primary"
        />
        <Stat
          icon={ListOrdered}
          label="Total Questions"
          value={questionCount}
          iconBg="bg-primary/10"
          iconColor="text-primary"
        />
        <Stat
          icon={Trophy}
          label="Total Marks"
          value={questionCount * correctMarks}
          iconBg="bg-primary/10"
          iconColor="text-primary"
        />
      </div>

      {/* Marking scheme */}
      <div className="border-t border-slate-100 bg-slate-50/40 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
            <Calculator size={14} />
            Marking Scheme
          </div>
          <div className="flex flex-wrap gap-2">
            <Pill
              icon={Check}
              label="Correct"
              value={formatMarks(correctMarks)}
              variant="green"
            />
            <Pill
              icon={X}
              label="Wrong"
              value={formatMarks(wrongMarks)}
              variant="red"
            />
            <Pill
              icon={Minus}
              label="Skipped"
              value={formatMarks(skippedMarks)}
              variant="gray"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterQuizOverview;
