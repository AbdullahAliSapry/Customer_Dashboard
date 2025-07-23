import { createSlice } from "@reduxjs/toolkit"
import { ITemplateData } from "../../interfaces/TemplateDataInterface"


const initialState = {
    templates: [] as ITemplateData[],
    error: null,
    loading: false
}


const TemplatesSlice = createSlice({
    name: 'templates',
    initialState,
    reducers: {
        SetTemplates: (state, action) => {
            state.templates = action.payload
        }
    }
})

export const { SetTemplates } = TemplatesSlice.actions
export default TemplatesSlice.reducer
