// function to add questions to forms

import Dropdown from "./dropdown";

// inputType is for validation ('number' or 'text', etc)
function appendFormElement(label, inputEl, inputId, required) {

    // change if we want forms elsewhere
    const form = document.getElementById('new-form');

    // create outer wrapper for element
    const wrapper = document.createElement('div');  

    // label question
    const labelEl = document.createElement('label');
    labelEl.textContent = label;

    // mark as required if applicable
    inputEl.required = required;

    // If an ID is provided, set it on the element
    if (inputId) {
        inputEl.id = inputId;
    }
  
    // add elements
    wrapper.appendChild(labelEl);
    wrapper.appendChild(inputEl);
    form.appendChild(wrapper);
} 

export const NewField = {
    shortText : function(label, inputId, required = false) {
        const inputEl = document.createElement('input');
        inputEl.type = 'text';
        appendFormElement(label, inputEl, inputId,required);
    },
    longText : function(label, inputId, required = false) {
        const inputEl = document.createElement('textarea');
        appendFormElement(label, inputEl, inputId, required);
    },
    numericInput : function(label, inputId, required = false) {
      const inputEl = document.createElement('input');
      inputEl.type = 'number';
      appendFormElement(label, inputEl, inputId,required);
    },
    dropdown : function(label, inputId, optionArray, required = false){
      const inputEl = Dropdown.create(optionArray);
      appendFormElement(label, inputEl, inputId, required);
    }
}

export default NewField;