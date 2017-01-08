import {Map, Record} from 'immutable'

export default Record({
  currentScreen: 'login',

  login: Map({
    username: '',
    password: '',

    loading: false,

    error: null
  }),

  link: Map({
    name: '',
    imageUrl: null,
    token: null
  })
})
