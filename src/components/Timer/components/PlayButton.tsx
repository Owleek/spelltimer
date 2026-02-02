import { ETimerStatus } from '../TimerView'
import { TStoreState } from '../../../store/store'
import { translateText } from '../../../utils/utils'
import { useSelector } from 'react-redux'
import cn from 'classnames'

interface IProps {
    onClick: () => any
    timerStatus: ETimerStatus
}


const PlayButton = ({ onClick, timerStatus }: IProps) => {
    const { dictionary } = useSelector((state: TStoreState) => state.localeSlice);

    return (
        <div className="Timer__cover" onClick={onClick} title={translateText(dictionary, timerStatus === ETimerStatus.RUNNING ? 'pause' : 'start')}>
            <div className={cn('Timer__play')}>
                {
                    timerStatus === ETimerStatus.RUNNING ?
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 42">
                            <path d="M9 3C9 1.34315 10.3431 0 12 0H18C19.6569 0 21 1.34315 21 3V39C21 40.6569 19.6569 42 18 42H12C10.3431 42 9 40.6569 9 39V3Z" />
                            <path d="M29 3C29 1.34315 30.3431 0 32 0H38C39.6569 0 41 1.34315 41 3V39C41 40.6569 39.6569 42 38 42H32C30.3431 42 29 40.6569 29 39V3Z" />
                        </svg>
                    :
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 30">
                            <path d="M24.9 12.1623C26.9 13.317 26.9 16.2038 24.9 17.3585L4.5594 29.1021C2.5594 30.2568 0.0594025 28.8134 0.0594025 26.504V3.01675C0.0594025 0.707349 2.5594 -0.736029 4.5594 0.418672L24.9 12.1623Z"/>
                        </svg>
                }
            </div>
        </div>
    )
}

export default PlayButton