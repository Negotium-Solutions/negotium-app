<script setup>
import {ref, defineProps, onMounted, reactive} from "vue";

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  initialActiveIndex: {
    type: Number,
    default: 0
  }
});

const pageProps = reactive({
  activeIndex: 0,
  isShowItem: []
});

onMounted(() => {
  setActive(props.initialActiveIndex);
});

function setActive(index)
{
  console.log('Index: ', index);
  props.items.forEach((item, index) => {
    pageProps.isShowItem[index] = false;
  });

  pageProps.activeIndex = index;

  pageProps.isShowItem[index] = true;
  if(index !== 0) {
    pageProps.isShowItem[index - 1] = true;
  }

  if(index !== (props.items.length - 1)) {
    pageProps.isShowItem[index + 1] = true;
  }
}
</script>

<template>
  <div class="row ml-1 mr-1">
    <template v-for="(item, index_) in props.items" :key="index_">
    <div class="col-md-4" v-if="pageProps.isShowItem[index_]">
      <div class="row" :id="'row_'+index_">
        <div class="col-md-10 pl-0 pr-0"
             :class="{ active: pageProps.activeIndex === index_ }"
             @click="setActive(index_)"
        >
          <slot :item="item">

          </slot>
        </div>
        <div class="col-md-2 pl-0 pr-0" v-if="(pageProps.activeIndex !== index_ - 1)">
          <hr class="mt-7" style="border-color: rgb(67, 170, 139);">
        </div>
      </div>
    </div>
    </template>
    <div class="col-md-3 pl-0" v-if="pageProps.activeIndex === (props.items.length - 1)">
      <a href="http://localhost:8001/process-manager/edit/9d1478fb-1273-4212-bf32-3b1cda2742c7" class="mt-2 flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white w-40">
        <i data-v-5e438453="" class="pi pi-plus text-sm custom-icon-sm"></i> Add Step
      </a>
    </div>
  </div>
</template>
