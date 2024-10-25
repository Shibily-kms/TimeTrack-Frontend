import React from 'react'
import './customerprofile1.scss'
import Badge from '../../common/badge/Badge'
import { getUserProfileImagePath } from '../../../assets/javascript/find-helpers';
import { TfiArrowRight } from 'react-icons/tfi';

const CustomerProfile1 = ({ profileData }) => {
    const userProfileImage = getUserProfileImagePath(profileData?.full_name || 'Shibliy');
    return (
        <div className="customer-profile-v1-comp-div">
            <div className="boarder-div">
                <div className="profile-image-div">
                    <div className="image-div">
                        <img src={userProfileImage} alt='Profile' />
                    </div>
                </div>
                <div className="profile-info-div">
                    <div className="info-div">
                        <h4>CID : 8888 <span> | </span> Mohamed Shibily K</h4>
                        <p>NORTH <span> | </span> Kakkattil House Puzhakkattiri P.O</p>
                        <div className="badges-list-div">
                            <Badge text={'4.5'} className={'success-fill'} />
                            <Badge text={'AMC'} className={'success-fill'} />
                            <Badge text={'O/W'} className={'success-fill'} />
                        </div>
                    </div>
                </div>
                <div className="arrow-div">
                    <TfiArrowRight />
                </div>
            </div>
        </div>
    )
}

export default CustomerProfile1