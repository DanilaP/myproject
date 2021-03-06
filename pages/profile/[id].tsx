import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import message from "../../public/images/message.svg";
import { $user, getUserDataByLoginUrl, isAsyncLoaded, setCurrentPage, setIsAsyncLoaded, setUser, User } from "../../global/store/store";
import s from "./profile.module.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from "next/image";
import Interests from "./interests/interests";
import Places from "./places/places";
import ImageList from "./ImageList/ImageList";
import { useStore } from "effector-react";
import Loader from "../../global/Loader/Loader";
import About from "./About/About";
import LeftNavMenu from "../../global/LeftNavMenu/LeftNavMenu";
import InputFile from "../../global/helpers/InputFile/InputFile";
import { updateUserAvatar } from "../../global/store/settings_model";

function Profile(): JSX.Element {

    const route = useRouter();
    const asyncLoaded = useStore(isAsyncLoaded);

    const [currentUser, setCurrentUser] = useState<User>();
    const [addingImageStatus, setAddingImageStatus] = useState<boolean>(false);
    const authedUser = useStore($user);

    const changeAddingImageStatus = (status: boolean) => {
        if(currentUser?.email === authedUser?.email) {
            setAddingImageStatus(() => status);
        }
    }
    const onChangeInputImage = (event: any) => {
        updateUserAvatar(event).then((res: any) => {
            if(res.status === 200) {
                setCurrentUser(res.data)
                setUser(res.data);
            }
        })
    }
    useEffect( () => {
        setCurrentPage(route.pathname);
        if(route.query.id !== undefined) {
            getUserDataByLoginUrl(String(route.query.id)).then( (res) => {
                if(res?.status <= 227) {
                    setCurrentUser(() => res.data);
                    setIsAsyncLoaded(true);
                }
            })
        }
    }, [route])
    return( 
        <div className={s.profile}>
            <div className="row">
                <div className={`col-md-3 ${s.navCol}`}>
                    <LeftNavMenu />
                </div>
                {asyncLoaded 
                ? 
                <div className={`col-md-8 ${s.bodyCol}`}>
                <div className={`row`}>
                    <div className={`col-md-4 ${s.bodyInfo}`}>
                       {!addingImageStatus ?
                       <img 
                        onMouseEnter={() => changeAddingImageStatus(true)}
                        src={'https://api.meetins.ru/' + currentUser?.avatar}
                        alt="????????????????" 
                        className={`${s.avatar}`}
                        /> : <InputFile 
                                onChange={(event) => onChangeInputImage(event)} 
                                onMouseLeave={() => changeAddingImageStatus(false)}
                            />}
                    </div>
                    <div className={`col-md-8 ${s.userInfo}`}>
                        <div className="row">
                            <div className={`col ${s.userName}`}>
                                {currentUser?.firstName + " " + currentUser?.lastName}
                            </div>
                            <button className={`col ${s.status}`}>
                                ?? ?????????????? ????????????
                            </button>
                        </div> 
                        <div className={`${s.text}`}>
                            <About user={currentUser} about={'?????????? ??????, ?????????????????? ???????? ????????????, ???????????????? ?????????? ?? ????????????????, ??????????????.'}/>
                        </div>
                        { JSON.stringify(currentUser) !== JSON.stringify(authedUser) ?
                        <div className={`${s.actions}`}>
                            <button type="button" className={`${s.actionsBtn}`}>
                                ????????????
                                <Image alt="??????????????????" src={message} width={20} height={20} />
                            </button>
                            <button type="button" className={`${s.actionsBtn}`}>?????????????????????? +</button>
                        </div> : null
                        }
                    </div>
                </div>
                <div className={`row ${s.moreInfo}`}>
                    <div className="col">
                        <Interests interest={['????????????????','????????','????????????????','????????']}/>
                    </div>
                    <div className="col">
                        <Places places={['???????????? ????????????','????????????','??????????','??????????']}/>
                    </div>
                </div> 
                <div className={`row`}>
                    <div className="col">
                        <ImageList images={[]} />
                    </div>
                </div>
            </div> : <Loader/>}
            </div>
        </div>
    )
}

export default Profile;