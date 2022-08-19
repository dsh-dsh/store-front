<template>
    <SelectButton
        v-model="selectedFilter"
        :options="filters"
        optionLabel="name"
        optionValue="path"
        @change="setFilter"
    />
</template>

<script>
import SelectButton from 'primevue/selectbutton';

export default {
    name: 'DocContent',
    components: {
        SelectButton
    },
    props: {
        filter: String
    },
    data() {
        return {
            selectedFilter: this.$route.params.filter,
            filters: [
                { name: "Приходные",      path: 'posting' },
                { name: "Складские",      path: 'store'   },
                { name: "Заявки",         path: 'request' },
                { name: "Кассовые",       path: 'order'   },
                { name: "Чеки",           path: 'check'   },
                { name: "Инвентаризации", path: 'invent'  },
                { name: "Все",            path: ''        },
            ],
        };
    },
    watch: {
        filter (val) {
            this.selectedFilter = val;
        }
    },
    methods: {
        setFilter(event) {
            this.$router.push(`/documents/${event.value}`);  
        },
    },
}
</script>
