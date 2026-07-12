<template>
    <div class="mt-4 bg-white p-6 rounded border border-gray-200 shadow-sm max-w-2xl mx-auto">
        <div class="flex justify-between items-center mb-6 border-b pb-3">
            <h2 class="text-xl font-bold text-gray-800">⚙️ Manage Tasks for: {{ studentName }}</h2>
            <router-link :to="{ name: 'dashboard' }" class="text-sm text-sky-600 hover:underline">
                Back to Students List
            </router-link>
        </div>

        <div v-if="loading" class="text-sky-600 font-semibold my-4">⏳ Loading context data...</div>

        <div v-else>
            <p class="text-gray-600 mb-4 text-sm">Check the tasks you want to assign to this student and set their details:</p>

            <div class="space-y-4 max-h-125 overflow-y-auto p-2 border border-gray-100 rounded">
                <div
                    v-for="task in allTasks"
                    :key="task.id"
                    :class="[
                        'p-4 rounded border transition-all flex flex-col gap-3',
                        form[task.id]?.assigned ? 'bg-sky-50/40 border-sky-200' : 'bg-white border-gray-200 hover:bg-gray-50'
                    ]"
                >
                    <div class="flex items-start gap-3">
                        <input
                            type="checkbox"
                            :id="'task-' + task.id"
                            v-model="form[task.id].assigned"
                            class="mt-1 rounded border-gray-300 text-sky-600 focus:ring-sky-500 h-4 w-4 cursor-pointer"
                        />
                        <label :for="'task-' + task.id" class="text-sm cursor-pointer select-none w-full">
                            <span class="font-semibold text-gray-700 block">{{ task.title || task.task_title }}</span>
                            <span class="text-gray-500 text-xs block mt-0.5">{{ task.description || 'No description provided.' }}</span>
                        </label>
                    </div>

                    <div
                        v-if="form[task.id]?.assigned"
                        class="grid grid-cols-2 gap-4 pl-7 pt-3 border-t border-dashed border-sky-100"
                    >
                        <div>
                            <label class="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Status</label>
                            <select
                                v-model="form[task.id].status"
                                class="w-full text-xs rounded border-gray-300 bg-white p-2 border shadow-sm focus:border-sky-500 focus:ring-sky-500"
                            >
                                <option value="pending">⏳ Pending</option>
                                <option value="completed">✅ Completed</option>
                                <option value="failed">❌ Failed</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Due Date</label>
                            <input
                                type="date"
                                v-model="form[task.id].due_date"
                                class="w-full text-xs rounded border-gray-300 p-2 border shadow-sm focus:border-sky-500 focus:ring-sky-500"
                            />
                        </div>
                    </div>
                </div>

                <div v-if="allTasks.length === 0" class="text-gray-400 italic p-4 text-center">
                    No tasks available. Create some in the "Tasks List" tab first!
                </div>
            </div>

            <div class="mt-6 flex justify-end">
                <button
                    @click="saveRelations"
                    :disabled="saving"
                    class="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-6 rounded text-sm transition-colors disabled:opacity-50 cursor-pointer"
                >
                    {{ saving ? 'Saving changes...' : '💾 Save Assignments' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const props = defineProps({
    id: { type: String, required: true }
})

const router = useRouter()
const popupService = inject('popupService', null)

const allTasks = ref([])
const form = ref({})
const studentName = ref('')
const loading = ref(true)
const saving = ref(false)

onMounted(async () => {
    try {
        // pobranie danych studenta, aby wyciągnąć imię i nazwisko
        try {
            const studentRes = await axios.get(`/api/students/${props.id}`)
            const studentData = studentRes.data.data || studentRes.data

            studentName.value = studentData.name ||
                `${studentData.first_name || ''} ${studentData.last_name || ''}`.trim() ||
                `Student ID: ${props.id}`;
        } catch (studentError) {
            console.error("Failed to fetch student details, using fallback ID.", studentError)
            studentName.value = `Student ID: ${props.id}`
        }

        // pobieranie słownika wszystkich zadań
        const tasksRes = await axios.get('/api/tasks')
        allTasks.value = tasksRes.data.data || tasksRes.data

        // inicjalizacja domyślnego, czystego stanu formularza dla każdego zadania
        allTasks.value.forEach(task => {
            form.value[task.id] = {
                assigned: false,
                status: 'pending',
                due_date: ''
            }
        })

        // pobranie aktualnie przypisanego powiązania dla tego studenta wraz z danymi pivot
        const relationRes = await axios.get(`/api/students/${props.id}/tasks`)
        const attachedTasks = relationRes.data.attached || {}

        // wypełnienie formularza danymi z bazy
        Object.keys(attachedTasks).forEach(taskId => {
            if (form.value[taskId]) {
                form.value[taskId].assigned = true
                form.value[taskId].status = attachedTasks[taskId].status || 'pending'
                form.value[taskId].due_date = attachedTasks[taskId].due_date || ''
            }
        })
    } catch (e) {
        console.error("Failed to load tasks synchronization context", e)
    } finally {
        loading.value = false
    }
})

const saveRelations = async () => {
    saving.value = true

    const payloadTasks = Object.keys(form.value)
        .filter(taskId => form.value[taskId].assigned)
        .map(taskId => ({
            id: parseInt(taskId),
            status: form.value[taskId].status,
            due_date: form.value[taskId].due_date || null
        }))

    try {
        await axios.post(`/api/students/${props.id}/tasks`, {
            tasks: payloadTasks
        })

        const msg = "Student tasks synchronized successfully!"
        if (popupService) {
            await popupService(msg, { confirm: "OK" }, "SUCCESS")
        } else {
            alert(msg)
        }
        await router.push({name: 'dashboard'})
    } catch (e) {
        console.error("Failed to sync relations", e)
    } finally {
        saving.value = false
    }
}
</script>
