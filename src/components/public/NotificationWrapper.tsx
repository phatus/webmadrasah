
import { getActiveAnnouncements } from "@/actions/announcement"
import RunningText from "@/components/public/RunningText"
import AnnouncementPopup from "@/components/public/AnnouncementPopup"

export default async function NotificationWrapper() {
    // This component fetches data on the server and passes it to client components
    // It's robust because it handles the async fetch and renders the visual parts

    // We'll wrap in try-catch to prevent layout crash on db error
    let announcements: any[] = []
    try {
        announcements = await getActiveAnnouncements()
    } catch (e) {
        console.error("Failed to load announcements for layout", e)
    }

    if (!announcements.length) return null

    const runningTexts = announcements.filter((a: any) => a.type === 'RUNNING_TEXT')
    const popups = announcements.filter((a: any) => a.type === 'POPUP')

    return (
        <>
            {runningTexts.length > 0 && <RunningText announcements={runningTexts} />}
            {popups.length > 0 && <AnnouncementPopup announcements={popups} />}
        </>
    )
}
