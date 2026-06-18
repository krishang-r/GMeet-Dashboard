import { formatSchedule } from "@/lib/format";

type Meet = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  scheduledAt?: Date | null;
};

export function MeetCard({ meet }: { meet: Meet }) {
  const when = formatSchedule(meet.scheduledAt);
  return (
    <div className="group flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-card-hover">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand ring-1 ring-inset ring-brand/15">
          <MeetIcon />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-foreground">
            {meet.title}
          </h3>
          {when && (
            <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-brand">
              <ClockIcon />
              {when}
            </p>
          )}
          {meet.description && (
            <p className="mt-0.5 line-clamp-2 text-sm text-muted">
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
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg shadow-sm transition hover:bg-brand-dark"
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

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="2"
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
