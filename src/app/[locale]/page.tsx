import Button from '../../shared/ui/Button/Button'
import cn from 'classnames'
import VideoPresentation from '../../widgets/VideoPresentation/VideoPresentation'
import ImageCover from '../../shared/ui/ImageCover/ImageCover'
import Link from 'next/link'
import '../_internal/styles/root-page.scss'

import { useTranslations } from 'next-intl';

export default function () {
    const translate = useTranslations('HomePage');

    return (
        <div className="Welcome">
            <ImageCover image="welcome.webp" />

            <div className="Welcome__content">
                <div className="Welcome__titleStripe">
                    <h1 className={cn('Welcome__title')}>{translate('title')}</h1>
                </div>

                <Link href="/playground" className="Welcome__button"><Button title={translate('button')}/></Link>

                <VideoPresentation />
            </div>
        </div>
    )
} 