export const useGetUserInfo = () => {
    const {name, userID, isAuth} = JSON.parse(localStorage.getItem("auth")) || {};
    return{name, userID, isAuth};
}