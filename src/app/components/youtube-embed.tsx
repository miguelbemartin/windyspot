interface YouTubeEmbedProps {
    videoId: string
    title?: string
}

export default function YouTubeEmbed({ videoId, title = 'YouTube video' }: YouTubeEmbedProps) {
    return (
        <div className="ratio ratio-16x9">
            <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    )
}
