interface IProps {
    emptyArrowId: string
    className: string
    onClick: () => void
    title: string
}

export default function PlayIcon({emptyArrowId, className, onClick, title}: IProps) {
    return (
        <div className={className} onClick={onClick} title={title}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 74 54">
                <path d="M32.2793 2.5H47.8057C49.0641 2.5 50.2651 3.02708 51.1172 3.95312L72.0088 26.6611C72.1848 26.8525 72.1848 27.1475 72.0088 27.3389L51.1172 50.0469C50.2651 50.9729 49.0641 51.5 47.8057 51.5H32.2793C31.8438 51.5 31.6163 50.9816 31.9111 50.6611L52.7451 28.0156C53.2733 27.4416 53.2733 26.5584 52.7451 25.9844L31.9111 3.33887C31.6163 3.01838 31.8438 2.5 32.2793 2.5Z" fill="currentColor" stroke="currentColor"/>
                <path id={emptyArrowId} strokeWidth="3px" d="M3.2793 2.5H18.8057C20.0641 2.5 21.2651 3.02708 22.1172 3.95312L43.0088 26.6611C43.1848 26.8525 43.1848 27.1475 43.0088 27.3389L22.1172 50.0469C21.2651 50.9729 20.0641 51.5 18.8057 51.5H3.2793C2.84382 51.5 2.61629 50.9816 2.91113 50.6611L23.7451 28.0156C24.2733 27.4416 24.2733 26.5584 23.7451 25.9844L2.91113 3.33887C2.61628 3.01838 2.84382 2.5 3.2793 2.5Z" fill="currentColor"/>
            </svg>
        </div>
    )
}