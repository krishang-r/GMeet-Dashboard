type Meet = {
  id: string;
  title: string;
  description: string | null;
  url: string;
};

export function MeetCard({ meet }: { meet: Meet }) {
  return (
    <div className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <MeetIcon />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900">
            {meet.title}
          </h3>
          {meet.description && (
            <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">
              {meet.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-auto">
        <a
          href={meet.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          Join meeting
          <ArrowIcon />
        </a>
      </div>
    </div>
  );
}

function MeetIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3.5l4 3.5V7l-4 3.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 17 17 7M17 7H8M17 7v9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
