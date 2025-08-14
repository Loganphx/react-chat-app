export function formatMessageTime(date) {
    const parsedDate = new Date(date);

    if (isNaN(parsedDate)) return 'Invalid date';

    const now = new Date();
    const diffTime = now - parsedDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const optionsTime = { hour: "2-digit", minute: "2-digit", hour12: true };

    if (diffDays === 0) {
        // Today
        return parsedDate.toLocaleTimeString("en-US", optionsTime);
    } else if (diffDays === 1) {
        // Yesterday
        return `Yesterday at ${parsedDate.toLocaleTimeString("en-US", optionsTime)}`;
    } else {
        // Older messages
        return parsedDate.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            ...optionsTime
        });
    }
}