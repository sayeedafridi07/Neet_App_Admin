import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Video, Calendar, Clock, ChevronRight, Users, Check, VideoOff } from "lucide-react";
import { getMeetings } from "../../../services/operations/meetingAPI";

const getMeetingStatus = (meeting) => {
    const now = new Date();
    const start = new Date(meeting.startTime);
    const end = meeting.endTime ? new Date(meeting.endTime) : null;

    if (end && now > end) return "ended";
    if (now >= start) return "live";
    return "upcoming";
};

const StatusBadge = ({ status }) => {
    if (status === "live") {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-medium text-red-600">Live</span>
            </span>
        );
    }
    if (status === "upcoming") {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 shrink-0">
                <Clock className="w-2.5 h-2.5 text-sky-600" />
                <span className="text-xs font-medium text-sky-600">Upcoming</span>
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-100 shrink-0">
            <Check className="w-2.5 h-2.5 text-neutral-400" />
            <span className="text-xs font-medium text-neutral-400">Ended</span>
        </span>
    );
};

const MeetingCard = ({ meeting }) => {
    const status = getMeetingStatus(meeting);
    const isEnded = status === "ended";
    const isLive = status === "live";

    return (
        <div
            className={`bg-white shadow border border-l-4 border-l-primary border-gray-100 rounded-2xl px-4 py-3.5 flex items-center gap-3.5`}
        >

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-text truncate">
                        {meeting.title}
                    </span>
                    <StatusBadge status={status} />
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-textSecondary" />
                    <span className="text-sm text-textSecondary">
                        {moment(meeting.startTime).format("DD MMM · hh:mm A")}
                    </span>
                </div>
            </div>

            <button onClick={() => window.open(meeting.meetingLink, "_blank", "noopener,noreferrer")} className="rounded-full bg-primary p-2 text-white cursor-pointer hover:bg-primary/60 transition">
                <Video size={16} />
            </button>
        </div>
    );
};

const UpcomingEvent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const { meetings, loading } = useSelector((state) => state.meeting);

    const upcomingMeetings = meetings?.filter((m) => m.isActive) ?? [];

    useEffect(() => {
        dispatch(getMeetings(token, { type: "upcoming" }));
    }, [token]);

    if (loading) {
        return (
            <div>
                <div className="text-base font-semibold text-gray-900 mb-4">
                    Upcoming Meetings
                </div>
                <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-white border border-neutral-100 rounded-2xl px-4 py-3.5 flex items-center gap-3.5"
                        >
                            <div className="w-10 h-10 rounded-xl bg-neutral-100 animate-pulse shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="w-36 h-3 bg-neutral-100 rounded-full animate-pulse" />
                                <div className="w-24 h-2.5 bg-neutral-100 rounded-full animate-pulse" />
                            </div>
                            <div className="w-16 h-7 bg-neutral-100 rounded-xl animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (upcomingMeetings.length === 0) {
        return (
            <div>
                <div className="text-base font-semibold text-gray-900 mb-4">
                    Upcoming Meetings
                </div>
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-neutral-400" />
                    </div>
                    <p className="text-sm text-neutral-400 font-medium">No upcoming meetings</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="text-base font-semibold text-gray-900">Upcoming Meetings</div>
                <button
                    onClick={() => navigate("/meeting")}
                    className="flex items-center gap-0.5 text-xs text-primary font-medium hover:underline transition-all cursor-pointer"
                >
                    View all <ChevronRight className="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 pr-0.5">
                {upcomingMeetings.map((meeting) => (
                    <MeetingCard key={meeting._id} meeting={meeting} />
                ))}
            </div>
        </div>
    );
};

export default UpcomingEvent;