import { ADD_CATEGORY, REMOVE_CATEGORY } from './action'

const initital = {
    items:[]
}

const categorys = (state = initital, action) => {
    switch (action.type) {
        case ADD_CATEGORY:
          return {
              ...state,
              items: [...state.items , action.payload]
          }
        case REMOVE_CATEGORY:
            const stateNew ={
                items:[]
            }
            return stateNew;
        default:
            return state;
    }
}

const categorysReducer = {
    categorys

}

export default categorysReducer;