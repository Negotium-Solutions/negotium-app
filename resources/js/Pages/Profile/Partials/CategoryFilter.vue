<script setup>
  import { useProcessesStore, useCategoriesStore } from "@/stores";

  const processStore = useProcessesStore();
  const categoryStore = useCategoriesStore();
</script>

<template>
    <div class="row m-0 p-0">
        <div class="pr-1 mb-2">
            <button :class="['flex gap-2 justify-center py-2.5 px-3 text-xs leading-3 rounded border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white', { 'bg-neutral-700 text-white' : processStore.isSelectedCategory(0) }]" @click="processStore.toogleCategory(0)">All</button>
        </div>
        <div v-for="(category, index) in categoryStore.getCategories()" :key="index" class="px-1 mb-2">
            <button :class="['flex gap-2 justify-center py-2.5 px-3 text-xs leading-3 rounded border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white', { 'bg-neutral-700 text-white' : processStore.isSelectedCategory(category.id) }]" @click="processStore.toogleCategory(category.id)"><i class="fa fa-square" :style="'color: '+category.color"></i>&nbsp;&nbsp;{{category.name}}</button>
        </div>
    </div>
</template>