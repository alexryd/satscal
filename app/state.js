import {Map, Record} from 'immutable'

export default Record({
  login: Map({
    username: '',
    password: '',

    loading: false
  })
})
