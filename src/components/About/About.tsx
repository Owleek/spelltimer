import React from 'react';
import {useSelector} from 'react-redux';
import {TStoreState} from '../../store/store';
import { translateText } from '../../utils/utils';
import '../../article.scss';

const About = () => {
    const {dictionary} = useSelector((state: TStoreState) => state.localeSlice);
    if (!dictionary) return;

    return <div className="Article">
        <div className="Article__body">
            <div className="adjustCenter">
                <div className="Article__bodyInner">
                    <div className='Article__contentHeader'>
                        <h2 className='Article__title'>
                            { translateText(dictionary, 'about') }
                            <span className="Article__titleIcon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41 32">
                                    <path d="M39.3125 31.625H1.6875C1.28438 31.625 0.746875 31.3563 0.478125 30.9531C0.209375 30.55 0.209375 30.0125 0.478125 29.6094L3.16563 25.5781C3.43438 25.175 3.8375 24.9062 4.375 24.9062H36.625C37.1625 24.9062 37.5656 25.175 37.8344 25.7125L40.5219 29.7437C40.7906 30.1469 40.6562 30.6844 40.5219 31.0875C40.2531 31.3562 39.7156 31.625 39.3125 31.625Z"/>
                                    <path d="M35.2813 0.71875H5.71875C4.9125 0.71875 4.375 1.25625 4.375 2.0625V20.875C4.375 21.6813 4.9125 22.2188 5.71875 22.2188H35.2813C36.0875 22.2188 36.625 21.6813 36.625 20.875V2.0625C36.625 1.25625 36.0875 0.71875 35.2813 0.71875ZM14.7219 14.5594C15.2594 15.0969 15.2594 15.9031 14.7219 16.4406C14.4531 16.7094 14.1844 16.8438 13.7812 16.8438C13.3781 16.8438 13.1094 16.7094 12.8406 16.4406L8.80938 12.4094C8.27188 11.8719 8.27188 11.0656 8.80938 10.5281L12.8406 6.49688C13.3781 5.95938 14.1844 5.95938 14.7219 6.49688C15.2594 7.03438 15.2594 7.84062 14.7219 8.37812L11.6312 11.4688L14.7219 14.5594ZM24.3969 6.63125L19.0219 17.3813C18.7531 17.9188 18.35 18.1875 17.8125 18.1875C17.5438 18.1875 17.4094 18.1875 17.275 18.0531C16.6031 17.7844 16.3344 16.9781 16.7375 16.3063L22.1125 5.55625C22.3813 4.88438 23.1875 4.61562 23.8594 5.01875C24.3969 5.2875 24.6656 6.09375 24.3969 6.63125ZM32.1906 12.4094L28.1594 16.4406C27.8906 16.7094 27.6219 16.8438 27.2188 16.8438C26.8156 16.8438 26.5469 16.7094 26.2781 16.4406C25.7406 15.9031 25.7406 15.0969 26.2781 14.5594L29.3688 11.4688L26.2781 8.37812C25.7406 7.84062 25.7406 7.03438 26.2781 6.49688C26.8156 5.95938 27.6219 5.95938 28.1594 6.49688L32.1906 10.5281C32.7281 11.0656 32.7281 11.8719 32.1906 12.4094Z"/>
                                </svg>
                            </span>
                        </h2>
                    </div>
                    <div className="Article__contentWrapper appStyledScroll">
                        <div className="Article__content">
                            <p>{ translateText(dictionary, 'about_1') }</p>
                            <p>{ translateText(dictionary, 'about_2') }</p>
                            <p>{ translateText(dictionary, 'about_3') }</p>
                            <p>{ translateText(dictionary, 'about_4') }</p>
                            <p>{ translateText(dictionary, 'about_5') }</p>
                            <p>{ translateText(dictionary, 'about_6') }</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default About;