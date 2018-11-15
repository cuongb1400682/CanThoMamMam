export function getPlacesStatistic(places) {
  let ans = {
    coffee: 0,
    pub: 0,
    food: 0,
    total: 0,
  };

  for (let i = 0; !!places && (i < places.length); i++) {
    if (places[i].category === 0) {
      ans.food++;
    }
    if (places[i].category === 1) {
      ans.coffee++;
    }
    if (places[i].category === 2) {
      ans.pub++;
    }
    ans.total++;
  }

  return ans;
}

export function countLikeUnlikeNumber(voters, currentUser) {
  let like = 0;
  let unlike = 0;
  let isCurrentUserLikeThis = false;
  let isCurrentUserUnlikeThis = false;

  if (!voters) {
    voters = {};
  }

  if (!voters.like) {
    voters.like = {};
  }

  if (!voters.unlike) {
    voters.unlike = {};
  }

  for (let voter in voters.like) {
    if (voters.like.hasOwnProperty(voter)) {
      if (voters.like[voter]) {
        like++;
      }
    }
  }

  for (let voter in voters.unlike) {
    if (voters.unlike.hasOwnProperty(voter)) {
      if (voters.unlike[voter]) {
        unlike++;
      }
    }
  }

  if (currentUser) {
    if (voters.like.hasOwnProperty(currentUser.id)) {
      isCurrentUserLikeThis = !!voters.like && voters.like[currentUser.id];
    }
    if (voters.unlike.hasOwnProperty(currentUser.id)) {
      isCurrentUserUnlikeThis = !!voters.unlike && voters.unlike[currentUser.id];
    }
  }

  return {
    like,
    unlike,
    isCurrentUserLikeThis,
    isCurrentUserUnlikeThis,
  };
}

export function countUserFavoritePlaces(userInfo) {
  if (!userInfo || !userInfo.hasOwnProperty("likedPlaces")) {
    return 0;
  }

  let ans = 0;

  for (let place in userInfo.likedPlaces) {
    if (userInfo.likedPlaces.hasOwnProperty(place)) {
      if (userInfo.likedPlaces[place]) {
        ans++;
      }
    }
  }

  return ans;
}
