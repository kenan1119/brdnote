import UUID from 'uuid-js'

const state = {
  title: null,
  path: null,
  tags: [],
  saved: false
}

const getters = {
  title: state => {
    return state.title
  },
  path: state => {
    return state.path
  },
  tags: state => {
    return state.tags
  },
  saved: state => {
    return state.saved
  },
  getTag: state => tag => {
    return state.tags.findIndex((element) => {
      return element.tag === tag
    })
  }
}

const actions = {}

const mutations = {
  updateTitle: (state, { title }) => {
    state.title = title
  },
  updatePath: (state, { path }) => {
    state.path = path
  },
  updateSavingStatus: (state, status) => {
    state.saved = status
  },
  initTags: (state, { tags }) => {
    state.tags = tags
  },
  addTag: (state, { tag }) => {
    const index = state.tags.findIndex((element) => {
      return element.tag === tag
    })
    if (index < 0) {
      state.tags.push({
        id: UUID.create(4).toString(),
        tag: tag
      })
    }
  },
  deleteTag: (state, { id }) => {
    const index = state.tags.findIndex((element) => {
      return element.id === id
    })
    if (index >= 0) {
      state.tags.splice(index, 1)
    }
  },
  changeTag: (state, { id, tag }) => {
    const index = state.tags.findIndex((element) => {
      return element.tag === tag
    })
    if (index < 0) {
      const target = state.tags.findIndex((element) => {
        return element.id === id
      })
      state.tags[target].tag = tag
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}