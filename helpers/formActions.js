import {checkContent} from "./formFieldValidator";

export const setValue = (action, state) => {
    //create an errors array
    const errors = []

    //stop double spaces and get rid of leading space
    let value = action.value.replace("  ", " ").replace(/^\s/g, '')

    //if param is set to upper or lower case make val upper/lower
    if(state[action.data.param].uppercase) {
        value = value.toUpperCase()
    }
    if(state[action.data.param].lowercase) {
        value = value.toLowerCase()
    }

    //check if content is set to required and if it is check for content and then create error if necessary
    if(state[action.data.param].required) {
        const contentError = checkContent(value, action.data)
        if(contentError) {
            errors.push(contentError)
        }
    }

    //check for validation requirements and add any failures to the error array
    if(state[action.data.param].validate.length > 0) {
        state[action.data.param].validate.forEach(val => {  const error = val.check({value, checkParams: val.checkParams, msg: val.msg, data: action.data})
            if (error) {errors.push(error)}})
    }

    //modify state with the new value
    state[action.data.param].value = value

    //check for existing errors for the param and replace with new errors
    if(errors.length > 0) {
        const otherParamErrors = state.errors.filter(error => error.param !== action.data.param && error)
        state.errors = [...otherParamErrors, ...errors]
    } else {
        state.errors = state.errors.filter(error => error.param !== action.data.param && error)
    }

    //clear empty error for this param
    state.emptyErrors = state.emptyErrors.filter(error => error.param !== action.data.param && error)

    return state
}

//Checks if a param is required and if it is it will check that there is content selected
//Returns an array of errors
export const checkEmptyParams = state => {
    const emptyErrors = []
    Object.keys(state).forEach(key => {
        state[key].required && state[key].value === '' && emptyErrors.push({
            src: 'form', msg: state[key].type === 'image' ? `Please upload a receipt photo` : `Please enter a value for ${state[key].label}`, param: key, label: state[key].label
        })
    })

    return emptyErrors
}