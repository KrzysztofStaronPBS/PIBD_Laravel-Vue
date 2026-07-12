<template>
    <div class="mt-4">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white p-4 rounded border border-gray-200 shadow-sm">
            <div class="flex flex-wrap items-center gap-4 w-full md:w-auto">
                <div class="relative min-w-62.5">
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search by title..."
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                </div>
            </div>

            <router-link
                :to="{ name: 'tasks.create' }"
                class="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm whitespace-nowrap"
            >
                ADD NEW TASK
            </router-link>
        </div>

        <div v-if="isLoading" class="text-sky-600 font-semibold my-4">⏳ Loading...</div>

        <div v-else-if="error" class="text-red-600 font-bold my-4 p-2 bg-red-50 rounded border border-red-200">
            {{ error }}
        </div>

        <table v-else class="min-w-full table-auto border-collapse border border-gray-200 rounded shadow-sm bg-white">
            <thead>
            <tr class="bg-gray-100 text-gray-700 text-sm font-semibold uppercase select-none">
                <th @click="sortBy('title')" class="border border-gray-200 p-3 text-left cursor-pointer hover:bg-gray-200 transition-colors">
                    Task Title {{ getSortIcon('title') }}
                </th>
                <th class="border border-gray-200 p-3 text-center w-48">Actions</th>
            </tr>
            </thead>
            <tbody class="text-gray-600 text-sm">
            <tr v-for="task in filteredAndSortedItems" :key="task.id" class="hover:bg-sky-50 transition-colors">
                <td class="border border-gray-200 p-3 font-medium">
                    <div class="flex items-center justify-between gap-4">
                        <span>{{ task.title }}</span>
                        <button
                            v-if="task.description"
                            @click="showDescription(task)"
                            title="Show full description"
                            class="bg-sky-100 hover:bg-sky-200 text-sky-700 font-bold w-5 h-5 flex items-center justify-center rounded-full text-xs transition-colors cursor-pointer shrink-0"
                        >
                            i
                        </button>
                    </div>
                </td>
                <td class="border border-gray-200 p-3 text-center space-x-2 whitespace-nowrap">
                    <router-link
                        :to="{ name: 'tasks.edit', params: { id: task.id } }"
                        class="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded text-xs font-semibold inline-block transition-colors"
                    >
                        ✏️ Edit
                    </router-link>
                    <button
                        @click="deleteTask(task)"
                        class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold cursor-pointer"
                    >
                        🗑️ Delete
                    </button>
                </td>
            </tr>
            <tr v-if="filteredAndSortedItems.length === 0">
                <td colspan="2" class="border border-gray-200 p-4 text-center text-gray-400 italic">
                    No tasks available in the dictionary.
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { onMounted, inject, ref, computed } from 'vue'
import { useResources } from '../../composables/features/resources.js'

const { items, isLoading, error, getAll, remove } = useResources('/api/tasks')
const popupService = inject('popupService', null)

const searchQuery = ref('')
const sortKey = ref('')
const sortOrder = ref(1)

onMounted(async () => {
    await getAll()
})

const filteredAndSortedItems = computed(() => {
    let result = [...items.value]

    if (searchQuery.value.trim() !== '') {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(task => task.title?.toLowerCase().includes(query))
    }

    if (sortKey.value) {
        result.sort((a, b) => {
            let valA = a[sortKey.value]
            let valB = b[sortKey.value]
            if (typeof valA === 'string') valA = valA.toLowerCase()
            if (typeof valB === 'string') valB = valB.toLowerCase()

            if (valA < valB) return -1 * sortOrder.value
            if (valA > valB) return 1 * sortOrder.value
            return 0
        })
    }
    return result
})

const sortBy = (key) => {
    if (sortKey.value === key) {
        sortOrder.value = sortOrder.value * -1
    } else {
        sortKey.value = key
        sortOrder.value = 1
    }
}

const getSortIcon = (key) => {
    if (sortKey.value !== key) return '↕️'
    return sortOrder.value === 1 ? '🔼' : '🔽'
}

const showDescription = async (task) => {
    const formattedMessage = `Task: ${task.title}\n\n ${task.description}`
    if (popupService) {
        await popupService(formattedMessage, { confirm: "OK" }, "INFORMATION")
    } else {
        alert(formattedMessage)
    }
}

const deleteTask = async (task) => {
    let confirmed = false
    const message = `Are you sure you want to delete task\n"${task.title}"?`

    if (popupService) {
        const choice = await popupService(message, { cancel: "NO", confirmed: "YES" }, "CONFIRMATION")
        if (choice === "confirmed") confirmed = true
    } else {
        if (confirm(message)) confirmed = true
    }

    if (confirmed) {
        try {
            await remove(task.id)
            await getAll()
        } catch (e) {
            console.error('Delete task failed', e)
        }
    }
}
</script>
