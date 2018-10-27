import magicAPI from './api/magic'
import stateAPI from './api/state'
import classesAPI from './api/classes'

function handleError(error) {
  console.error(error)
}

export default {
  save({ state }) {
    stateAPI.save(state).catch(handleError)
  },

  restore({ commit }, { gameId }) {
    stateAPI
      .restore(gameId)
      .then(data => {
        commit('setState', data)
      })
      .catch(handleError)
  },

  updateClass({ commit }, { charIndex, classIndex, className, level }) {
    magicAPI
      .getSlots([{ class: className, level }])
      .then(data => {
        commit('setClass', {
          charIndex,
          classIndex,
          className,
          slots: data.Slots,
        })
      })
      .catch(handleError)
  },

  retrieveClassOptions({ commit }) {
    classesAPI
      .getClassOptions()
      .then(data => {
        commit('setClassOptions', {
          classOptions: data.Classes,
          magicClassOptions: data.MagicClasses,
        })
      })
      .catch(handleError)
  },
}
