import {ToastAndroid} from "react-native";

export const showMessage = message => ToastAndroid.show(message, ToastAndroid.SHORT);