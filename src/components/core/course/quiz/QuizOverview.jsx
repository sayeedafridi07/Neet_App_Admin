import React, { useState } from "react";
import {
  FileText,
  Clock,
  ListOrdered,
  Trophy,
  Target,
  Repeat,
  Calendar,
  Pencil,
  Calculator,
  Check,
  X,
  Minus,
  Trash2,
} from "lucide-react";
import moment from "moment";

// Direct imports ensure React doesn't throw an "invalid element type" error
import ToggleSwitch from "../../../common/ToggleSwitch";
import CustomButton from "../../../common/CustomButton";

// Responsive Stat Component: Uses grid spacing instead of fixed borders to prevent mobile cramping
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

function Pill({ icon: Icon, label, value, variant }) {
  const cls = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    red: "bg-red-50 text-red-600 border-red-100",
    gray: "bg-slate-50 text-slate-500 border-slate-100",
  }[variant];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${cls}`}
    >
      <Icon size={14} strokeWidth={2.5} />
      {label} <span className="opacity-70">{value}</span>
    </span>
  );
}

const QuizOverview = ({
  data,
  onEdit,
  onDelete,
  onToggleStatus,
  loading,
  isFromTestSeries,
}) => {
  
  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-white">
      {/* 1. Header Section: Title and Right-Aligned Actions */}
      <div className="p-6 pb-0 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Left: Title & Metadata */}
          <div className="min-w-0 flex-1 space-y-2">
            <h2 className="truncate text-3xl font-extrabold tracking-tight text-slate-900">
              {data?.title || "Untitled Quiz"}
            </h2>
            {data?.description && (
              <p className="line-clamp-2 text-base leading-relaxed font-normal text-slate-500">
                {data.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-sm font-medium text-slate-400">
              {data?.createdAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-300" />
                  Created {moment(data.createdAt).format("MMM DD, YYYY")}
                </span>
              )}
              <span className="hidden opacity-30 sm:inline">•</span>
              {data?.updatedAt && (
                <span className="flex items-center gap-1.5">
                  <Pencil size={14} className="text-slate-300" />
                  Updated {moment(data.updatedAt).fromNow()}
                </span>
              )}
            </div>
          </div>

          {/* Right: Action Group (Status + Edit Pill, Delete Button) */}
          {!isFromTestSeries && (
            <div className="mb-4 flex shrink-0 flex-wrap items-center gap-3 lg:mb-0 lg:justify-end">
              {/* Status & Edit Integrated Pill */}
              <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-1.5 pr-2 pl-5">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Status
                  </span>
                  <ToggleSwitch
                    checked={data?.isActive}
                    onChange={onToggleStatus}
                    disabled={loading}
                  />
                </div>

                <div className="h-8 w-px bg-slate-200/80" />

                <CustomButton title="Edit quiz" onClick={onEdit} />
              </div>

              {/* Delete Button */}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="cursor-pointer rounded-2xl border border-slate-100 bg-white p-4 text-slate-400 transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-600 active:scale-95"
                  title="Delete Quiz"
                >
                  <Trash2 size={24} strokeWidth={2} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. Stats Grid Section: Completely responsive layout */}
      <div className="grid grid-cols-1 gap-y-4 border-t border-slate-100 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-5">
        <Stat
          icon={Clock}
          label="Duration"
          value={`${data?.durationInMinutes || 0} min`}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <Stat
          icon={Target}
          label="Passing Marks"
          value={data?.passingMarks || 0}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <Stat
          icon={ListOrdered}
          label="Total Questions"
          value={data?.totalQuestions || 0}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
        />
        <Stat
          icon={Trophy}
          label="Total Marks"
          value={data?.totalMarks || 0}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
        <Stat
          icon={Repeat}
          label="Max Attempts"
          value={data?.maxAttempts || "Unlimited"}
          iconBg="bg-slate-100"
          iconColor="text-slate-600"
        />
      </div>

      {/* 3. Footer: Marking Scheme */}
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
              value={`+${data?.markingScheme?.correct || 0}`}
              variant="green"
            />
            <Pill
              icon={X}
              label="Wrong"
              value={data?.markingScheme?.wrong || 0}
              variant="red"
            />
            <Pill
              icon={Minus}
              label="Skipped"
              value={data?.markingScheme?.skipped || 0}
              variant="gray"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizOverview;
