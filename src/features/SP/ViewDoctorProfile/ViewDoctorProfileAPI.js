import { BaseUrl } from "../../../utils/apiHelpers"

const getTabUrl = (doctorId, tabIndex) => {
    switch (tabIndex) {
        case 0: return 'personal info url'
        case 1: return 'professional info url'
        case 2: return 'treatment info url'
        case 2: return 'business info url'
        case 2: return 'profile url'
    }
}

export const getTabData = (doctorId, tabIndex, setTabData) => {
    setTabData(null)
    const url = BaseUrl() + getTabUrl(doctorId, tabIndex)
    // do the fetch here and then setTabData(json.data)
}