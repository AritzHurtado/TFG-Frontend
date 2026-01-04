export interface FormComponent {
    "base": "input" | "textarea" | "select";
    "name": string;
}

export interface FormInput extends FormComponent {
    "base": "input";
    "type": "text" | "number";
}

export interface FormTextInput extends FormInput {
    "type": "text";
    "placeholder": string;
    "maxLenght": number;
}

export interface FormNumberInput extends FormInput {
    "type": "number";
    "default": number;
    "max": number;
    "min": number;
}

export interface FormTextArea extends FormComponent {
    "base": "textarea";
    "placeholder": string;
    "maxLenght": number;
}

export interface FormSelect extends FormComponent {
    "base": "select";
    "options": string[];
}