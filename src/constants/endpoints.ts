const baseUrl = "http://localhost:5041/api"
export const ApiEndpoints = {
    LOGIN: `${baseUrl}/Authentication/login`,
    REGISTER: `${baseUrl}/Authentication/register`,
    REFRESH: `${baseUrl}/Authentication/refresh`,
    LOGOUT: `${baseUrl}/Authentication/logout`,
    INTROSPECT: `${baseUrl}/Authentication/introspect`,
    SEARCH_USER_IN_FRIEND: `${baseUrl}/User/searchUserInFriend`,
    GET_FRIEND_REQUESTS: `${baseUrl}/Friendship/friendRequests`
}