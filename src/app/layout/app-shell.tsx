import { ReactNode } from 'react';
import cn from 'classnames';
import Header from '@widgets/layout/header';
import Footer from '@widgets/layout/footer';
import SpriteIcon from '@shared/ui/SpriteIcon';

interface IProps {
    children: ReactNode
    backToPlayground: boolean
    hideLogoOnMobile: boolean
    playgroundMode: boolean
    headerBottomOnMobile: boolean
    onToggleMobileHeader: () => void
}

const AppShell = ({
    children,
    backToPlayground,
    hideLogoOnMobile,
    playgroundMode,
    headerBottomOnMobile,
    onToggleMobileHeader
}: IProps) => {
    return (
        <div className="AppContainer">
            <>
                <Header
                    isPlaygroundButtonShown={backToPlayground}
                    hideLogoOnMobile={hideLogoOnMobile}
                    className={playgroundMode ? 'PlaygroundHeader' : ''}
                />
                {children}
                <Footer className={playgroundMode ? 'PlaygroundFooter' : ''}/>
                <div
                    className={cn('toggleHeaderBottomOnMobile', {
                        PlaygroundToggleHeaderBottomOnMobile: playgroundMode,
                        headerBottomOnMobile
                    })}
                    onClick={onToggleMobileHeader}
                >
                    <SpriteIcon id="app-layout-app-shell-1" />
                </div>
            </>
        </div>
    );
};

export default AppShell;
