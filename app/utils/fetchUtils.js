/**
 * Created by letqt on 31/8/17.
 */
export function post(url, header, body) {
  return fetch(url, {
      method: 'POST',
      headers: header,
      body: body
    }
  )
    .then(response => response.json())
    .then(jsonResponse => {
      console.log(url, jsonResponse)
      return jsonResponse
    })
    .catch(e => {
      console.log(url, e)
    })
}