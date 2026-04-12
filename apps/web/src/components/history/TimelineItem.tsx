import { useEffect, useMemo, useState } from "react";
import type { TimelineEvent } from "../../types/history";

type TimelineItemProps = {
  event: TimelineEvent;
  onOpenStory: (event: TimelineEvent) => void;
};

function TimelineItem({ event, onOpenStory }: TimelineItemProps) {
  const imageSources = useMemo(
    () =>
      [event.imageReferenceUrl, event.image].filter(
        (source, index, sources): source is string =>
          Boolean(source) && sources.indexOf(source) === index,
      ),
    [event.image, event.imageReferenceUrl],
  );
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setImageIndex(0);
  }, [event.id, event.image, event.imageReferenceUrl]);

  function handleOpenStory() {
    onOpenStory(event);
  }

  function handleKeyDown(keyboardEvent: React.KeyboardEvent<HTMLDivElement>) {
    if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
      keyboardEvent.preventDefault();
      handleOpenStory();
    }
  }

  const currentImageSrc = imageSources[imageIndex];

  return (
    <article className="grid items-start gap-4 md:grid-cols-[52px_1fr]">
      <div className="mt-[22px] flex h-10 w-10 items-center justify-center rounded-full bg-[#0C2340] text-[11px] font-bold tracking-[0.04em] text-white">
        {event.year}
      </div>

      <div
        aria-label={`Open full story for ${event.title}`}
        className="grid cursor-pointer items-center gap-4 rounded-2xl border border-[#e5e7eb] bg-white p-[18px] shadow-[0_1px_2px_rgba(15,23,42,0.04)] outline-none transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_18px_rgba(15,23,42,0.05)] focus-visible:-translate-y-0.5 focus-visible:border-slate-300 focus-visible:shadow-[0_8px_18px_rgba(15,23,42,0.05)] md:grid-cols-[minmax(0,1fr)_132px_38px]"
        onClick={handleOpenStory}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
        <div>
          <h3 className="mb-1.5 text-base font-bold text-[#0C2340]">
            {event.title}
          </h3>
          <p className="mb-2.5 text-[13px] leading-[1.55] text-slate-500">
            {event.description}
          </p>
          <button
            className="border-none bg-transparent p-0 text-[11px] font-bold text-[#4B92DB] underline underline-offset-[3px]"
            onClick={(mouseEvent) => {
              mouseEvent.stopPropagation();
              handleOpenStory();
            }}
            type="button"
          >
            {event.linkLabel}
          </button>
        </div>

        {currentImageSrc ? (
          <img
            alt={event.alt}
            className="block h-20 w-full rounded-[10px] object-cover md:w-[132px]"
            onError={() => setImageIndex((current) => current + 1)}
            src={currentImageSrc}
          />
        ) : (
          <div className="flex h-20 w-full items-center justify-center rounded-[10px] bg-[linear-gradient(135deg,#153865_0%,#4B92DB_100%)] p-2.5 text-center text-white md:w-[132px]">
            <span className="text-[22px] font-extrabold tracking-[0.08em]">
              {event.year}
            </span>
          </div>
        )}

        <button
          aria-label={`Open timeline story for ${event.title}`}
          className="flex h-[38px] w-[38px] items-center justify-center self-start rounded-full border-none bg-[#0C2340] text-[18px] font-bold text-white transition duration-200 hover:scale-105 hover:bg-[#0a1f3a] md:self-center"
          onClick={(mouseEvent) => {
            mouseEvent.stopPropagation();
            handleOpenStory();
          }}
          type="button"
        >
          +
        </button>
      </div>
    </article>
  );
}

export default TimelineItem;
