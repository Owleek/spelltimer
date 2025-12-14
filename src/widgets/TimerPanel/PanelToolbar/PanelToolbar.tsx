import cn from 'classnames'
import { useTranslations } from 'next-intl'
import CountdownEditor from './CountdownEditor/CountdownEditor'
import SettingsIcon from '../../../shared/ui/IconComponents/SettingsIcon'
import PlayIcon from '../../../shared/ui/IconComponents/PlayIcon'
import SoundIcon from '../../../shared/ui/IconComponents/Sound'
import ResetIcon from '../../../shared/ui/IconComponents/ResetIcon'
import ClearIcon from '../../../shared/ui/IconComponents/ClearIcon'
import './PanelToolbar.scss'

export default function PanelToolbar() {
    const translate = useTranslations('PlaygroundPage.TimerPanel')

    return (
        <div className="PanelToolbar">
            <div className={cn('PanelToolbar__leftSide')}>
                <ClearIcon className={cn('PanelToolbar__button')} title={translate('clear_slots')} onClick={() => {}}/>

                <ResetIcon className={cn('PanelToolbar__button refreshButton')} title={translate( 'reset_timers')} onClick={() => {}}/>

                <SoundIcon className={cn('PanelToolbar__button')} title={translate('without_sound')} onClick={() => {}}/>
            </div>

            <CountdownEditor />

            <PlayIcon className={cn('PanelToolbar__button play')} onClick={() => {}} title={translate('start_mode')}/>

            <SettingsIcon className={cn('PanelToolbar__button')} onClick={() => {}} title={translate('setup_mode')} />
        </div>
    )
}

