import {isEmpty} from "./StringUtils";

export const firebase = require('firebase');

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC6a2UEHsWWKvdeUWzK_AF9S9N1yVttsy0",
  authDomain: "can-tho-trong-tay.firebaseapp.com",
  databaseURL: "https://can-tho-trong-tay.firebaseio.com",
  storageBucket: "can-tho-trong-tay.appspot.com",
  messagingSenderId: "667193688060",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
export const database = firebaseApp.database();

export async function addNewPlace(place) {
  if (place) {
    const node = await database
      .ref('promotions')
      .push();
    await node.set(place);
    return node.key;
  }
}

// query can contain either
//    userId: string
//    categories: oneOf(food, cafe, pub, gym, supermarket, bookstore)
//    {} to query all places
export async function fetchPlaces(placesRef, query) {
  let items = [];
  let ref = placesRef;
  if (query) {
    // the priority of query is userId < category < keyword
    if (query.userId) {
      ref = placesRef
        .orderByChild('user/id')
        .equalTo(query.userId);
    }
    if (typeof(query.id) === 'number' && query.id > -1) {
      ref = placesRef
        .orderByChild('category')
        .equalTo(query.id);
    }
    if (query.keyword && !isEmpty(query.keyword)) {
      ref = placesRef
        .orderByChild('name')
        .startAt(query.keyword)
        .endAt(query.keyword + "\uf8ff");
    }
  }
  await ref.once('value', snapshot => {
    // get children as an array
    snapshot.forEach(child => {
      const val = child.val();
      const id = child.key;
      items.push({id, ...val});
    });
  });
  return items;
}

export async function saveChanges(place) {
  if (place) {
    const {id} = place;
    //delete place.id; // remove id from place
    const updateData = {['promotions/' + id]: place};
    await database
      .ref()
      .update(updateData)
  }
}

export async function deletePlace(placeId) {
  if (!placeId) {
    throw "must provide placeId";
  }
  await database
    .ref()
    .child("promotions/" + placeId)
    .remove();
}
