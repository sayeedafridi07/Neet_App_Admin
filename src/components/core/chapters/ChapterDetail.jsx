import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import TabSelector from "../../common/TabSelector";
import { getChapterBySlug } from "../../../services/operations/chapterAPI";
import KeywordSection from "./keyword-revisions/KeywordSection";
import LectureSection from "./audio-lectures/LectureSection";
import QuestionsSection from "./quizzes/QuestionsSection";
import QuizSection from "./quizzes/QuizSection";

const TABS = [
  { title: "Lecture" },
  { title: "Keywords" },
  { title: "Quiz & Questions" },
];

function ChapterDetail() {
  const [selectedTab, setSelectedTab] = useState(0);
  const { chapterSlug } = useParams();

  const { data: response, isLoading } = useQuery({
    queryKey: ["chapter", chapterSlug],
    queryFn: () => getChapterBySlug(chapterSlug),
    enabled: !!chapterSlug,
  });

  const chapter = response?.data;
  const chapterId = chapter?.id;

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-64 rounded-lg bg-gray-200 md:h-9" />
        <div className="mt-6 flex gap-3">
          {TABS.map((tab) => (
            <div
              key={tab.title}
              className="h-10 w-32 rounded-full bg-gray-200"
            />
          ))}
        </div>
        <div className="mt-4 h-64 w-full rounded-2xl bg-gray-200" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <h1 className="font-roboto text-text text-xl font-semibold md:text-3xl">
        {chapter?.name ?? chapterSlug}
      </h1>

      {chapterId && (
        <div className="mt-6 flex flex-col gap-4">
          <div className="overflow-x-auto">
            <TabSelector
              options={TABS}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
            />
          </div>
          {selectedTab === 0 && (
            <LectureSection chapterId={chapterId} chapterName={chapter?.name} />
          )}
          {selectedTab === 1 && <KeywordSection chapterId={chapterId} />}
          {selectedTab === 2 && (
            <>
              <QuizSection chapterId={chapterId} chapterName={chapter?.name} />
              <QuestionsSection chapterId={chapterId} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ChapterDetail;
