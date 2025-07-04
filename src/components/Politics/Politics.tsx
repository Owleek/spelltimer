import React from 'react';
import {useSelector} from 'react-redux';
import {TStoreState} from '../../store/store';
import { translateText } from '../../utils/utils';
import '../../article.scss';

const Politics = () => {
    const {dictionary} = useSelector((state: TStoreState) => state.localeSlice);

    return <div className="Article">
        <div className="Article__body">
            <div className="adjustCenter">
                <div className="Article__bodyInner">
                    <div className='Article__contentHeader'>
                        <h2 className='Article__title'>
                            { translateText(dictionary, 'politics_1') }
                            <span className="Article__titleIcon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M15.1142 20H0.878735C0.726421 20 0.585823 19.8594 0.585823 19.7071V0.304629C0.585823 0.140599 0.726421 0.0117175 0.878735 0.0117175H11.7516C11.9156 0.0117175 12.0328 0.140599 12.0445 0.281196L12.0914 3.25718L15.1142 3.22203C15.2783 3.22203 15.4071 3.35091 15.4071 3.50322V10.4511C15.4071 10.6151 15.2783 10.744 15.1142 10.744C14.9502 10.744 14.8213 10.6151 14.8213 10.4511V3.79613L11.7985 3.83128C11.6344 3.83128 11.5056 3.69069 11.5056 3.55009L11.4821 0.574108H1.15993V19.4259H15.1142C15.2783 19.4259 15.4071 19.5548 15.4071 19.7188C15.4071 19.8828 15.2783 20 15.1142 20Z"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M15.1142 3.7727C15.0557 3.7727 14.9736 3.74927 14.9268 3.69069L11.5641 0.492092C11.447 0.386644 11.447 0.199181 11.5407 0.0937327C11.6579 -0.0234319 11.8336 -0.0234319 11.9508 0.0702998L15.3134 3.26889C15.4306 3.38606 15.4306 3.56181 15.3251 3.67897C15.2665 3.74927 15.1963 3.7727 15.1142 3.7727Z"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M9.12712 14.0012H2.09725C1.94493 14.0012 1.80433 13.8723 1.80433 13.7083C1.80433 13.5442 1.94493 13.4153 2.09725 13.4153H9.13884C9.30287 13.4153 9.43175 13.5442 9.43175 13.7083C9.43175 13.8723 9.27944 14.0012 9.12712 14.0012Z"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M9.88869 17.5747H2.09725C1.94493 17.5747 1.80433 17.4458 1.80433 17.2818C1.80433 17.1178 1.94493 16.9889 2.09725 16.9889H9.88869C10.0527 16.9889 10.1816 17.1178 10.1816 17.2818C10.1816 17.4458 10.0293 17.5747 9.88869 17.5747Z"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M7.26421 8.07264H2.09725C1.94493 8.07264 1.80433 7.93205 1.80433 7.77973C1.80433 7.6157 1.94493 7.48682 2.09725 7.48682H7.26421C7.42824 7.48682 7.55712 7.6157 7.55712 7.77973C7.55712 7.93205 7.42824 8.07264 7.26421 8.07264Z"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M8.56473 11.0369H2.09725C1.94493 11.0369 1.80433 10.908 1.80433 10.744C1.80433 10.5917 1.94493 10.4511 2.09725 10.4511H8.56473C8.72876 10.4511 8.85765 10.5917 8.85765 10.744C8.85765 10.908 8.72876 11.0369 8.56473 11.0369Z"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M15.1142 20C15.1025 20 15.1025 20 15.0908 20C13.8957 19.8828 12.9584 19.379 12.2437 18.5003C10.4042 16.1804 10.908 12.0797 10.9197 11.9039C10.9432 11.775 11.0603 11.6696 11.1892 11.6579C14.1769 11.4001 14.8448 10.3691 14.8682 10.3222C14.9033 10.2753 14.9385 10.2402 14.9854 10.2168C15.1142 10.1465 15.3017 10.1933 15.372 10.3222C15.3954 10.3574 16.0633 11.4001 19.0627 11.6579C19.1916 11.6696 19.3087 11.775 19.3204 11.9039C19.3439 12.0797 19.8594 16.1804 18.0082 18.4886C17.3169 19.3556 16.3562 19.8594 15.1611 19.9766C15.1377 20 15.1377 20 15.1142 20ZM11.4821 12.2086C11.4001 13.0873 11.2361 16.321 12.7006 18.1371C13.2982 18.8869 14.1066 19.3322 15.1142 19.4259C16.1219 19.3322 16.942 18.8869 17.5395 18.1371C19.0041 16.3093 18.8401 13.0873 18.7581 12.2086C16.5319 11.9859 15.5243 11.3181 15.1142 10.908C14.7159 11.3064 13.7083 11.9625 11.4821 12.2086Z"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M14.5167 17.0006C14.4347 17.0006 14.3527 16.9772 14.3058 16.9186C14.2941 16.9069 14.2706 16.8951 14.2589 16.8717L12.8061 15.4657C12.5366 15.1728 12.5366 14.7276 12.7944 14.4347C13.0756 14.1652 13.5442 14.1652 13.8137 14.4347L14.505 15.1142L16.3796 13.2396C16.5202 13.099 16.696 13.0287 16.8834 13.0287C17.0826 13.0287 17.2583 13.099 17.3872 13.2396C17.5278 13.3685 17.5981 13.5442 17.5981 13.7434C17.5981 13.9309 17.5278 14.1066 17.3755 14.2589L14.7393 16.8951C14.7276 16.9069 14.7159 16.9186 14.6924 16.942C14.6573 16.9772 14.5987 17.0006 14.5167 17.0006ZM13.3333 14.7745C13.2982 14.7745 13.2513 14.7979 13.2279 14.8096C13.181 14.8799 13.181 14.9736 13.2279 15.0439L14.5167 16.3093L17.0006 13.8254C17.0475 13.7903 17.0475 13.7434 17.0475 13.72C17.0475 13.7083 17.0475 13.6614 17.0006 13.6262L16.9889 13.6028C16.9537 13.5794 16.9069 13.5559 16.8834 13.5559C16.8717 13.5559 16.8248 13.5559 16.7897 13.6028L14.7159 15.7001C14.6573 15.7586 14.587 15.7821 14.5167 15.7821C14.4464 15.7821 14.3644 15.7586 14.3175 15.7001L13.4388 14.8213C13.4153 14.7979 13.3568 14.7745 13.3333 14.7745Z"/>
                                </svg>
                            </span>
                        </h2>
                    </div>
                    <div className="Article__contentWrapper appStyledScroll">
                        <div className="Article__content">
                            <p>{ translateText(dictionary, 'politics_2') } 31.05.2025</p>
                            <p>{ translateText(dictionary, 'politics_3') }</p>
                            <h3 className="Article__subTitle">{ translateText(dictionary, 'politics_4') }</h3>
                            <h4 className="Article__caption">{ translateText(dictionary, 'politics_5') }</h4>
                            <p>{ translateText(dictionary, 'politics_6') }</p>
                            <h4 className="Article__caption">{ translateText(dictionary, 'politics_7') }</h4>
                            <p>{ translateText(dictionary, 'politics_8') }</p>
                            <h3 className="Article__subTitle">{ translateText(dictionary, 'politics_9') }</h3>
                            <p>{ translateText(dictionary, 'politics_10') }</p>
                            <h3 className="Article__subTitle">{ translateText(dictionary, 'politics_11') }</h3>
                            <p>{ translateText(dictionary, 'politics_12') }</p>
                            <h3 className="Article__subTitle">{ translateText(dictionary, 'politics_13') }</h3>
                            <p>{ translateText(dictionary, 'politics_14') }</p>
                            <h3 className="Article__subTitle">{ translateText(dictionary, 'politics_15') }</h3>
                            <p>{ translateText(dictionary, 'politics_16') }</p>
                            <h3 className="Article__subTitle">{ translateText(dictionary, 'politics_17') }</h3>
                            <p>{ translateText(dictionary, 'politics_18') }</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Politics;