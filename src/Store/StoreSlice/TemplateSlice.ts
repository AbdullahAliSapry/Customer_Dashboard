import { createSlice } from "@reduxjs/toolkit"


const intial = {
    templates: [],
    currentTemplate: null,
    loading: false
}


const TemplateSlice = createSlice({
    name: 'template',
    initialState: intial,
    reducers: {
        SetTemplatesStore: (state, action) => {
            state.templates = action.payload;
            state.loading = false;
        },
        SetCurrentTemplateStore: (state, action) => {
            state.currentTemplate = action.payload;
            state.loading = false;
        }
    }
})


export const { SetTemplatesStore, SetCurrentTemplateStore } = TemplateSlice.actions;

export default TemplateSlice.reducer;










