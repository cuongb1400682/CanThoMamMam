import {hasCategoryId, hasKeyword, hasUserId} from "./CategoryUtils";
import {isEmpty} from "./StringUtils";
import {commentComparator} from "./AggregateUtils";

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
        place.created_timestamp = firebase.database.ServerValue.TIMESTAMP;
        place.vote = {
            like: {"place_holder": false},
            unlike: {"place_holder": false}
        };
        await node.set(place);
        return node.key;
    }
}

export const fetchPlacesByUserIds = async (userIds = []) => {
    const result = [];

    await database.ref("/promotions").once("value", snap => {
        snap.forEach(child => {
            const val = child.val();
            if (val && val.user && val.user.id) {
                if (userIds.includes(val.user.id)) {
                    result.push({
                        id: child.key,
                        ...val
                    })
                }
            }
        })
    });

    return result;
};

// query can contain either
//    userId: string
//    categories: oneOf(food, cafe, pub)
//    {} to query all places
export async function fetchPlaces(placesRef, query) {
    let items = [];
    let ref = placesRef;

    if (query) {
        if (query.userIds instanceof Array) {
            return await fetchPlacesByUserIds(query.userIds);
        }
        if (hasUserId(query)) {
            ref = placesRef
                .orderByChild('user/id')
                .equalTo(query.userId);
        }
        if (hasCategoryId(query)) {
            ref = placesRef
                .orderByChild('category')
                .equalTo(query.id);
        }
        if (hasKeyword(query)) {
            ref = placesRef
                .orderByChild('search_name')
                .startAt(query.keyword)
                .endAt(query.keyword + "\uf8ff");
        }
        if (query.which) {
            if (Object.getOwnPropertyNames(query.which).length === 0) {
                return [];
            }
            ref = placesRef;
        }
    }

    await ref.once('value', snapshot => {
        // get children as an array
        snapshot.forEach(child => {
            const val = child.val();
            const id = child.key;
            if (query.which) {
                query.which[id] && items.push({id, ...val});
            } else {
                items.push({id, ...val});
            }
        });
    });

    if (hasCategoryId(query)) {
        items = items.filter(item => item.category === query.id);
    }

    if (hasUserId(query)) {
        items = items.filter(item => item.user.id === query.userId);
    }

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
    await database
        .ref()
        .child("comments/" + placeId)
        .remove();
    await database
        .ref()
        .child('users')
        .once('value', snapshot => {
            snapshot.forEach(child => {
                try {
                    database.ref(`/users/${child.key}/likedPlaces/${placeId}`).remove();
                } catch (e) {
                }
            })
        });
}

export async function fetchUsersInfo(usersRef, query = null) {
    let ref = usersRef;

    if (query) {
        if (!isEmpty(query.userId)) {
            ref = usersRef
                .orderByChild('id')
                .equalTo(query.userId);
        } else if (!isEmpty(query.fullName)) {
            ref = usersRef
                .orderByChild('fullName')
                .equalTo(query.fullName);
        }
    }

    let items = {};
    await ref.once('value', snapshot => {
        snapshot.forEach(child => {
            items[child.key] = child.val();
        });
    });


    return items;
}

export async function addUserInfo(user) {
    if (user) {
        const node = await database
            .ref(`users/${user.id}`);
        await node.child('avatar').set(user.avatar);
        await node.child('fullName').set(user.fullName);
        await node.child('id').set(user.id);
        return node.key;
    }
}

export async function toggleVote(placeId, userId, isToggleLike, oldState) {
    const like_AtUserId = database.ref(`/promotions/${placeId}/vote/like/${userId}`);
    const unlike_AtUserId = database.ref(`/promotions/${placeId}/vote/unlike/${userId}`);

    await removeLikedPlace(userId, placeId);

    if (isToggleLike) {
        await like_AtUserId.set(!oldState);
        await unlike_AtUserId.set(false);
        if (!oldState) {
            await addLikedPlace(userId, placeId);
        }
    } else {
        await unlike_AtUserId.set(!oldState);
        await like_AtUserId.set(false);
    }
}

export async function fetchComments(commentsRef) {
    let items = [];

    await commentsRef
        .once('value', snapshot => {
            snapshot.forEach(child => {
                const val = child.val();
                const id = child.key;
                items.push({
                    id,
                    ...val
                });
            });
        });

    return items.sort(commentComparator);
}

export async function addComment(commentsRef, comment) {
    const node = await commentsRef.push();
    comment.created_timestamp = firebase.database.ServerValue.TIMESTAMP;
    await node.set(comment);
    comment.id = node.key;
    return comment;
}

export async function changeCommentContent(placeId, commentId, newContent) {
    await database.ref(`/comments/${placeId}/${commentId}/content`)
        .set(newContent);
}

export async function deleteComment(commentsRef, commentId) {
    await commentsRef.child(commentId).remove();
}

export async function addLikedPlace(userId, placeId) {
    await database
        .ref(`/users/${userId}/likedPlaces/${placeId}`)
        .set(true);
}

export async function removeLikedPlace(userId, placeId) {
    await database
        .ref(`/users/${userId}/likedPlaces/${placeId}`)
        .set(false);
}

export async function addSubscription(currentUserId, authorId) {
    await database
        .ref(`/users/${currentUserId}/subscriptions/${authorId}`)
        .set(true);
}

export async function removeSubscription(currentUserId, authorId) {
    await database
        .ref(`/users/${currentUserId}/subscriptions/${authorId}`)
        .remove();
}
