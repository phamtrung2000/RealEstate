import React, { Component, useEffect, useState } from 'react';
import { Fragment } from 'react/cjs/react.production.min';
import './password.css'
import eyeOn from "../../assests/sign_up/eye_on.png"
import { useHistory } from 'react-router-dom';
import eyeOff from "../../assests/sign_up/eye_off.png"
import { toast, ToastPosition } from 'react-toastify';
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import { checkValidPassword } from '../sign//valid-password';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

toast.configure()
const Password = () => {
    const history = useHistory();
    const [isShowCurrentPassword, setIsShowCurrentPassword] = useState(false);
    const [isShowNewPassword, setIsShowNewPassword] = useState(false);
    const [isShowReNewPassword, setIsShowReNewPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [reNewPassword, setReNewPassword] = useState("");
    const [isValidPassword, setIsValidPassword] = useState(true);
    const [isValidNewPassword, setIsValidNewPassword] = useState(true);
    const [isValidReNewPassword, setIsValidReNewPassword] = useState(true);
    const [passwordError, setPasswordError] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [rePasswordError, setRePasswordError] = useState("");
    let user;
    const handleCancel = () => {
        history.goBack();
    }

    const handleSave = () => {
        validateCurrentPassword(currentPassword);
        validateNewPassword(newPassword);
        validateReNewPassword(newPassword, reNewPassword);
        if (checkValidPassword(newPassword) && checkValidPassword(reNewPassword) && checkValidPassword(currentPassword) && currentPassword && newPassword && reNewPassword && newPassword === reNewPassword) {
            changePassword(currentPassword, newPassword)
        }
    }

    const changePassword = (currentPassword, newPassword) => {
        const Token = Cookies.get("token");
        user = JSON.parse(atob(Token.split(".")[1]));
        console.log(user.id);
        axios
            .patch(`${process.env.REACT_APP_API_URL}/api/v1/user/changePassword/${user.id}`, {
                oldPassword: currentPassword,
                newPassword: newPassword
            })
            .then(res => {
                toast.success('???? thay ?????i m???t kh???u th??nh c??ng', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setCurrentPassword("");
                setNewPassword("");
                setReNewPassword("");
            })
            .catch(err => {
                const code = err.message.substring(32, err.message.length);
                if (code == "409") {
                    toast.error('Kh??ng tr??ng kh???p m???t kh???u hi???n t???i. Vui l??ng ki???m tra l???i', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
                else {
                    toast.error('L???i m???ng kh??ng x??c ?????nh', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            });

    }
    const validateCurrentPassword = (password) => {
        if (!checkValidPassword(password)) {
            setIsValidPassword(false);
            if (!password) {
                setPasswordError("M???t kh???u kh??ng ???????c ????? tr???ng")
            }
            else {
                setPasswordError("M???t kh???u t???i thi???u 6 k?? t??? bao g???m t???i thi???u 1 k?? t??? in hoa v?? 1 ch??? s???")
            }
        }
        else {
            setIsValidPassword(true)
        }
    }
    const validateNewPassword = (newPassword) => {
        if (!checkValidPassword(newPassword)) {
            setIsValidNewPassword(false);
            if (!newPassword) {
                setNewPasswordError("M???t kh???u m???i kh??ng ???????c ????? tr???ng")
            }
            else {
                setNewPasswordError("M???t kh???u t???i thi???u 6 k?? t??? bao g???m t???i thi???u 1 k?? t??? in hoa v?? 1 ch??? s???")
            }
        }
        else {
            setIsValidNewPassword(true);
        }
    }
    const validateReNewPassword = (newPassword, reNewPassword) => {
        if (!checkValidPassword(reNewPassword)) {
            setIsValidReNewPassword(false);
            if (!reNewPassword) {
                console.log("go to line 85");
                setRePasswordError("Nh???p l???i m???t kh???u kh??ng ???????c ????? tr???ng")
            }
            else {
                console.log("go to line 89");
                setRePasswordError("M???t kh???u t???i thi???u 6 k?? t??? bao g???m t???i thi???u 1 k?? t??? in hoa v?? 1 ch??? s???")
            }
        }
        else {
            if (newPassword && reNewPassword && newPassword !== reNewPassword) {
                console.log("go to line 95");
                setIsValidReNewPassword(false);
                setRePasswordError("M???t kh???u kh??ng kh???p")
            }
            else if (newPassword && reNewPassword && newPassword === reNewPassword) {
                console.log("go to line 101");
                setIsValidReNewPassword(true);
            }
        }
    }
    return (
        <Fragment>
            <div className="main-password-container">
                <div className="m-top-38 m-left-24 password-input-container">
                    <span className="m-right-30">M???t kh???u hi???n t???i</span>
                    <div className={isValidPassword ? "input-field" : "invalid-input-field"}>
                        <input
                            className="password-form-input"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            type={isShowCurrentPassword ? "text" : "password"}
                            placeholder="Nh???p m???t kh???u hi???n t???i" />
                        <div className="separator"></div>
                        <button className="change-password-btn" onClick={() => setIsShowCurrentPassword(prev => !prev)}>
                            <img src={isShowCurrentPassword ? eyeOn : eyeOff} />
                        </button>
                    </div>
                </div>
                {!isValidPassword && <small className="text-danger">{passwordError}</small>}
                <div className="m-top-24 m-left-24 password-input-container">
                    <span className="m-right-55">M???t kh???u m???i</span>
                    <div className={isValidNewPassword ? "input-field" : "invalid-input-field"}>
                        <input
                            className="password-form-input"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            type={isShowNewPassword ? "text" : "password"}
                            placeholder="Nh???p m???t kh???u m???i" />
                        <div className="separator"></div>
                        <button className="change-password-btn" onClick={() => setIsShowNewPassword(prev => !prev)}>
                            <img src={isShowNewPassword ? eyeOn : eyeOff} />
                        </button>
                    </div>
                </div>
                {!isValidNewPassword && <small className="text-danger">{newPasswordError}</small>}
                <div className="m-top-24 m-left-24 password-input-container">
                    <span className="m-right-24">Nh???p l???i m???t kh???u</span>
                    <div className={isValidReNewPassword ? "input-field" : "invalid-input-field"}>
                        <input
                            className="password-form-input"
                            value={reNewPassword}
                            onChange={(e) => setReNewPassword(e.target.value)}
                            type={isShowReNewPassword ? "text" : "password"}
                            placeholder="Nh???p l???i m???t kh???u m???i" />
                        <div className="separator"></div>
                        <button className="change-password-btn" onClick={() => setIsShowReNewPassword(prev => !prev)}>
                            <img src={isShowReNewPassword ? eyeOn : eyeOff} />
                        </button>
                    </div>
                </div>
                {!isValidReNewPassword && <small className="text-danger">{rePasswordError}</small>}
                <div className="button-container">
                    <button
                        onClick={handleCancel}
                        className="cancel-btn m-top-24 m-left-337">H???y</button>
                    <button
                        onClick={handleSave}
                        className="save-btn m-top-24 m-left-16">L??u</button>
                </div>

            </div>
        </Fragment>
    );

}

export default Password;
