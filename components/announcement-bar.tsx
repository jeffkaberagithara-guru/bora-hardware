import Link from "next/link";
import { siteConfig } from "@/config/site";

/**
 * Announcement bar.
 *
 * 32px, primary-strong, one line, no dismiss control — there is nothing to
 * dismiss when there is only one message. Deliberately quieter than the
 * navigation beneath it: it informs, it does not compete.
 */
export function AnnouncementBar() {
  const { announcement } = siteConfig;

  return (
    <div className="bg-primary-strong text-white">
      <div className="shell flex h-8 items-center justify-between gap-4">
        <p className="truncate font-[family-name:var(--font-mono)] text-[0.6875rem] leading-none tracking-[0.06em]">
          <span className="sm:hidden">{announcement.short}</span>
          <span className="hidden sm:inline">{announcement.main}</span>
        </p>
        <Link
          href={announcement.href}
          className="hidden shrink-0 items-center gap-1 border-b border-white/35 pb-px font-[family-name:var(--font-mono)] text-[0.6875rem] leading-none tracking-[0.06em] transition-colors duration-[var(--motion-fast)] hover:border-white sm:inline-flex"
        >
          {announcement.action}
        </Link>
      </div>
    </div>
  );
}