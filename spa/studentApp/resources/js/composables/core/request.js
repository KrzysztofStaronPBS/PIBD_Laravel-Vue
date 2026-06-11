import { ref } from 'vue'

export function useRequest() {
    const data = ref(null)
    const error = ref(null)
    const isLoading = ref(false)

    const request = async (url, options = {}) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await axios.request({
                method: options.method || 'GET',
                url: url,
                headers: {...options.headers },
                data: options.payload,
            })

            data.value = response.data  //Odebrane dane przypisywane do zmiennej reaktywnej i również
            return response.data        //zwracane przez funkcję (dwie opcje dla programisty)
        } catch (e) {
            if (e.response) {
                if (e.response?.status == 422) {
                    //Jeżeli wystąpią błędy walidacyjne i są zwracane serwer
                    error.value = e?.response?.data?.errors;
                } else {
                    //dla wiadomości z serwera typu: response()->json(['message'=>'A message..'],404);
                    error.value = `${e.response?.status} - ${e.response.data?.message || e.response?.statusText || 'A resource doesnt exist'}`
                }
            } else {
                //W przypadku wystąpienia innych problemów (np. brak odpowiedzi z serwera)
                error.value = e.message || 'An unexpected error';
            }
            throw e
        } finally {
            isLoading.value = false
        }
    }
    //Funkcje pomocnicze
    const get = (url) => request(url, { method: 'GET' })
    const post = (url, payload) => request(url, { method: 'POST', payload })
    const put = (url, payload) => request(url, { method: 'PUT', payload })
    const del = (url) => request(url, { method: 'DELETE' })
    return { data, error, isLoading, request, get, post, put, del }
}
