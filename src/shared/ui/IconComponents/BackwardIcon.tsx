interface IProps {
    emptyArrowId: string
    className: string
    onClick: () => void
    title: string
}

export default function ClearIcon(props: IProps) {
    const { emptyArrowId, className, onClick, title } = props;

    return (
        <div className={className} onClick={onClick} title={title}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 74 54">
                <path d="M41.7626 51.4919L26.2362 51.5184C24.9778 51.5206 23.7759 50.9956 22.9222 50.071L1.99184 27.3987C1.81547 27.2076 1.81497 26.9126 1.99069 26.721L22.8435 3.97729C23.694 3.04978 24.8941 2.52065 26.1525 2.5185L41.6788 2.49198C42.1143 2.49123 42.3427 3.00922 42.0484 3.33021L21.2532 26.0113C20.726 26.5863 20.7275 27.4694 21.2566 28.0425L42.1293 50.6524C42.4247 50.9724 42.198 51.4912 41.7626 51.4919Z" fill="currentColor" stroke="currentColor"/>
                <path id={emptyArrowId} strokeWidth="3px" d="M70.7625 51.4424L55.2362 51.4689C53.9777 51.471 52.7758 50.946 51.9222 50.0214L30.9918 27.3491C30.8154 27.1581 30.8149 26.8631 30.9906 26.6714L51.8434 3.92774C52.6939 3.00024 53.894 2.47111 55.1524 2.46896L70.6788 2.44243C71.1143 2.44168 71.3427 2.95967 71.0484 3.28066L50.2531 25.9617C49.726 26.5367 49.7275 27.4198 50.2566 27.993L71.1292 50.6029C71.4246 50.9228 71.198 51.4416 70.7625 51.4424Z" fill="currentColor"/>
            </svg>
        </div>
    )
}