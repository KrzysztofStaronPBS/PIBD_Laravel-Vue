<template>
    <div class="mt-4">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white p-4 rounded border border-gray-200 shadow-sm">
            <div class="flex flex-wrap items-center gap-4 w-full md:w-auto">
                <div class="relative min-w-62.5">
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search by name..."
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                </div>

                <select
                    v-model="paymentFilter"
                    class="px-3 py-2 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                    <option value="all">All Payments</option>
                    <option value="paid">Paid Only</option>
                    <option value="unpaid">Unpaid Only</option>
                </select>
            </div>

            <router-link
                :to="{ name: 'students.create' }"
                class="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm whitespace-nowrap"
            >
                ADD NEW STUDENT
            </router-link>
        </div>

        <div v-if="isLoading" class="text-sky-600 font-semibold my-4">⏳ Loading...</div>

        <div v-else-if="error" class="text-red-600 font-bold my-4 p-2 bg-red-50 rounded border border-red-200">
            {{ error }}
        </div>

        <table v-else class="min-w-full table-auto border-collapse border border-gray-200 rounded shadow-sm bg-white">
            <thead>
            <tr class="bg-gray-100 text-gray-700 text-sm font-semibold uppercase select-none">
                <th @click="sortBy('first_name')" class="border border-gray-200 p-3 text-left cursor-pointer hover:bg-gray-200 transition-colors">
                    First name {{ getSortIcon('first_name') }}
                </th>
                <th @click="sortBy('last_name')" class="border border-gray-200 p-3 text-left cursor-pointer hover:bg-gray-200 transition-colors">
                    Last name {{ getSortIcon('last_name') }}
                </th>
                <th @click="sortBy('index')" class="border border-gray-200 p-3 text-left cursor-pointer hover:bg-gray-200 transition-colors">
                    Index nr {{ getSortIcon('index') }}
                </th>
                <th @click="sortBy('email')" class="border border-gray-200 p-3 text-left cursor-pointer hover:bg-gray-200 transition-colors">
                    E-mail {{ getSortIcon('email') }}
                </th>
                <th @click="sortBy('age')" class="border border-gray-200 p-3 text-center cursor-pointer hover:bg-gray-200 transition-colors">
                    Age {{ getSortIcon('age') }}
                </th>
                <th @click="sortBy('paid')" class="border border-gray-200 p-3 text-center cursor-pointer hover:bg-gray-200 transition-colors">
                    Payment {{ getSortIcon('paid') }}
                </th>
                <th class="border border-gray-200 p-3 text-center">Actions</th>
            </tr>
            </thead>
            <tbody class="text-gray-600 text-sm">
            <tr v-for="student in filteredAndSortedItems" :key="student.id" class="hover:bg-sky-50 transition-colors">
                <td class="border border-gray-200 p-3 font-medium">
                    <div class="flex items-center justify-between gap-2">
                        <span>{{ student.first_name }}</span>
                        <button
                            v-if="student.description"
                            @click="showDescription(student)"
                            title="Show description"
                            class="bg-sky-100 hover:bg-sky-200 text-sky-700 font-bold w-5 h-5 flex items-center justify-center rounded-full text-xs transition-colors cursor-pointer"
                        >
                            i
                        </button>
                    </div>
                </td>
                <td class="border border-gray-200 p-3">{{ student.last_name }}</td>

                <td class="border border-gray-200 p-3">{{ student.index }}</td>
                <td class="border border-gray-200 p-3">{{ student.email }}</td>

                <td class="border border-gray-200 p-3 text-center">{{ student.age }}</td>
                <td class="border border-gray-200 p-3 text-center">
                        <span :class="student.paid ? 'text-green-600 font-bold' : 'text-red-500'">
                            {{ student.paid ? "💰" : "🫰" }}
                        </span>
                </td>
                <td class="border border-gray-200 p-3 text-center space-x-2">
                    <router-link
                        :to="{ name: 'students.edit', params: { id: student.id } }"
                        class="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded text-xs font-semibold"
                    >
                        ✏️ Edit
                    </router-link>
                    <button
                        @click="deleteStudent(student)"
                        class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold cursor-pointer"
                    >
                        🗑️ Delete
                    </button>
                </td>
            </tr>
            <tr v-if="filteredAndSortedItems.length === 0">
                <td colspan="7" class="border border-gray-200 p-4 text-center text-gray-400 italic">
                    No students match the selected criteria.
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { onMounted, inject, ref, computed } from 'vue'
import { useResources } from '../../composables/features/resources.js'

const { items, isLoading, error, getAll, remove } = useResources('/api/students')
const popupService = inject('popupService', null)

// stany dla filtrowania i sortowania
const searchQuery = ref('')
const paymentFilter = ref('all')
const sortKey = ref('')
const sortOrder = ref(1) // 1 = ASC, -1 = DESC

onMounted(async () => {
    await getAll()
})

const filteredAndSortedItems = computed(() => {
    let result = [...items.value]

    // filtrowanie tekstowe (imię / nazwisko)
    if (searchQuery.value.trim() !== '') {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(student =>
            (student.first_name?.toLowerCase().includes(query)) ||
            (student.last_name?.toLowerCase().includes(query))
        )
    }

    // filtrowanie statusu płatności
    if (paymentFilter.value === 'paid') {
        result = result.filter(student => !!student.paid)
    } else if (paymentFilter.value === 'unpaid') {
        result = result.filter(student => !student.paid)
    }

    // sortowanie
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

// zmiana klucza sortowania
const sortBy = (key) => {
    if (sortKey.value === key) {
        // jeśli kliknięto tę samą kolumnę – kolejność odwrócona
        sortOrder.value = sortOrder.value * -1
    } else {
        // nowa kolumna – sortowanie rosnące
        sortKey.value = key
        sortOrder.value = 1
    }
}

// dynamiczne ikony kierunku sortowania
const getSortIcon = (key) => {
    if (sortKey.value !== key) return '↕️'
    return sortOrder.value === 1 ? '🔼' : '🔽'
}

// wyświetlenie opisu w popupie
const showDescription = async (student) => {
    const formattedMessage = `${student.first_name} ${student.last_name}: ${student.description}`

    if (popupService) {
        await popupService(
            formattedMessage,
            { confirm: "OK" },
            "INFORMATION"
        )
    } else {
        alert(`${student.first_name} ${student.last_name} description:\n${student.description}`)
    }
}

const deleteStudent = async (student) => {
    let confirmed = false
    const message = `Are you sure you want to delete student ${student.first_name} ${student.last_name}?`

    if (popupService) {
        const choice = await popupService(
            message,
            { cancel: "NO", confirmed: "YES" },
            "CONFIRMATION"
        )
        if (choice === "confirmed") confirmed = true
    } else {
        if (confirm(message)) confirmed = true
    }

    if (confirmed) {
        try {
            await remove(student.id)
            await getAll()
        } catch (e) {
            console.error('Delete action failed', e)
        }
    }
}
</script>
