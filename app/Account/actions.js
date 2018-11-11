const facebookSdk = require('react-native-fbsdk');
const firebase = require('firebase');

const {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} = facebookSdk;

export const types = {
  USER_LOGIN_REQUEST: 'USER_LOGIN_REQUEST',
  USER_LOGIN_RESPONSE: 'USER_LOGIN_RESPONSE',
  USER_LOGOUT_REQUEST: 'USER_LOGOUT_REQUEST',
  USER_LOGOUT_RESPONSE: 'USER_LOGOUT_RESPONSE',
};

async function getFacebookAccessToken() {
  const fbLoginResult = await LoginManager.logInWithReadPermissions(['public_profile', 'user_friends']);
  console.log('fbLoginResult', fbLoginResult)
  if (fbLoginResult.isCancelled) {
    throw {message: 'Login was cancelled'};
  } else {
    return await AccessToken.getCurrentAccessToken();
  }
}

async function getCurrentUserInformation() {
  return await new Promise((resolve, reject) => {
    const infoRequest = new GraphRequest(
      '/me?fields=picture.type(large),name,id',
      null,
      (error, result) => {
        console.log('result', result)
        if (error) {
          reject(error);
        } else {
          resolve({
            id: result.id,
            fullName: result.name,
            avatar: result.picture.data.url
          });
        }
      }
    );
    new GraphRequestManager().addRequest(infoRequest).start();
  });
}

export const logOut = () => async (dispatch, getState) => {
  dispatch({type: types.USER_LOGOUT_REQUEST});
  try {
    await LoginManager.logOut();
    dispatch({type: types.USER_LOGOUT_RESPONSE, error: false});
  } catch (e) {
    dispatch({type: types.USER_LOGOUT_RESPONSE, payload: e, error: true});
  }
};

export const logIn = () => async (dispatch, getState) => {
  dispatch({type: types.USER_LOGIN_REQUEST});

  try {

    if (getState().currentUser) {
      await firebase.auth().signOut();
      await LoginManager.logOut();
    }

    const accessToken = await getFacebookAccessToken();
    const currentUserInfo = await getCurrentUserInformation();

    const credential = firebase.auth.FacebookAuthProvider.credential(accessToken.accessToken);
    await firebase.auth().signInWithCredential(credential);

    dispatch({
      type: types.USER_LOGIN_RESPONSE,
      payload: {
        accessToken: accessToken.accessToken,
        ...currentUserInfo,
      },
      error: false,
    });

  } catch (e) {
    dispatch({type: types.USER_LOGIN_RESPONSE, payload: e, error: true});
  }
};

