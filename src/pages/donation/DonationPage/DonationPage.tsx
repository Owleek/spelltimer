import React, {useState} from 'react';
import cn from 'classnames';
import QrComponent from '../../ui/qr-component';
import {useSelector} from 'react-redux';
import {TStoreState} from '../../../store/store';
import { translateText } from '../../../utils/utils';
import '../../../styles/article.scss';
import ImageCover from '../../../components/ImageCover/ImageCover';
import SpriteIcon from '@shared/ui/SpriteIcon';

enum EQRItem {
    dna = '/assets/qrcodes/dna.webp',
    btc = '/assets/qrcodes/bitcoin.webp',
    eth = '/assets/qrcodes/eth.webp',
    usdtTRON = '/assets/qrcodes/tron.webp'
}

const DonationPage = () => {
    const [copied, setCopied] = useState<string | null>(null);
    const [qrItem, setQrItem] = useState<EQRItem | null>(null);
    const [donated, setDonated] = useState<boolean>(false);

    const {dictionary} = useSelector((state: TStoreState) => state.localeSlice);

    const wallets = [
        {
            name: "BTC",
            address: "bc1q4r7vysdnlce2wev95djh3zykefvcepwgshgvsd",
            icon: <SpriteIcon id="manual-donation-btc" />,
            qrImg: EQRItem.btc 
        },
        {
            name: "ETH",
            address: "0x9DD13D3bEf872A5Ee17d50e9380484bC96dBE708",
            icon: <SpriteIcon id="pages-donationpage-donation-1" />,
            qrImg: EQRItem.eth
        },
        {
            name: "USDT(TRON)",
            address: "THEHBaYdPRL3FRQ3dSAVN5Vp1btJPewR17",
            icon: <SpriteIcon id="pages-donationpage-donation-2" />,
            qrImg: EQRItem.usdtTRON
        }
    ];

    const handleCopy = async (address: string) => {
        if (!!copied) return;

        try {
            await navigator.clipboard.writeText(address);
            setCopied(address);
            setTimeout(() => setCopied(null), 1500);
        } catch (err) {
            console.error("Copy failed:", err);
        }
    };

    const handleClickQRcode = (key: EQRItem) => setQrItem(key);
    const handleClose = () => setQrItem(null);
    
    const handleDonate = () => {
        setDonated(true);
        handleClose();
    }

    return <div className="Article">
        <ImageCover image="article.webp" />
        
       { !!qrItem &&  <QrComponent img={qrItem} onClose={handleClose} onDonate={handleDonate} btnText={translateText(dictionary, 'thnx_btn')}/> }
        
        <div className="Article__body">
            <div className="adjustCenter">
                {
                    donated ?
                    <div className="Article__thanksContainer">
                        <div className="Article__thanksText">
                            <p>{ translateText(dictionary, 'thnx_1') }</p>
                            <p>{ translateText(dictionary, 'thnx_2') }</p>
                        </div>
                    </div> :
                    <div className="Article__bodyInner">
                        <div className='Article__contentHeader'>
                            <h2 className='Article__title'>
                                { translateText(dictionary, 'support') }
                                <span className="Article__titleIcon">
                                    <SpriteIcon id="pages-donationpage-donation-3" />
                                </span>
                            </h2>
                        </div>
                        
                        <div className="Article__contentWrapper appStyledScroll">
                            <div className="Article__content">
                                <p>{ translateText(dictionary, 'donation_1') }</p>
                                <p>{ translateText(dictionary, 'donation_2') }</p>
                                <p>{ translateText(dictionary, 'donation_3') }</p>
                                <div className="Article__donationContainer appStyledScroll">
                                    <div className="Article__donationList">
                                        <div className="Article__donation">
                                            <div className="Article__donationLinkHoverContainer">
                                                <span className="Article__donationIcon">
                                                    <SpriteIcon id="pages-donationpage-donation-4" />
                                                </span>
                                                <a  className="Article__donationLink" 
                                                    href="https://www.donationalerts.com/r/spelltimer" 
                                                    target="_blank" 
                                                    rel="noopener noreferrer">
                                                    DonationAlerts
                                                </a>
                                            </div>
                                            <div className="Article__walletPayTools">
                                                <span className="Article__walletQRCODE" onClick={() => handleClickQRcode(EQRItem.dna)} title={translateText(dictionary, 'show_qr')}>
                                                    <SpriteIcon id="pages-donationpage-donation-5" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="Article__walletList">
                                        {
                                            wallets.map(wlt => <div key={wlt.address} className="Article__wallet">
                                                <span className="Article__walletIcon">{wlt.icon}</span>
                                                <div className="Article__walletPayTools">
                                                    <span className="Article__walletCopy" onClick={() => handleCopy(wlt.address)} title={translateText(dictionary, 'copy')}>
                                                        <span className={cn('Article__walletCopyText', {show: copied === wlt.address})}>{translateText(dictionary, 'copied')}</span>
                                                        <SpriteIcon id="pages-donationpage-donation-7" />
                                                    </span>
                                                    <span className="Article__walletQRCODE" onClick={() => handleClickQRcode(wlt.qrImg)} title={translateText(dictionary, 'show_qr')}>
                                                        <SpriteIcon id="pages-donationpage-donation-8" />
                                                    </span>
                                                </div>
                                                <div className="Article__walletRow">
                                                    <span className="Article__walletName">{wlt.name + ': '}</span>
                                                    <span className="Article__walletID">{wlt.address}</span>
                                                </div>
                                            </div>)
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    </div>
}

export default DonationPage;
