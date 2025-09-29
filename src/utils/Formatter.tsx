import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function formatTimeAgo(timestamp: string | Date): string {
    return dayjs(timestamp).fromNow();
}