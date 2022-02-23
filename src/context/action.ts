export const changeTheme = (state:any, dispatch:any) => {
    dispatch({ type: "change", theme:state.theme });
};