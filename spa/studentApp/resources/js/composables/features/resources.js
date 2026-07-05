import { ref } from 'vue'
import { useRequest } from '../core/request.js'

export function useResources(baseUrl) {
    const { error, isLoading, get, post, put, del } = useRequest()
    const items = ref([])
    const item = ref(null)

    // pobranie listy wszystkich rekordów
    const getAll = async () => {
        const response = await get(baseUrl)
        // bezpieczne odpakowanie kolekcji Laravela
        if (response && response.data) {
            items.value = Array.isArray(response.data) ? response.data : (response.data.data || [])
        } else if (Array.isArray(response)) {
            items.value = response
        }
        return response
    }

    // pobranie jednego rekordu
    const getSingle = async (id) => {
        const response = await get(`${baseUrl}/${id}`)
        if (response && response.data) {
            item.value = response.data.data || response.data
        } else {
            item.value = response
        }
        return response
    }

    // utworzenie rekordu
    const create = (payload) => {
        return post(baseUrl, payload)
    }

    // aktualizacja rekordu
    const update = (id, payload) => {
        return put(`${baseUrl}/${id}`, payload)
    }

    // usunięcie rekordu
    const remove = (id) => {
        return del(`${baseUrl}/${id}`)
    }

    return {
        items,
        item,
        error,
        isLoading,
        getAll,
        getSingle,
        create,
        update,
        remove
    }
}
